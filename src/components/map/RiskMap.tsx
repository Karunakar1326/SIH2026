import { useEffect, useRef, useCallback, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import { useMapStore } from '@/stores';
import { habitations } from '@/data/habitations';
import { historicalEvents } from '@/data/historical-events';
import { safeSites } from '@/data/safe-sites';
import { riskColor } from '@/utils/helpers';
import { Layers, Maximize2, Minimize2, LocateFixed, ShieldAlert } from 'lucide-react';

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
  const layers = useMapStore((s) => s.layers);
  const toggleLayer = useMapStore((s) => s.toggleLayer);

  const clearMarkers = useCallback(() => {
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];
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
        const isHighlighted = highlightHabitationId === hab.id;
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
          onHabitationClick?.(hab.id);
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
        el.style.width = '14px';
        el.style.height = '14px';
        el.style.borderRadius = '4px';
        el.style.backgroundColor = '#10b981';
        el.style.border = '2px solid #ffffff';
        el.style.cursor = 'pointer';
        el.style.boxShadow = '0 2px 6px rgba(16,185,129,0.5)';

        el.addEventListener('click', () => onSiteClick?.(site.id));

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([site.coordinates.lng, site.coordinates.lat])
          .addTo(map.current!);

        markersRef.current.push(marker);
      });
    }
  }, [layers, highlightHabitationId, onHabitationClick, onEventClick, onSiteClick, clearMarkers]);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
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
      <div ref={mapContainer} className="w-full h-full rounded-lg overflow-hidden" />

      {/* Floating Controls */}
      {showControls && (
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          <button
            onClick={toggleFullscreen}
            className="w-8 h-8 bg-white/95 backdrop-blur-xs rounded-md shadow-sm border border-neutral-300 flex items-center justify-center hover:bg-neutral-50 transition-colors"
            title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
          <button
            onClick={() => {
              map.current?.flyTo({ center, zoom, duration: 1000 });
            }}
            className="w-8 h-8 bg-white/95 backdrop-blur-xs rounded-md shadow-sm border border-neutral-300 flex items-center justify-center hover:bg-neutral-50 transition-colors"
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
            className={`w-8 h-8 rounded-md shadow-sm border flex items-center justify-center transition-colors ${
              layerPanelOpen ? 'bg-accent text-white border-accent' : 'bg-white/95 backdrop-blur-xs border-neutral-300 hover:bg-neutral-50'
            }`}
            title="Toggle GIS layers"
          >
            <Layers size={14} />
          </button>

          {layerPanelOpen && (
            <div className="absolute right-0 top-10 w-56 bg-white rounded-lg shadow-xl border border-neutral-300 p-3 animate-fade-in z-20">
              <div className="text-xs font-bold text-neutral-800 mb-2 border-b border-neutral-200 pb-1.5">
                Authoritative GIS Layers
              </div>
              <div className="space-y-1.5">
                {layers.map((layer) => (
                  <label key={layer.id} className="flex items-center gap-2 text-xs text-neutral-700 py-0.5 cursor-pointer hover:text-neutral-950">
                    <input
                      type="checkbox"
                      checked={layer.active}
                      onChange={() => toggleLayer(layer.id)}
                      className="rounded border-neutral-300 text-accent focus:ring-accent w-3.5 h-3.5"
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
        <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-xs rounded-lg shadow-sm border border-neutral-300 px-3 py-2 z-10 text-[10px]">
          <div className="font-bold text-neutral-800 mb-1.5 border-b border-neutral-200 pb-1 flex items-center gap-1">
            <ShieldAlert size={12} className="text-red-600" />
            <span>GIS Map Legend</span>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-600 border border-red-900 inline-block shrink-0" />
              <span className="font-bold text-red-900">RED-ZONE CLASSIFIED (Critical Risk)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block shrink-0" />
              <span className="text-neutral-700">High Risk Habitation</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 inline-block shrink-0" />
              <span className="text-neutral-700">Moderate Risk</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-emerald-500 border border-white inline-block shrink-0" />
              <span className="font-bold text-emerald-800">Eligible Safe Relocation Site</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-purple-500 rotate-45 inline-block shrink-0" />
              <span className="text-neutral-700">Historical Event Site</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
