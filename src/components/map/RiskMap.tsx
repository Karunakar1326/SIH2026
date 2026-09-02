import { useEffect, useRef, useCallback, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import { useMapStore } from '@/stores';
import { habitations } from '@/data/habitations';
import { historicalEvents } from '@/data/historical-events';
import { safeSites } from '@/data/safe-sites';
import { riskColor } from '@/utils/helpers';
import { getGraphHopperRoute, type GraphHopperRouteResult } from '@/services/graphhopper';
import { Layers, Maximize2, Minimize2, LocateFixed, ShieldAlert, Navigation, Route, Zap } from 'lucide-react';

interface RiskMapProps {
  center?: [number, number];
  zoom?: number;
  height?: string;
  showControls?: boolean;
  showLegend?: boolean;
  showLayerPanel?: boolean;
  onHabitationClick?: (id: string) => void;
  onEventClick?: (id: string) => void;
  onSiteClick?: (id: string) => void;
  highlightHabitationId?: string;
  className?: string;
}

export function RiskMap({
  center = [85.8, 20.0],
  zoom = 7.5,
  height = '100%',
  showControls = true,
  showLegend = true,
  showLayerPanel = true,
  onHabitationClick,
  onEventClick,
  onSiteClick,
  highlightHabitationId,
  className = '',
}: RiskMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [layerPanelOpen, setLayerPanelOpen] = useState(false);

  // GraphHopper Routing States
  const [selectedHabId, setSelectedHabId] = useState<string>(highlightHabitationId || 'hab-001');
  const [selectedSiteId, setSelectedSiteId] = useState<string>('site-001');
  const [activeRoute, setActiveRoute] = useState<GraphHopperRouteResult | null>(null);
  const [isRoutingLoading, setIsRoutingLoading] = useState<boolean>(false);
  const [showRoutePanel, setShowRoutePanel] = useState<boolean>(false);

  const layers = useMapStore((s) => s.layers);
  const toggleLayer = useMapStore((s) => s.toggleLayer);

  const clearMarkers = useCallback(() => {
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];
  }, []);

  // Update Route via GraphHopper API
  const updateGraphHopperRoute = useCallback(async (habId: string, siteId: string) => {
    const hab = habitations.find(h => h.id === habId);
    const site = safeSites.find(s => s.id === siteId);

    if (!hab || !site || !map.current) return;
    setIsRoutingLoading(true);

    try {
      const result = await getGraphHopperRoute(
        { lat: hab.coordinates.lat, lng: hab.coordinates.lng },
        { lat: site.coordinates.lat, lng: site.coordinates.lng },
        'car'
      );

      setActiveRoute(result);

      // Render or Update MapLibre GeoJSON Layer for Route
      if (map.current.loaded()) {
        const geojsonData: any = {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: result.coordinates,
          },
        };

        if (map.current.getSource('graphhopper-route-src')) {
          (map.current.getSource('graphhopper-route-src') as maplibregl.GeoJSONSource).setData(geojsonData);
        } else {
          map.current.addSource('graphhopper-route-src', {
            type: 'geojson',
            data: geojsonData,
          });

          // Outer glow line
          map.current.addLayer({
            id: 'graphhopper-route-glow',
            type: 'line',
            source: 'graphhopper-route-src',
            layout: { 'line-join': 'round', 'line-cap': 'round' },
            paint: {
              'line-color': '#0284c7',
              'line-width': 8,
              'line-opacity': 0.4,
            },
          });

          // Main line
          map.current.addLayer({
            id: 'graphhopper-route-line',
            type: 'line',
            source: 'graphhopper-route-src',
            layout: { 'line-join': 'round', 'line-cap': 'round' },
            paint: {
              'line-color': '#0284c7',
              'line-width': 4,
            },
          });
        }

        // Fit map bounds to encompass origin and destination route
        const bounds = new maplibregl.LngLatBounds();
        result.coordinates.forEach(coord => bounds.extend(coord));
        map.current.fitBounds(bounds, { padding: 50, maxZoom: 12 });
      }
    } catch (err) {
      console.error('GraphHopper Route fetch error:', err);
    } finally {
      setIsRoutingLoading(false);
    }
  }, []);

  const addMarkers = useCallback(() => {
    if (!map.current) return;
    clearMarkers();

    const habLayer = layers.find(l => l.id === 'habitations');
    const evtLayer = layers.find(l => l.id === 'historical-events');
    const siteLayer = layers.find(l => l.id === 'safe-sites');

    // Habitation markers
    if (habLayer?.active) {
      habitations.forEach((hab) => {
        const el = document.createElement('div');
        const isHighlighted = (highlightHabitationId || selectedHabId) === hab.id;
        const isRedZone = hab.red_zone.isRedZone;
        const size = isHighlighted ? 22 : (isRedZone ? 16 : 12);

        el.style.width = `${size}px`;
        el.style.height = `${size}px`;
        el.style.borderRadius = '50%';
        el.style.backgroundColor = isRedZone ? '#ef4444' : riskColor(hab.risk_level);
        el.style.border = `2px solid ${isHighlighted ? '#fff' : (isRedZone ? '#7f1d1d' : 'rgba(255,255,255,0.7)')}`;
        el.style.cursor = 'pointer';
        el.style.boxShadow = isHighlighted
          ? '0 0 16px rgba(239,68,68,0.8)'
          : (isRedZone ? '0 0 8px rgba(239,68,68,0.5)' : '0 1px 4px rgba(0,0,0,0.3)');
        if (isHighlighted || isRedZone) el.style.zIndex = '10';

        const popup = new maplibregl.Popup({ offset: 14, closeButton: false, maxWidth: '280px' })
          .setHTML(`
            <div style="padding:12px;font-family:Inter,sans-serif;background:#fff;border-radius:8px;">
              <div style="font-size:10px;font-weight:700;letter-spacing:0.5px;color:${isRedZone ? '#ef4444' : '#697077'};margin-bottom:2px;">
                ${isRedZone ? '⚠️ RED-ZONE CLASSIFIED' : 'HABITATION PROFILE'}
              </div>
              <div style="font-weight:700;font-size:14px;color:#121619;margin-bottom:4px;">${hab.name}</div>
              <div style="font-size:11px;color:#4d5358;margin-bottom:8px;">
                ${hab.district} · Pop: ${hab.population.toLocaleString()} · Elev: ${hab.elevation_m}m MSL
              </div>
              <div style="display:flex;gap:12px;background:#f8f9fb;padding:8px;border-radius:6px;margin-bottom:8px;">
                <div>
                  <div style="font-size:9px;color:#878d96;text-transform:uppercase;">Multi-Hazard Risk</div>
                  <div style="font-size:16px;font-weight:800;color:${riskColor(hab.risk_level)}">${hab.risk_score}/100</div>
                </div>
                <div>
                  <div style="font-size:9px;color:#878d96;text-transform:uppercase;">Relocation Priority</div>
                  <div style="font-size:16px;font-weight:800;color:#121619">${hab.relocation_priority}/100</div>
                </div>
              </div>
              ${isRedZone ? `<div style="font-size:10px;color:#991b1b;background:#fef2f2;padding:6px;border-radius:4px;margin-bottom:8px;border:1px solid #fecaca;">Trigger: ${hab.red_zone.primaryTrigger}</div>` : ''}
              <div style="font-size:11px;color:#3b82f6;cursor:pointer;font-weight:600;text-align:right;">Open Intelligence Profile →</div>
            </div>
          `);

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([hab.coordinates.lng, hab.coordinates.lat])
          .setPopup(popup)
          .addTo(map.current!);

        el.addEventListener('click', () => {
          setSelectedHabId(hab.id);
          onHabitationClick?.(hab.id);
          updateGraphHopperRoute(hab.id, selectedSiteId);
        });

        markersRef.current.push(marker);
      });
    }

    // Historical event markers
    if (evtLayer?.active) {
      historicalEvents.forEach((evt) => {
        const el = document.createElement('div');
        el.style.width = '12px';
        el.style.height = '12px';
        el.style.borderRadius = '3px';
        el.style.transform = 'rotate(45deg)';
        el.style.backgroundColor = '#8b5cf6';
        el.style.border = '2px solid rgba(255,255,255,0.9)';
        el.style.cursor = 'pointer';
        el.style.boxShadow = '0 2px 6px rgba(0,0,0,0.4)';

        el.addEventListener('click', () => onEventClick?.(evt.id));

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([evt.coordinates.lng, evt.coordinates.lat])
          .addTo(map.current!);

        markersRef.current.push(marker);
      });
    }

    // Safe site markers
    if (siteLayer?.active) {
      safeSites.filter(s => s.status === 'suitable').forEach((site) => {
        const el = document.createElement('div');
        const isSelected = selectedSiteId === site.id;
        el.style.width = isSelected ? '18px' : '14px';
        el.style.height = isSelected ? '18px' : '14px';
        el.style.borderRadius = '4px';
        el.style.backgroundColor = '#10b981';
        el.style.border = `2px solid ${isSelected ? '#000' : '#ffffff'}`;
        el.style.cursor = 'pointer';
        el.style.boxShadow = isSelected ? '0 0 12px rgba(16,185,129,0.9)' : '0 2px 6px rgba(16,185,129,0.5)';

        el.addEventListener('click', () => {
          setSelectedSiteId(site.id);
          onSiteClick?.(site.id);
          updateGraphHopperRoute(selectedHabId, site.id);
        });

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([site.coordinates.lng, site.coordinates.lat])
          .addTo(map.current!);

        markersRef.current.push(marker);
      });
    }
  }, [layers, highlightHabitationId, selectedHabId, selectedSiteId, onHabitationClick, onEventClick, onSiteClick, clearMarkers, updateGraphHopperRoute]);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'light-basemap': {
            type: 'raster',
            tiles: [
              'https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png',
              'https://b.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png',
            ],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors © CARTO',
          },
        },
        layers: [
          {
            id: 'light-basemap-layer',
            type: 'raster',
            source: 'light-basemap',
            minzoom: 0,
            maxzoom: 19,
          },
        ],
      },
      center: center,
      zoom: zoom,
      attributionControl: false,
    });

    if (showControls) {
      map.current.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'top-right');
      map.current.addControl(new maplibregl.ScaleControl({ maxWidth: 150 }), 'bottom-left');
    }

    map.current.on('load', () => {
      addMarkers();
      // Fetch initial GraphHopper Evacuation Route
      updateGraphHopperRoute(selectedHabId, selectedSiteId);
    });

    return () => {
      clearMarkers();
      map.current?.remove();
      map.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (map.current?.loaded()) {
      addMarkers();
    }
  }, [addMarkers]);

  const toggleFullscreen = () => {
    const container = mapContainer.current?.parentElement;
    if (!container) return;
    if (!isFullscreen) {
      container.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className={`relative ${className}`} style={{ height }}>
      <div ref={mapContainer} className="w-full h-full rounded-2xl overflow-hidden border border-white/10" />

      {/* GraphHopper API Live Status Badge */}
      <div className="absolute top-3 left-14 z-10 flex items-center gap-2.5 bg-[#1C1C1C]/90 backdrop-blur-md text-white text-[11px] font-mono px-3.5 py-1.5 rounded-2xl shadow-xl border border-white/10">
        <Zap size={13} className="text-[#FFB020] animate-pulse" />
        <span className="font-bold text-[#FFB020]">GraphHopper API Live</span>
        <span className="text-[#6B6B6B]">|</span>
        <span className="text-[#F5F5F5]">
          {activeRoute
            ? `${activeRoute.distance_km} km · ${activeRoute.time_minutes} min drive`
            : isRoutingLoading ? 'Calculating Road Route...' : 'Ready'}
        </span>
        <button
          onClick={() => setShowRoutePanel(!showRoutePanel)}
          className="ml-1 text-xs bg-gradient-to-r from-[#FF7A3D] to-[#FF3D1F] text-white px-3 py-1 rounded-xl font-sans font-bold flex items-center gap-1.5 cursor-pointer shadow-[0_0_16px_rgba(255,90,31,0.35)] hover:shadow-[0_0_24px_rgba(255,90,31,0.55)] transition-all"
        >
          <Route size={12} />
          <span>Evacuation Route</span>
        </button>
      </div>

      {/* GraphHopper Evacuation Route Inspection Drawer */}
      {showRoutePanel && (
        <div className="absolute top-14 left-3 w-84 bg-[#1C1C1C]/95 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl p-4 z-20 animate-fade-in text-xs text-[#F5F5F5]">
          <div className="flex items-center justify-between border-b border-white/10 pb-2.5 mb-3">
            <div className="flex items-center gap-2 font-bold text-white">
              <Navigation size={15} className="text-[#FF5A1F]" />
              <span>GraphHopper Evacuation Route</span>
            </div>
            <button
              onClick={() => setShowRoutePanel(false)}
              className="text-[#9A9A9A] hover:text-white font-bold px-1 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Selector Inputs */}
          <div className="space-y-2.5 mb-3">
            <div>
              <label className="text-[10px] text-[#9A9A9A] font-bold uppercase tracking-wider block mb-1">Origin Habitation:</label>
              <select
                value={selectedHabId}
                onChange={(e) => {
                  setSelectedHabId(e.target.value);
                  updateGraphHopperRoute(e.target.value, selectedSiteId);
                }}
                className="w-full bg-[#232323] border border-white/10 rounded-xl px-2.5 py-1.5 font-semibold text-white text-xs focus:ring-1 focus:ring-[#FF5A1F]"
              >
                {habitations.map(h => (
                  <option key={h.id} value={h.id} className="bg-[#1C1C1C] text-white">
                    {h.name} ({h.red_zone.isRedZone ? 'RED-ZONE' : 'Habitation'})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] text-[#9A9A9A] font-bold uppercase tracking-wider block mb-1">Destination Safe Site:</label>
              <select
                value={selectedSiteId}
                onChange={(e) => {
                  setSelectedSiteId(e.target.value);
                  updateGraphHopperRoute(selectedHabId, e.target.value);
                }}
                className="w-full bg-[#232323] border border-white/10 rounded-xl px-2.5 py-1.5 font-semibold text-white text-xs focus:ring-1 focus:ring-[#FF5A1F]"
              >
                {safeSites.filter(s => s.status === 'suitable').map(s => (
                  <option key={s.id} value={s.id} className="bg-[#1C1C1C] text-white">
                    {s.name} (Cap: {s.carrying_capacity.estimated_sustainable_capacity})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Route Metrics Summary */}
          {activeRoute && (
            <div className="bg-[#232323] border border-white/8 rounded-xl p-3 space-y-2 mb-3">
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="bg-[#1C1C1C] p-2 rounded-xl border border-white/5">
                  <div className="text-[9px] text-[#9A9A9A] uppercase tracking-wider font-semibold">Road Distance</div>
                  <div className="text-sm font-black text-[#FF5A1F] tabular-nums">{activeRoute.distance_km} km</div>
                </div>
                <div className="bg-[#1C1C1C] p-2 rounded-xl border border-white/5">
                  <div className="text-[9px] text-[#9A9A9A] uppercase tracking-wider font-semibold">Est. Travel Time</div>
                  <div className="text-sm font-black text-[#2ECC71] tabular-nums">{activeRoute.time_minutes} mins</div>
                </div>
              </div>

              {activeRoute.isFallback && (
                <div className="text-[10px] text-[#FFB020] bg-[#FFB020]/10 border border-[#FFB020]/30 p-2 rounded-xl font-medium">
                  ⚠️ Using Geodesic Road Approximation
                </div>
              )}
            </div>
          )}

          {/* Step-by-Step Directions */}
          {activeRoute && activeRoute.instructions.length > 0 && (
            <div>
              <div className="text-[10px] font-bold text-[#9A9A9A] uppercase tracking-wider mb-1.5">Turn-by-Turn Directions:</div>
              <div className="max-h-36 overflow-y-auto space-y-1 pr-1 scrollbar-thin">
                {activeRoute.instructions.map((inst, idx) => (
                  <div key={idx} className="flex gap-2 text-[11px] text-[#F5F5F5] py-1 border-b border-white/5 last:border-0">
                    <span className="font-mono text-[#FF5A1F] font-bold">{idx + 1}.</span>
                    <span className="flex-1">{inst.text}</span>
                    <span className="font-mono text-[10px] text-[#9A9A9A]">
                      {(inst.distance_m / 1000).toFixed(1)} km
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Floating Controls */}
      {showControls && (
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          <button
            onClick={toggleFullscreen}
            className="w-8 h-8 bg-[#1C1C1C]/90 backdrop-blur-md text-white rounded-xl shadow-lg border border-white/10 flex items-center justify-center hover:bg-[#232323] transition-all"
            title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
          <button
            onClick={() => {
              map.current?.flyTo({ center, zoom, duration: 1000 });
            }}
            className="w-8 h-8 bg-[#1C1C1C]/90 backdrop-blur-md text-white rounded-xl shadow-lg border border-white/10 flex items-center justify-center hover:bg-[#232323] transition-all"
            title="Reset view"
          >
            <LocateFixed size={14} />
          </button>
        </div>
      )}

      {/* Layer Panel Toggle */}
      {showLayerPanel && (
        <div className="absolute top-3 right-14 z-10">
          <button
            onClick={() => setLayerPanelOpen(!layerPanelOpen)}
            className={`w-8 h-8 rounded-xl shadow-lg border flex items-center justify-center transition-all ${
              layerPanelOpen ? 'bg-gradient-to-r from-[#FF7A3D] to-[#FF3D1F] text-white border-transparent shadow-[0_0_16px_rgba(255,90,31,0.4)]' : 'bg-[#1C1C1C]/90 backdrop-blur-md text-white border-white/10 hover:bg-[#232323]'
            }`}
            title="Toggle GIS layers"
          >
            <Layers size={14} />
          </button>

          {layerPanelOpen && (
            <div className="absolute right-0 top-10 w-56 bg-[#1C1C1C] text-white rounded-2xl shadow-2xl border border-white/10 p-3.5 animate-fade-in z-20">
              <div className="text-xs font-bold text-white mb-2 border-b border-white/10 pb-1.5 tracking-tight">
                Authoritative GIS Layers
              </div>
              <div className="space-y-1.5">
                {layers.map((layer) => (
                  <label key={layer.id} className="flex items-center gap-2 text-xs text-[#9A9A9A] py-0.5 cursor-pointer hover:text-white transition-colors">
                    <input
                      type="checkbox"
                      checked={layer.active}
                      onChange={() => toggleLayer(layer.id)}
                      className="rounded border-white/20 text-[#FF5A1F] focus:ring-[#FF5A1F] w-3.5 h-3.5 bg-[#232323]"
                    />
                    <span>{layer.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Legend */}
      {showLegend && (
        <div className="absolute bottom-3 right-3 bg-[#1C1C1C]/90 backdrop-blur-md text-white rounded-2xl shadow-xl border border-white/10 px-3.5 py-2.5 z-10 text-[10px]">
          <div className="font-bold text-white mb-1.5 border-b border-white/10 pb-1 flex items-center gap-1.5">
            <ShieldAlert size={12} className="text-[#FF4D4D]" />
            <span>GIS Map Legend</span>
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#FF4D4D] border border-red-950 inline-block shrink-0 shadow-[0_0_8px_rgba(255,77,77,0.5)]" />
              <span className="font-bold text-[#FF4D4D]">RED-ZONE CLASSIFIED (Critical Risk)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF5A1F] inline-block shrink-0" />
              <span className="text-[#9A9A9A]">High Risk Habitation</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFB020] inline-block shrink-0" />
              <span className="text-[#9A9A9A]">Moderate Risk</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-[#2ECC71] border border-white/30 inline-block shrink-0" />
              <span className="font-bold text-[#2ECC71]">Eligible Safe Relocation Site</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-1 bg-[#FF5A1F] rounded inline-block shrink-0 shadow-[0_0_6px_rgba(255,90,31,0.6)]" />
              <span className="font-bold text-[#FF5A1F]">GraphHopper Evacuation Route</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
