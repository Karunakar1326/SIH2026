import { useState, useMemo } from 'react';
import { PageHeader, IntensityMetric, StatusBadge, SectionHeader } from '@/components/shared';
import { historicalEvents } from '@/data/historical-events';
import { currentConditions } from '@/data/alerts';
import { hazardLabel, hazardIcon, formatNumber } from '@/utils/helpers';
import type { HazardType, HistoricalEvent } from '@/data/types';
import { agencyMeta } from '@/data/types';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { Calendar, GitCompare, ExternalLink, Radio } from 'lucide-react';

function getIntensityFields(event: HistoricalEvent): { label: string; value: string | number; unit: string; tooltip: string }[] {
  const i = event.intensity;
  switch (i.type) {
    case 'cyclone': return [
      { label: 'Max sustained wind', value: i.max_sustained_wind_kmh, unit: 'km/h', tooltip: 'IMD maximum 3-minute sustained wind speed at 10m height.' },
      { label: 'Min central pressure', value: i.min_central_pressure_hpa, unit: 'hPa', tooltip: 'IMD barometric minimum central pressure.' },
      { label: 'Rainfall', value: i.rainfall_mm, unit: 'mm', tooltip: 'IMD accumulated event rainfall.' },
      { label: 'Storm surge', value: i.storm_surge_m, unit: 'm', tooltip: 'IMD/INCOIS sea surface level rise above normal astronomical tide.' },
      { label: 'Movement speed', value: i.movement_speed_kmh, unit: 'km/h', tooltip: 'Cyclone center translation speed.' },
    ];
    case 'flood': return [
      { label: 'Peak water level', value: i.peak_water_level_m, unit: 'm MSL', tooltip: 'CWC peak river gauge height.' },
      { label: 'Peak discharge', value: i.peak_discharge_m3s.toLocaleString(), unit: 'm³/s', tooltip: 'CWC maximum river flow volume per second.' },
      { label: 'Flood depth', value: i.flood_depth_m, unit: 'm', tooltip: 'Average ground inundation water depth.' },
      { label: 'Rainfall', value: i.rainfall_mm, unit: 'mm', tooltip: 'Catchment precipitation total.' },
      { label: 'Duration', value: i.duration_hours, unit: 'hours', tooltip: 'Flood onset to recession duration.' },
      { label: 'Flooded area', value: i.flooded_area_sqkm.toLocaleString(), unit: 'km²', tooltip: 'ISRO SAR imagery mapped inundation area.' },
    ];
    case 'landslide': return [
      { label: 'Trigger rainfall', value: i.trigger_rainfall_mm, unit: 'mm', tooltip: 'GSI 72-hour cumulative antecedent rainfall.' },
      { label: 'Slope', value: i.slope_degrees, unit: '°', tooltip: 'ISRO CartoDEM hill slope gradient.' },
      { label: 'Affected area', value: i.affected_area_sqkm, unit: 'km²', tooltip: 'Landslide debris footprint.' },
      { label: 'Volume', value: i.volume_m3.toLocaleString(), unit: 'm³', tooltip: 'Displaced earth volume.' },
      { label: 'Runout distance', value: i.runout_distance_m, unit: 'm', tooltip: 'Debris travel distance from source.' },
    ];
    case 'extreme_rainfall': return [
      { label: '1-hour rainfall', value: i.rainfall_1hr_mm, unit: 'mm', tooltip: 'IMD peak 1-hour rainfall.' },
      { label: '3-hour rainfall', value: i.rainfall_3hr_mm, unit: 'mm', tooltip: 'IMD cumulative 3-hour rainfall.' },
      { label: '24-hour rainfall', value: i.rainfall_24hr_mm, unit: 'mm', tooltip: 'IMD 24-hour rainfall accumulation (>204.5mm is Extremely Heavy).' },
      { label: 'Peak intensity', value: i.peak_intensity_mmhr, unit: 'mm/hr', tooltip: 'Instantaneous rain rate.' },
      { label: 'Duration', value: i.duration_hours, unit: 'hours', tooltip: 'Continuous rainfall duration.' },
    ];
    case 'coastal_erosion': return [
      { label: 'Erosion rate', value: i.erosion_rate_m_per_year, unit: 'm/yr', tooltip: 'NCSCM annual shoreline retreat rate.' },
      { label: 'Shoreline retreat', value: i.shoreline_retreat_m, unit: 'm', tooltip: 'NCSCM total land retreat over observation period.' },
      { label: 'Wave height', value: i.wave_height_m, unit: 'm', tooltip: 'INCOIS significant wave height.' },
      { label: 'Tide surge', value: i.tide_surge_m, unit: 'm', tooltip: 'Tidal surge elevation.' },
    ];
  }
}

export function HistoricalIntelligence() {
  const [hazardFilter, setHazardFilter] = useState<HazardType | 'all'>('all');
  const [selectedEventId, setSelectedEventId] = useState<string | null>('evt-001');
  const [showComparison, setShowComparison] = useState(true);

  const filtered = useMemo(() =>
    hazardFilter === 'all' ? historicalEvents : historicalEvents.filter(e => e.hazard_type === hazardFilter),
  [hazardFilter]);

  const selectedEvent = selectedEventId ? historicalEvents.find(e => e.id === selectedEventId) : null;
  const closestAnalogue = historicalEvents.find(e => e.id === currentConditions.closest_analogue_id);

  const timelineData = useMemo(() =>
    filtered
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(e => ({
        date: new Date(e.date).getFullYear(),
        name: e.name,
        id: e.id,
        affected: e.consequences.people_affected,
        severity: e.hazard_type === 'cyclone' && e.intensity.type === 'cyclone' ? e.intensity.max_sustained_wind_kmh : 100,
      })),
  [filtered]);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <PageHeader
        title="Historical Hazard Intelligence"
        subtitle="Authoritative disaster database, historical analogue matching, and current vs historical intensity comparison"
      />

      <div className="flex-1 overflow-y-auto">
        {/* Filter Toolbar */}
        <div className="px-6 py-3 bg-white border-b border-neutral-200 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div>
              <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-1">Hazard Filter</label>
              <select
                value={hazardFilter}
                onChange={(e) => { setHazardFilter(e.target.value as HazardType | 'all'); }}
                className="text-xs border border-neutral-300 rounded px-3 py-1.5 bg-neutral-50 font-semibold focus:outline-none focus:ring-1 focus:ring-accent min-w-[200px]"
              >
                <option value="all">All Disaster Categories</option>
                <option value="cyclone">🌀 Cyclone (IMD Track)</option>
                <option value="flood">🌊 River Flood (CWC Gauge)</option>
                <option value="landslide">⛰️ Landslide (GSI Inventory)</option>
                <option value="extreme_rainfall">⛈️ Extreme Rainfall (IMD)</option>
                <option value="coastal_erosion">🏖️ Coastal Erosion (NCSCM)</option>
              </select>
            </div>
            <div className="text-xs text-neutral-500">
              Found <strong className="text-neutral-900">{filtered.length}</strong> authoritative historical disaster records
            </div>
          </div>

          <button
            onClick={() => setShowComparison(!showComparison)}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded border transition-colors ${
              showComparison ? 'bg-accent text-white border-accent' : 'bg-white border-neutral-300 text-neutral-700 hover:bg-neutral-50'
            }`}
          >
            <GitCompare size={14} /> Compare Current Conditions vs Historical Analogue
          </button>
        </div>

        {/* Current vs Historical Comparison Panel */}
        {showComparison && closestAnalogue && (
          <div className="mx-6 mt-4 bg-white border border-neutral-300 rounded-lg p-5 shadow-2xs animate-fade-in">
            <SectionHeader
              title="Closest Historical Analogue Match"
              subtitle="Direct parameter matching between current IMD condition and historical disaster events"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
              {/* Current Observed Conditions */}
              <div className="bg-blue-50/60 border border-blue-200 rounded-lg p-4">
                <div className="text-xs font-bold text-blue-900 mb-3 flex items-center gap-1.5">
                  <Radio size={14} className="text-blue-600 animate-pulse" />
                  <span>CURRENT OBSERVED (IMD / CWC)</span>
                </div>
                <div className="space-y-2">
                  <IntensityMetric label="Sustained Wind" value={currentConditions.wind_kmh ?? '—'} unit="km/h" highlight />
                  <IntensityMetric label="Central Pressure" value={currentConditions.pressure_hpa ?? '—'} unit="hPa" />
                  <IntensityMetric label="Accumulated Rain" value={currentConditions.rainfall_mm ?? '—'} unit="mm" highlight />
                </div>
              </div>

              {/* Closest Historical Event */}
              <div className="bg-purple-50/60 border border-purple-200 rounded-lg p-4">
                <div className="text-xs font-bold text-purple-900 mb-3 flex items-center gap-1.5">
                  <Calendar size={14} className="text-purple-600" />
                  <span>HISTORICAL: {closestAnalogue.name} ({new Date(closestAnalogue.date).getFullYear()})</span>
                </div>
                <div className="space-y-2">
                  {closestAnalogue.intensity.type === 'cyclone' && (
                    <>
                      <IntensityMetric label="Max Wind" value={closestAnalogue.intensity.max_sustained_wind_kmh} unit="km/h" highlight />
                      <IntensityMetric label="Min Pressure" value={closestAnalogue.intensity.min_central_pressure_hpa} unit="hPa" />
                      <IntensityMetric label="Event Rain" value={closestAnalogue.intensity.rainfall_mm} unit="mm" highlight />
                    </>
                  )}
                </div>
              </div>

              {/* Similarity Calculation & Observed Historical Impact */}
              <div>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-3">
                  <div className="text-xs font-bold text-amber-900 mb-1">Historical Analogue Similarity</div>
                  <div className="text-3xl font-extrabold text-amber-700 font-mono">{currentConditions.similarity_to_historical}% MATCH</div>
                  <p className="text-[10px] text-amber-800 mt-1 leading-tight">
                    Calculated using standardized Euclidean parameter distance across wind, pressure, and rainfall. Does not guarantee identical future consequences.
                  </p>
                </div>

                <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-3 text-xs">
                  <div className="font-bold text-neutral-800 mb-1.5">Consequences Observed in {closestAnalogue.name}:</div>
                  <div className="space-y-1 text-[11px]">
                    <div className="flex justify-between"><span className="text-neutral-500">People Affected:</span><span className="font-bold">{formatNumber(closestAnalogue.consequences.people_affected)}</span></div>
                    <div className="flex justify-between"><span className="text-neutral-500">Houses Damaged:</span><span className="font-bold">{formatNumber(closestAnalogue.consequences.houses_damaged)}</span></div>
                    <div className="flex justify-between"><span className="text-neutral-500">Infra Damage:</span><span className="font-bold">₹{closestAnalogue.consequences.infrastructure_damage_inr_cr} Cr</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Timeline Chart */}
        <div className="px-6 py-4">
          <div className="bg-white border border-neutral-300 rounded-lg p-5">
            <SectionHeader title="Historical Event Timeline & Severity" subtitle="Click any timeline node or event pill below to inspect measured disaster parameters" />
            <div className="h-44 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timelineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e8ebee" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#697077' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#697077' }} hide />
                  <Tooltip
                    contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #dde1e6' }}
                    formatter={(value: any, name: any) => [name === 'affected' ? `${((value as number) / 1000).toFixed(0)}K affected` : value, '']}
                    labelFormatter={(label) => `Disaster Year: ${label}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="severity"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ r: 6, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2, cursor: 'pointer' }}
                    activeDot={{
                      r: 8,
                      fill: '#1e40af',
                      stroke: '#fff',
                      strokeWidth: 2,
                      onClick: (_: any, payload: any) => {
                        if (payload?.payload?.id) setSelectedEventId(payload.payload.id);
                      }
                    } as any}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Event Selector Chips */}
            <div className="flex flex-wrap gap-2 mt-4">
              {filtered.map(evt => (
                <button
                  key={evt.id}
                  onClick={() => setSelectedEventId(evt.id)}
                  className={`text-xs px-3 py-1 rounded-full border transition-all flex items-center gap-1.5 font-medium ${
                    selectedEventId === evt.id
                      ? 'bg-accent text-white border-accent shadow-2xs font-bold'
                      : 'bg-neutral-50 text-neutral-700 border-neutral-300 hover:bg-neutral-100'
                  }`}
                >
                  <span>{hazardIcon(evt.hazard_type)}</span>
                  <span>{evt.name} ({new Date(evt.date).getFullYear()})</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Event Full Parameter Inspection Card */}
        {selectedEvent && (
          <div className="px-6 pb-6 animate-fade-in">
            <div className="bg-white border border-neutral-300 rounded-lg overflow-hidden shadow-sm">
              {/* Card Header */}
              <div className="px-5 py-4 bg-neutral-900 text-white flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{hazardIcon(selectedEvent.hazard_type)}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold">{selectedEvent.name}</h3>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${agencyMeta[selectedEvent.source_agency]?.color || 'bg-neutral-800 text-white'}`}>
                        {agencyMeta[selectedEvent.source_agency]?.name || selectedEvent.source_agency}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Date: {new Date(selectedEvent.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                      {' · '}Location: {selectedEvent.location} ({selectedEvent.district})
                    </p>
                  </div>
                </div>
                <StatusBadge level="high" label={hazardLabel(selectedEvent.hazard_type)} size="md" />
              </div>

              <div className="p-5 border-b border-neutral-200 bg-neutral-25">
                <p className="text-xs text-neutral-700 leading-relaxed font-medium">{selectedEvent.description}</p>
                <div className="flex items-center gap-2 mt-2 text-[10px] text-neutral-500">
                  <ExternalLink size={10} />
                  <span>Authoritative Provenance: {selectedEvent.source} — Published by {selectedEvent.source_agency}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-neutral-200">
                {/* Measured Parameters */}
                <div className="p-5">
                  <SectionHeader title="Measured Hazard Intensity Parameters" subtitle="Authoritative agency observations & telemetry" />
                  <div className="mt-3 space-y-1">
                    {getIntensityFields(selectedEvent).map((field, i) => (
                      <IntensityMetric
                        key={i}
                        label={field.label}
                        value={field.value}
                        unit={field.unit}
                        tooltip={field.tooltip}
                        highlight={i % 2 === 0}
                      />
                    ))}
                  </div>
                </div>

                {/* Consequences */}
                <div className="p-5">
                  <SectionHeader title="Observed Consequences & Impact" subtitle="Recorded destruction and losses" />
                  <div className="mt-3 grid grid-cols-2 gap-2.5">
                    {[
                      { label: 'People Affected', value: formatNumber(selectedEvent.consequences.people_affected) },
                      { label: 'Casualties / Deaths', value: formatNumber(selectedEvent.consequences.deaths) },
                      { label: 'Houses Damaged', value: formatNumber(selectedEvent.consequences.houses_damaged) },
                      { label: 'Houses Destroyed', value: formatNumber(selectedEvent.consequences.houses_destroyed) },
                      { label: 'Roads Destroyed', value: `${selectedEvent.consequences.roads_affected_km} km` },
                      { label: 'Infra Loss', value: `₹${selectedEvent.consequences.infrastructure_damage_inr_cr} Cr` },
                      { label: 'Economic Loss', value: `₹${formatNumber(selectedEvent.consequences.economic_loss_inr_cr)} Cr` },
                      { label: 'Crops Affected', value: `${formatNumber(selectedEvent.consequences.crops_affected_hectares)} ha` },
                    ].map((item, i) => (
                      <div key={i} className="bg-neutral-50 border border-neutral-200 rounded px-3 py-2 text-xs">
                        <div className="text-[10px] text-neutral-500">{item.label}</div>
                        <div className="text-sm font-bold text-neutral-900">{item.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
