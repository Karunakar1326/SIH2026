import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, HazardScoreBar, StatusBadge } from '@/components/shared';
import { RedZoneBadge } from '@/components/shared/RedZoneBadge';
import { DataProvenancePanel } from '@/components/shared/DataProvenancePanel';
import { RiskMap } from '@/components/map/RiskMap';
import { habitations } from '@/data/habitations';
import { useMapStore } from '@/stores';
import { riskColor, formatNumber } from '@/utils/helpers';
import type { HazardType, RiskLevel } from '@/data/types';
import { Filter, X, ShieldAlert } from 'lucide-react';

export function RiskIntelligence() {
  const navigate = useNavigate();
  const layers = useMapStore((s) => s.layers);
  const toggleLayer = useMapStore((s) => s.toggleLayer);
  const [filterOpen, setFilterOpen] = useState(true);
  const [hazardFilter, setHazardFilter] = useState<HazardType | 'all'>('all');
  const [riskFilter, setRiskFilter] = useState<RiskLevel | 'all'>('all');
  const [redZoneOnly, setRedZoneOnly] = useState(false);
  const [selectedHabId, setSelectedHabId] = useState<string | null>('hab-001');

  const filtered = habitations.filter(h => {
    if (hazardFilter !== 'all' && h.most_frequent_hazard !== hazardFilter) return false;
    if (riskFilter !== 'all' && h.risk_level !== riskFilter) return false;
    if (redZoneOnly && !h.red_zone.isRedZone) return false;
    return true;
  });

  const selectedHab = selectedHabId ? habitations.find(h => h.id === selectedHabId) : null;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <PageHeader
        title="Risk & Red-Zone Intelligence"
        subtitle="Multi-hazard spatial risk evaluation and authoritative red-zone identification engine"
        actions={
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded border transition-colors ${
              filterOpen ? 'bg-accent text-white border-accent' : 'bg-white border-neutral-300 text-neutral-700 hover:bg-neutral-50'
            }`}
          >
            <Filter size={13} /> Filters
          </button>
        }
      />

      <div className="flex-1 flex min-h-0">
        {/* Left Filter & Habitation Explorer Panel */}
        {filterOpen && (
          <div className="w-68 bg-white border-r border-neutral-300 p-4 overflow-y-auto shrink-0 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-800">Spatial Filters</span>
              <button onClick={() => setFilterOpen(false)} className="text-neutral-400 hover:text-neutral-600">
                <X size={14} />
              </button>
            </div>

            {/* Red Zone Toggle */}
            <label className="flex items-center justify-between p-2.5 bg-red-50 border border-red-200 rounded text-xs cursor-pointer">
              <span className="font-bold text-red-900 flex items-center gap-1.5">
                <ShieldAlert size={14} className="text-red-600" />
                Red-Zones Only
              </span>
              <input
                type="checkbox"
                checked={redZoneOnly}
                onChange={(e) => setRedZoneOnly(e.target.checked)}
                className="rounded border-red-300 text-red-600 focus:ring-red-500 w-4 h-4"
              />
            </label>

            {/* Hazard Type Filter */}
            <div>
              <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-1">Hazard Category</label>
              <select
                value={hazardFilter}
                onChange={(e) => setHazardFilter(e.target.value as HazardType | 'all')}
                className="w-full text-xs border border-neutral-300 rounded px-2.5 py-1.5 bg-neutral-50 focus:outline-none focus:ring-1 focus:ring-accent font-medium"
              >
                <option value="all">All Hazards</option>
                <option value="cyclone">Cyclone (IMD)</option>
                <option value="flood">Flood (CWC / ISRO)</option>
                <option value="landslide">Landslide (GSI)</option>
                <option value="extreme_rainfall">Extreme Rainfall (IMD)</option>
                <option value="coastal_erosion">Coastal Erosion (NCSCM)</option>
              </select>
            </div>

            {/* Risk Level Filter */}
            <div>
              <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-1">Risk Severity</label>
              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value as RiskLevel | 'all')}
                className="w-full text-xs border border-neutral-300 rounded px-2.5 py-1.5 bg-neutral-50 focus:outline-none focus:ring-1 focus:ring-accent font-medium"
              >
                <option value="all">All Risk Levels</option>
                <option value="critical">Critical Risk</option>
                <option value="high">High Risk</option>
                <option value="moderate">Moderate Risk</option>
                <option value="low">Low Risk</option>
              </select>
            </div>

            {/* GIS Layers */}
            <div>
              <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-1.5">GIS Overlays</label>
              <div className="space-y-1">
                {layers.map((l) => (
                  <label key={l.id} className="flex items-center gap-2 text-xs text-neutral-700 py-0.5 cursor-pointer hover:text-neutral-900">
                    <input
                      type="checkbox"
                      checked={l.active}
                      onChange={() => toggleLayer(l.id)}
                      className="rounded border-neutral-300 text-accent focus:ring-accent w-3.5 h-3.5"
                    />
                    <span>{l.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Habitation Selector List */}
            <div>
              <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-1.5">
                Matched Settlements ({filtered.length})
              </label>
              <div className="space-y-1 max-h-64 overflow-y-auto">
                {filtered.sort((a, b) => b.risk_score - a.risk_score).map((hab) => (
                  <div
                    key={hab.id}
                    onClick={() => setSelectedHabId(hab.id)}
                    className={`flex items-center justify-between px-2.5 py-2 rounded text-xs cursor-pointer border transition-colors ${
                      selectedHabId === hab.id ? 'bg-accent-bg border-blue-300 font-bold' : 'bg-white border-neutral-200 hover:bg-neutral-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: riskColor(hab.risk_level) }} />
                      <span className="truncate text-neutral-800">{hab.name}</span>
                    </div>
                    <span className="font-extrabold shrink-0" style={{ color: riskColor(hab.risk_level) }}>{hab.risk_score}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Center Map & Bottom Provenance Panel */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 relative">
            <RiskMap
              height="100%"
              highlightHabitationId={selectedHabId ?? undefined}
              onHabitationClick={(id) => setSelectedHabId(id)}
            />
          </div>

          {/* Bottom Selected Habitation Intelligence & Data Provenance Panel */}
          {selectedHab && (
            <div className="bg-white border-t border-neutral-300 p-4 max-h-72 overflow-y-auto shrink-0 shadow-lg space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h3 className="text-base font-bold text-neutral-900">{selectedHab.name}</h3>
                  <RedZoneBadge redZone={selectedHab.red_zone} size="md" />
                  <StatusBadge level={selectedHab.risk_level} />
                  <span className="text-xs text-neutral-500 font-mono">
                    {selectedHab.district} · Pop: {formatNumber(selectedHab.population)} · Elev: {selectedHab.elevation_m}m MSL
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xl font-black" style={{ color: riskColor(selectedHab.risk_level) }}>
                    {selectedHab.risk_score} <span className="text-xs text-neutral-400 font-normal">/100</span>
                  </span>
                  <button
                    onClick={() => navigate(`/workspace/communities/${selectedHab.id}`)}
                    className="text-xs font-bold text-accent hover:underline"
                  >
                    Open 360° Profile →
                  </button>
                </div>
              </div>

              {/* Hazard Breakdown Grid */}
              <div className="grid grid-cols-5 gap-3">
                <HazardScoreBar label="Flood (CWC)" score={selectedHab.hazard_scores.flood} />
                <HazardScoreBar label="Cyclone (IMD)" score={selectedHab.hazard_scores.cyclone} />
                <HazardScoreBar label="Landslide (GSI)" score={selectedHab.hazard_scores.landslide} />
                <HazardScoreBar label="Extreme Rainfall (IMD)" score={selectedHab.hazard_scores.extreme_rainfall} />
                <HazardScoreBar label="Coastal Erosion (NCSCM)" score={selectedHab.hazard_scores.coastal_erosion} />
              </div>

              {/* Data Provenance Drilldown */}
              <DataProvenancePanel
                scoreTitle={`${selectedHab.name} Multi-Hazard Score`}
                scoreValue={selectedHab.risk_score}
                factors={selectedHab.red_zone.triggerFactors}
                provenanceMap={selectedHab.provenance}
                compact={true}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
