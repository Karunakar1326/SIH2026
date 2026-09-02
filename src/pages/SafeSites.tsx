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
    <div className="flex flex-col h-full overflow-hidden">
      <PageHeader
        title="Safe Site Identification & Carrying Capacity"
        subtitle="5-stage candidate discovery exclusion funnel and multi-dimensional carrying capacity bottleneck analysis"
      />

      <div className="flex-1 overflow-y-auto">
        {/* Stage Discovery Funnel Visualizer */}
        <div className="px-6 py-4">
          <div className="bg-white border border-neutral-300 rounded-lg p-5 shadow-2xs">
            <button
              onClick={() => setShowFunnel(!showFunnel)}
              className="flex items-center justify-between w-full text-xs font-bold text-neutral-800 uppercase tracking-wider mb-2"
            >
              <div className="flex items-center gap-2">
                <Filter size={15} className="text-accent" />
                <span>Authoritative 5-Stage Candidate Site Discovery Funnel</span>
              </div>
              <ChevronDown size={16} className={`text-neutral-400 transition-transform ${showFunnel ? 'rotate-180' : ''}`} />
            </button>

            {showFunnel && (
              <div className="mt-4 space-y-2.5 animate-fade-in">
                {funnelSteps.map((step, i) => {
                  const pct = Math.round((step.passed / 23) * 100);
                  return (
                    <div key={i} className="flex items-center gap-3 text-xs">
                      <div className="w-64 font-semibold text-neutral-800 shrink-0">
                        {step.stage}
                        <div className="text-[10px] text-neutral-500 font-normal">{step.desc}</div>
                      </div>
                      <div className="flex-1 h-6 bg-neutral-100 rounded overflow-hidden relative">
                        <div
                          className={`h-full ${i === 4 ? 'bg-emerald-500' : 'bg-accent'} rounded transition-all duration-700`}
                          style={{ width: `${pct}%` }}
                        />
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold text-neutral-900">
                          {step.passed} sites passed ({pct}%)
                        </span>
                      </div>
                      <div className="w-24 text-right shrink-0">
                        {step.rejected > 0 ? (
                          <span className="text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded">
                            −{step.rejected} rejected
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
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
                  className={`bg-white border rounded-lg overflow-hidden cursor-pointer transition-all ${
                    selectedSiteId === site.id
                      ? 'border-accent shadow-md ring-2 ring-accent/20'
                      : isSuitable ? 'border-emerald-300 hover:shadow-2xs' : 'border-neutral-300 hover:shadow-2xs opacity-75'
                  }`}
                >
                  <div className={`px-4 py-3 ${isSuitable ? 'bg-emerald-50 border-b border-emerald-200' : 'bg-red-50 border-b border-red-200'} flex justify-between items-center`}>
                    <div className="flex items-center gap-2">
                      {isSuitable ? <Check size={16} className="text-emerald-600" /> : <X size={16} className="text-red-600" />}
                      <span className="text-sm font-bold text-neutral-900">{site.name}</span>
                    </div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${isSuitable ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                      SUITABILITY: {site.suitability_score}/100
                    </span>
                  </div>

                  <div className="p-4 space-y-3">
                    {!isSuitable && site.rejection_reason && (
                      <div className="text-[11px] text-red-900 bg-red-50 border border-red-200 rounded p-2 leading-relaxed">
                        {site.rejection_reason}
                      </div>
                    )}

                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="bg-neutral-50 p-1.5 rounded border border-neutral-200">
                        <div className="text-[9px] text-neutral-500">Safety</div>
                        <div className="font-bold text-emerald-700">{site.safety_score}</div>
                      </div>
                      <div className="bg-neutral-50 p-1.5 rounded border border-neutral-200">
                        <div className="text-[9px] text-neutral-500">Capacity</div>
                        <div className="font-bold text-neutral-900">{site.capacity_score}</div>
                      </div>
                      <div className="bg-neutral-50 p-1.5 rounded border border-neutral-200">
                        <div className="text-[9px] text-neutral-500">Infra</div>
                        <div className="font-bold text-neutral-900">{site.infrastructure_score}</div>
                      </div>
                    </div>

                    {isSuitable && (
                      <div>
                        <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1">
                          Infrastructure Readiness Checklist
                        </div>
                        <div className="flex flex-wrap gap-1 text-[10px]">
                          {Object.entries(site.infrastructure).map(([key, val]) => (
                            <span key={key} className={`px-1.5 py-0.5 rounded font-medium ${val ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                              {val ? '✓' : '✗'} {key.toUpperCase()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {hab && (
                      <div className="text-[10px] text-neutral-500 pt-1 border-t border-neutral-150">
                        Target Assignment: <strong className="text-neutral-800">{hab.name}</strong> ({formatNumber(hab.population)} pop)
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
            <div className="bg-white border border-neutral-300 rounded-lg p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                <div>
                  <h3 className="text-base font-bold text-neutral-900">{selectedSite.name} — Carrying Capacity Assessment</h3>
                  <p className="text-xs text-neutral-500">Evaluating 8 infrastructure capacity dimensions to establish sustainable population limits</p>
                </div>
                <span className="text-xs font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300 px-3 py-1 rounded">
                  BOTTLENECK DIMENSION: {selectedSite.carrying_capacity.bottleneck_dimension}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Sustainable Capacity Summary */}
                <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 text-xs">
                  <h4 className="font-bold text-neutral-800 mb-3 uppercase tracking-wider text-[11px]">Sustainable Capacity Formula</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Target Habitation Population:</span>
                      <span className="font-bold text-neutral-900">{targetHab ? formatNumber(targetHab.population) : '—'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Sustainable Carrying Limit:</span>
                      <span className="font-bold text-emerald-700">{formatNumber(selectedSite.carrying_capacity.estimated_sustainable_capacity)}</span>
                    </div>
                    <div className="pt-2 border-t border-neutral-200 flex justify-between">
                      <span className="font-bold text-neutral-800">Net Surplus Capacity:</span>
                      <span className="font-bold text-emerald-700">
                        +{formatNumber(selectedSite.carrying_capacity.estimated_sustainable_capacity - (targetHab?.population ?? 0))}
                      </span>
                    </div>
                  </div>

                  {/* Bottleneck Bar */}
                  <div className="mt-4">
                    <div className="text-[10px] text-neutral-500 mb-1 font-medium">Capacity Load Gauge:</div>
                    <div className="h-3.5 bg-neutral-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                        style={{ width: `${Math.min(((targetHab?.population ?? 0) / selectedSite.carrying_capacity.estimated_sustainable_capacity) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Dimensional Capacity Matrix */}
                <div className="space-y-1.5 text-xs">
                  <h4 className="font-bold text-neutral-800 uppercase tracking-wider text-[11px]">Dimension Breakdown</h4>
                  {[
                    { label: 'Buildable Land Area', val: `${selectedSite.carrying_capacity.buildable_land_sqkm} sqkm` },
                    { label: 'Housing Capacity', val: `${formatNumber(selectedSite.carrying_capacity.housing_capacity)} units` },
                    { label: 'Water Supply Grid', val: `${formatNumber(selectedSite.carrying_capacity.water_capacity_people)} people` },
                    { label: 'Sanitation Infrastructure', val: `${formatNumber(selectedSite.carrying_capacity.sanitation_capacity_people)} people` },
                    { label: 'Electricity Grid Load', val: `${formatNumber(selectedSite.carrying_capacity.electricity_capacity_people)} people` },
                    { label: 'Healthcare Center Capacity', val: `${formatNumber(selectedSite.carrying_capacity.healthcare_capacity_people)} people` },
                    { label: 'Schooling Capacity', val: `${formatNumber(selectedSite.carrying_capacity.education_capacity_students)} students` },
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between py-1 px-2 rounded bg-neutral-50 text-[11px]">
                      <span className="text-neutral-600">{item.label}</span>
                      <span className="font-semibold text-neutral-800">{item.val}</span>
                    </div>
                  ))}
                </div>

                {/* Constraints & Actions */}
                <div className="space-y-3 text-xs">
                  <h4 className="font-bold text-neutral-800 uppercase tracking-wider text-[11px]">Environmental Constraints</h4>
                  {selectedSite.carrying_capacity.environmental_constraints.length > 0 ? (
                    selectedSite.carrying_capacity.environmental_constraints.map((c, i) => (
                      <div key={i} className="p-2 bg-amber-50 border border-amber-200 rounded text-amber-900 flex items-start gap-2">
                        <AlertTriangle size={14} className="shrink-0 mt-0.5 text-amber-600" />
                        <span>{c}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-neutral-400">No major environmental constraints recorded.</p>
                  )}

                  <button
                    onClick={() => navigate('/workspace/optimization')}
                    className="w-full py-2 bg-accent text-white font-bold rounded shadow-2xs hover:bg-accent-dark transition-colors cursor-pointer"
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
