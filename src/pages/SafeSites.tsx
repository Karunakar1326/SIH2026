import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/shared';
import { safeSites } from '@/data/safe-sites';
import { habitations } from '@/data/habitations';
import { formatNumber } from '@/utils/helpers';
import { Check, X, AlertTriangle, Filter, ChevronDown } from 'lucide-react';

export function SafeSites() {
  const navigate = useNavigate();
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>('site-001');
  const [showFunnel, setShowFunnel] = useState(true);

  const selectedSite = selectedSiteId ? safeSites.find(s => s.id === selectedSiteId) : null;
  const targetHab = selectedSite ? habitations.find(h => h.id === selectedSite.target_habitation_id) : null;

  const funnelSteps = [
    { stage: '1. Candidate Identification', count: 23, passed: 23, rejected: 0, desc: 'Topographical land patches within 35 km radius' },
    { stage: '2. Hazard Exclusion (IMD/CWC/GSI)', count: 23, passed: 12, rejected: 11, desc: 'Excluded inside Cat-4 Surge Corridor or 100-yr Flood Zone' },
    { stage: '3. Terrain & Slope Exclusion (ISRO DEM)', count: 12, passed: 9, rejected: 3, desc: 'Excluded slope > 25° or Elevation < 10m MSL' },
    { stage: '4. Infrastructure Suitability (PWD/PHED)', count: 9, passed: 5, rejected: 4, desc: 'Excluded with no highway access or water grid' },
    { stage: '5. Carrying Capacity Bottleneck', count: 5, passed: 3, rejected: 2, desc: 'Excluded capacity insufficient for target population' },
  ];

  return (
    <div className="flex flex-col h-full bg-[#141414] text-[#F5F5F5] overflow-hidden">
      <PageHeader
        title="Safe Site Identification & Carrying Capacity"
        subtitle="5-stage candidate discovery exclusion funnel and multi-dimensional carrying capacity bottleneck analysis"
      />

      <div className="flex-1 overflow-y-auto">
        {/* Stage Discovery Funnel Visualizer */}
        <div className="px-6 py-4">
          <div className="bg-[#1C1C1C] border border-white/10 rounded-2xl p-5 shadow-2xl">
            <button
              onClick={() => setShowFunnel(!showFunnel)}
              className="flex items-center justify-between w-full text-xs font-bold text-white uppercase tracking-wider mb-2 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Filter size={15} className="text-[#FF5A1F]" />
                <span>Authoritative 5-Stage Candidate Site Discovery Funnel</span>
              </div>
              <ChevronDown size={16} className={`text-[#9A9A9A] transition-transform ${showFunnel ? 'rotate-180' : ''}`} />
            </button>

            {showFunnel && (
              <div className="mt-4 space-y-3 animate-fade-in">
                {funnelSteps.map((step, i) => {
                  const pct = Math.round((step.passed / 23) * 100);
                  return (
                    <div key={i} className="flex items-center gap-3 text-xs">
                      <div className="w-64 font-bold text-white shrink-0">
                        {step.stage}
                        <div className="text-[10px] text-[#9A9A9A] font-normal">{step.desc}</div>
                      </div>
                      <div className="flex-1 h-6 bg-[#232323] rounded-full overflow-hidden relative border border-white/5">
                        <div
                          className={`h-full ${i === 4 ? 'bg-[#2ECC71]' : 'bg-gradient-to-r from-[#FF7A3D] to-[#FF3D1F]'} rounded-full transition-all duration-700`}
                          style={{ width: `${pct}%` }}
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold text-white drop-shadow">
                          {step.passed} sites passed ({pct}%)
                        </span>
                      </div>
                      <div className="w-24 text-right shrink-0">
                        {step.rejected > 0 ? (
                          <span className="text-[10px] font-bold text-[#FF4D4D] bg-[#FF4D4D]/15 border border-[#FF4D4D]/30 px-2 py-0.5 rounded-full">
                            −{step.rejected} rejected
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-[#2ECC71] bg-[#2ECC71]/15 border border-[#2ECC71]/30 px-2 py-0.5 rounded-full">
                            Initial Pool
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Site Cards Grid */}
        <div className="px-6 pb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {safeSites.sort((a, b) => b.suitability_score - a.suitability_score).map((site) => {
              const hab = habitations.find(h => h.id === site.target_habitation_id);
              const isSuitable = site.status === 'suitable';

              return (
                <div
                  key={site.id}
                  onClick={() => setSelectedSiteId(site.id === selectedSiteId ? null : site.id)}
                  className={`bg-[#1C1C1C] border rounded-2xl overflow-hidden cursor-pointer transition-all ${
                    selectedSiteId === site.id
                      ? 'border-[#FF5A1F] shadow-2xl ring-2 ring-[#FF5A1F]/30'
                      : isSuitable ? 'border-[#2ECC71]/40 hover:border-[#2ECC71]' : 'border-white/10 opacity-75 hover:opacity-100'
                  }`}
                >
                  <div className={`px-4 py-3 ${isSuitable ? 'bg-[#2ECC71]/10 border-b border-[#2ECC71]/20' : 'bg-[#FF4D4D]/10 border-b border-[#FF4D4D]/20'} flex justify-between items-center`}>
                    <div className="flex items-center gap-2">
                      {isSuitable ? <Check size={16} className="text-[#2ECC71]" /> : <X size={16} className="text-[#FF4D4D]" />}
                      <span className="text-sm font-bold text-white">{site.name}</span>
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${isSuitable ? 'bg-[#2ECC71]/15 text-[#2ECC71] border border-[#2ECC71]/30' : 'bg-[#FF4D4D]/15 text-[#FF4D4D] border border-[#FF4D4D]/30'}`}>
                      SUITABILITY: {site.suitability_score}/100
                    </span>
                  </div>

                  <div className="p-4 space-y-3">
                    {!isSuitable && site.rejection_reason && (
                      <div className="text-[11px] text-[#FF4D4D] bg-[#FF4D4D]/10 border border-[#FF4D4D]/20 rounded-xl p-2.5 leading-relaxed font-medium">
                        {site.rejection_reason}
                      </div>
                    )}

                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="bg-[#232323] p-2 rounded-xl border border-white/5">
                        <div className="text-[9px] text-[#9A9A9A] uppercase tracking-wider">Safety</div>
                        <div className="font-bold text-[#2ECC71] tabular-nums">{site.safety_score}</div>
                      </div>
                      <div className="bg-[#232323] p-2 rounded-xl border border-white/5">
                        <div className="text-[9px] text-[#9A9A9A] uppercase tracking-wider">Capacity</div>
                        <div className="font-bold text-white tabular-nums">{site.capacity_score}</div>
                      </div>
                      <div className="bg-[#232323] p-2 rounded-xl border border-white/5">
                        <div className="text-[9px] text-[#9A9A9A] uppercase tracking-wider">Infra</div>
                        <div className="font-bold text-white tabular-nums">{site.infrastructure_score}</div>
                      </div>
                    </div>

                    {isSuitable && (
                      <div>
                        <div className="text-[10px] font-bold text-[#9A9A9A] uppercase tracking-wider mb-1.5">
                          Infrastructure Readiness Checklist
                        </div>
                        <div className="flex flex-wrap gap-1 text-[10px]">
                          {Object.entries(site.infrastructure).map(([key, val]) => (
                            <span key={key} className={`px-2 py-0.5 rounded-full font-bold ${val ? 'bg-[#2ECC71]/15 text-[#2ECC71] border border-[#2ECC71]/30' : 'bg-[#FF4D4D]/15 text-[#FF4D4D] border border-[#FF4D4D]/30'}`}>
                              {val ? '✓' : '✗'} {key.toUpperCase()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {hab && (
                      <div className="text-[10px] text-[#9A9A9A] pt-2 border-t border-white/5 font-medium">
                        Target Assignment: <strong className="text-white">{hab.name}</strong> ({formatNumber(hab.population)} pop)
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed Carrying Capacity Bottleneck Inspection */}
        {selectedSite && selectedSite.status === 'suitable' && (
          <div className="px-6 pb-6 animate-fade-in">
            <div className="bg-[#1C1C1C] border border-white/10 rounded-2xl p-5 shadow-2xl space-y-4 text-[#F5F5F5]">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <h3 className="text-base font-black text-white">{selectedSite.name} — Carrying Capacity Assessment</h3>
                  <p className="text-xs text-[#9A9A9A]">Evaluating 8 infrastructure capacity dimensions to establish sustainable population limits</p>
                </div>
                <span className="text-xs font-mono font-bold bg-[#FFB020]/15 text-[#FFB020] border border-[#FFB020]/30 px-3 py-1 rounded-full">
                  BOTTLENECK DIMENSION: {selectedSite.carrying_capacity.bottleneck_dimension}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Sustainable Capacity Summary */}
                <div className="bg-[#232323] border border-white/8 rounded-2xl p-4 text-xs">
                  <h4 className="font-bold text-white mb-3 uppercase tracking-wider text-[11px]">Sustainable Capacity Formula</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-[#9A9A9A]">Target Habitation Population:</span>
                      <span className="font-bold text-white tabular-nums">{targetHab ? formatNumber(targetHab.population) : '—'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#9A9A9A]">Sustainable Carrying Limit:</span>
                      <span className="font-bold text-[#2ECC71] tabular-nums">{formatNumber(selectedSite.carrying_capacity.estimated_sustainable_capacity)}</span>
                    </div>
                    <div className="pt-2 border-t border-white/5 flex justify-between">
                      <span className="font-bold text-white">Net Surplus Capacity:</span>
                      <span className="font-bold text-[#2ECC71] tabular-nums">
                        +{formatNumber(selectedSite.carrying_capacity.estimated_sustainable_capacity - (targetHab?.population ?? 0))}
                      </span>
                    </div>
                  </div>

                  {/* Bottleneck Bar */}
                  <div className="mt-4">
                    <div className="text-[10px] text-[#9A9A9A] mb-1 font-medium">Capacity Load Gauge:</div>
                    <div className="h-3.5 bg-[#141414] rounded-full overflow-hidden border border-white/5">
                      <div
                        className="h-full bg-gradient-to-r from-[#FF7A3D] to-[#FF3D1F] rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(255,90,31,0.4)]"
                        style={{ width: `${Math.min(((targetHab?.population ?? 0) / selectedSite.carrying_capacity.estimated_sustainable_capacity) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Dimensional Capacity Matrix */}
                <div className="space-y-1.5 text-xs">
                  <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Dimension Breakdown</h4>
                  {[
                    { label: 'Buildable Land Area', val: `${selectedSite.carrying_capacity.buildable_land_sqkm} sqkm` },
                    { label: 'Housing Capacity', val: `${formatNumber(selectedSite.carrying_capacity.housing_capacity)} units` },
                    { label: 'Water Supply Grid', val: `${formatNumber(selectedSite.carrying_capacity.water_capacity_people)} people` },
                    { label: 'Sanitation Infrastructure', val: `${formatNumber(selectedSite.carrying_capacity.sanitation_capacity_people)} people` },
                    { label: 'Electricity Grid Load', val: `${formatNumber(selectedSite.carrying_capacity.electricity_capacity_people)} people` },
                    { label: 'Healthcare Center Capacity', val: `${formatNumber(selectedSite.carrying_capacity.healthcare_capacity_people)} people` },
                    { label: 'Schooling Capacity', val: `${formatNumber(selectedSite.carrying_capacity.education_capacity_students)} students` },
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between py-1.5 px-3 rounded-xl bg-[#232323] border border-white/5 text-[11px]">
                      <span className="text-[#9A9A9A]">{item.label}</span>
                      <span className="font-bold text-white tabular-nums">{item.val}</span>
                    </div>
                  ))}
                </div>

                {/* Constraints & Actions */}
                <div className="space-y-3 text-xs">
                  <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Environmental Constraints</h4>
                  {selectedSite.carrying_capacity.environmental_constraints.length > 0 ? (
                    selectedSite.carrying_capacity.environmental_constraints.map((c, i) => (
                      <div key={i} className="p-2.5 bg-[#FFB020]/10 border border-[#FFB020]/30 rounded-xl text-[#FFB020] flex items-start gap-2">
                        <AlertTriangle size={14} className="shrink-0 mt-0.5 text-[#FFB020]" />
                        <span>{c}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-[#6B6B6B]">No major environmental constraints recorded.</p>
                  )}

                  <button
                    onClick={() => navigate('/workspace/optimization')}
                    className="w-full py-3 bg-gradient-to-r from-[#FF7A3D] to-[#FF3D1F] text-white font-bold rounded-xl shadow-[0_0_24px_rgba(255,90,31,0.35)] hover:shadow-[0_0_36px_rgba(255,90,31,0.55)] transition-all cursor-pointer"
                  >
                    Run Optimization Assignment →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
