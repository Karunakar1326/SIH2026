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
    <div className="flex flex-col h-full bg-[#141414] text-[#F5F5F5] overflow-hidden">
      <PageHeader
        title="Risk & Red-Zone Intelligence"
        subtitle="Multi-hazard spatial risk evaluation and authoritative red-zone identification engine"
        actions={
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className={`flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer ${
              filterOpen ? 'bg-gradient-to-r from-[#FF7A3D] to-[#FF3D1F] text-white shadow-[0_0_20px_rgba(255,90,31,0.4)]' : 'bg-[#232323] border border-white/10 text-white hover:bg-white/10'
            }`}
          >
            <Filter size={13} /> Filters
          </button>
        }
      />

      <div className="flex-1 flex min-h-0">
        {/* Left Filter & Habitation Explorer Panel */}
        {filterOpen && (
          <div className="w-68 bg-[#1C1C1C] border-r border-white/8 p-4 overflow-y-auto shrink-0 space-y-4 text-[#F5F5F5]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-white">Spatial Filters</span>
              <button onClick={() => setFilterOpen(false)} className="text-[#9A9A9A] hover:text-white transition-colors">
                <X size={14} />
              </button>
            </div>

            {/* Red Zone Toggle */}
            <label className="flex items-center justify-between p-3 bg-[#FF4D4D]/10 border border-[#FF4D4D]/30 rounded-xl text-xs cursor-pointer">
              <span className="font-bold text-[#FF4D4D] flex items-center gap-1.5">
                <ShieldAlert size={14} className="text-[#FF4D4D]" />
                Red-Zones Only
              </span>
              <input
                type="checkbox"
                checked={redZoneOnly}
                onChange={(e) => setRedZoneOnly(e.target.checked)}
                className="rounded border-white/20 text-[#FF4D4D] focus:ring-[#FF4D4D] w-4 h-4 bg-[#232323]"
              />
            </label>

            {/* Hazard Type Filter */}
            <div>
              <label className="text-[10px] font-bold text-[#9A9A9A] uppercase tracking-wider block mb-1">Hazard Category</label>
              <select
                value={hazardFilter}
                onChange={(e) => setHazardFilter(e.target.value as HazardType | 'all')}
                className="w-full text-xs border border-white/10 rounded-xl px-3 py-1.5 bg-[#232323] text-white focus:outline-none focus:ring-1 focus:ring-[#FF5A1F] font-semibold"
              >
                <option value="all" className="bg-[#1C1C1C]">All Hazards</option>
                <option value="cyclone" className="bg-[#1C1C1C]">Cyclone (IMD)</option>
                <option value="flood" className="bg-[#1C1C1C]">Flood (CWC / ISRO)</option>
                <option value="landslide" className="bg-[#1C1C1C]">Landslide (GSI)</option>
                <option value="extreme_rainfall" className="bg-[#1C1C1C]">Extreme Rainfall (IMD)</option>
                <option value="coastal_erosion" className="bg-[#1C1C1C]">Coastal Erosion (NCSCM)</option>
              </select>
            </div>

            {/* Risk Level Filter */}
            <div>
              <label className="text-[10px] font-bold text-[#9A9A9A] uppercase tracking-wider block mb-1">Risk Severity</label>
              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value as RiskLevel | 'all')}
                className="w-full text-xs border border-white/10 rounded-xl px-3 py-1.5 bg-[#232323] text-white focus:outline-none focus:ring-1 focus:ring-[#FF5A1F] font-semibold"
              >
                <option value="all" className="bg-[#1C1C1C]">All Risk Levels</option>
                <option value="critical" className="bg-[#1C1C1C]">Critical Risk</option>
                <option value="high" className="bg-[#1C1C1C]">High Risk</option>
                <option value="moderate" className="bg-[#1C1C1C]">Moderate Risk</option>
                <option value="low" className="bg-[#1C1C1C]">Low Risk</option>
              </select>
            </div>

            {/* GIS Layers */}
            <div>
              <label className="text-[10px] font-bold text-[#9A9A9A] uppercase tracking-wider block mb-1.5">GIS Overlays</label>
              <div className="space-y-1">
                {layers.map((l) => (
                  <label key={l.id} className="flex items-center gap-2 text-xs text-[#9A9A9A] py-0.5 cursor-pointer hover:text-white transition-colors">
                    <input
                      type="checkbox"
                      checked={l.active}
                      onChange={() => toggleLayer(l.id)}
                      className="rounded border-white/20 text-[#FF5A1F] focus:ring-[#FF5A1F] w-3.5 h-3.5 bg-[#232323]"
                    />
                    <span>{l.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Habitation Selector List */}
            <div>
              <label className="text-[10px] font-bold text-[#9A9A9A] uppercase tracking-wider block mb-1.5">
                Matched Settlements ({filtered.length})
              </label>
              <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                {filtered.sort((a, b) => b.risk_score - a.risk_score).map((hab) => (
                  <div
                    key={hab.id}
                    onClick={() => setSelectedHabId(hab.id)}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs cursor-pointer border transition-all ${
                      selectedHabId === hab.id ? 'bg-[#FF5A1F]/15 border-[#FF5A1F] font-bold text-white shadow-[0_0_12px_rgba(255,90,31,0.2)]' : 'bg-[#232323] border-white/5 text-[#9A9A9A] hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: riskColor(hab.risk_level) }} />
                      <span className="truncate">{hab.name}</span>
                    </div>
                    <span className="font-black shrink-0 tabular-nums" style={{ color: riskColor(hab.risk_level) }}>{hab.risk_score}</span>
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
            <div className="bg-[#1C1C1C] border-t border-white/10 p-4 max-h-72 overflow-y-auto shrink-0 shadow-2xl space-y-3.5 text-[#F5F5F5]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h3 className="text-base font-black text-white">{selectedHab.name}</h3>
                  <RedZoneBadge redZone={selectedHab.red_zone} size="md" />
                  <StatusBadge level={selectedHab.risk_level} />
                  <span className="text-xs text-[#9A9A9A] font-mono">
                    {selectedHab.district} · Pop: {formatNumber(selectedHab.population)} · Elev: {selectedHab.elevation_m}m MSL
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xl font-black tabular-nums" style={{ color: riskColor(selectedHab.risk_level) }}>
                    {selectedHab.risk_score} <span className="text-xs text-[#6B6B6B] font-normal">/100</span>
                  </span>
                  <button
                    onClick={() => navigate(`/workspace/communities/${selectedHab.id}`)}
                    className="text-xs font-bold text-[#FF5A1F] hover:underline"
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
