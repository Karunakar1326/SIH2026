import { PageHeader, SectionHeader } from '@/components/shared';
import { agencyStatuses } from '@/data/alerts';
import { agencyMeta } from '@/data/types';
import { AlertTriangle } from 'lucide-react';

export function DataMethodology() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <PageHeader title="Data Provenance & System Methodology" subtitle="Full transparency into the 12-step decision pipeline, authoritative agency attributions, and model uncertainty" />

      <div className="flex-1 overflow-y-auto px-6 py-4">
        {/* Authoritative Data Feeds Status */}
        <div className="bg-white border border-neutral-300 rounded-lg p-5 mb-4 shadow-2xs">
          <SectionHeader title="Authoritative Agency Feeds & Data Freshness" subtitle="Live and periodic data feeds integrated into the decision pipeline" />
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-neutral-100 border-b border-neutral-200 text-[10px] uppercase font-bold text-neutral-600">
                <tr>
                  <th className="py-2 px-3">Agency</th>
                  <th className="py-2 px-3">Dataset Name</th>
                  <th className="py-2 px-3">Update Cadence</th>
                  <th className="py-2 px-3">Last Sync</th>
                  <th className="py-2 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-150">
                {agencyStatuses.map((as, i) => {
                  const meta = agencyMeta[as.agency] || agencyMeta.DISTRICT_ADMIN;
                  return (
                    <tr key={i} className="hover:bg-neutral-25">
                      <td className="py-2 px-3 font-bold">
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${meta.color}`}>
                          {meta.name}
                        </span>
                      </td>
                      <td className="py-2 px-3 font-semibold text-neutral-800">{as.datasetName}</td>
                      <td className="py-2 px-3 text-neutral-500 font-mono text-[11px]">{as.updateFrequency}</td>
                      <td className="py-2 px-3 text-neutral-600 font-mono text-[11px]">{as.lastUpdated.replace('T', ' ')}</td>
                      <td className="py-2 px-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${as.status === 'fresh' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                          {as.status.toUpperCase()} ({as.isLive ? 'LIVE' : 'PERIODIC'})
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* 12-Step Decision Pipeline Documentation */}
        <div className="bg-neutral-900 text-white rounded-lg p-5 mb-4 border border-neutral-800">
          <h3 className="text-sm font-bold tracking-wide mb-1 text-white">12-Step Core Decision Pipeline Architecture</h3>
          <p className="text-xs text-neutral-300 mb-4">How raw geospatial observations are transformed into actionable phased relocation plans</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            {[
              { step: '1. Authoritative Data', desc: 'Raw feeds from ISRO/NRSC, IMD, CWC, GSI, and NCSCM.' },
              { step: '2. Normalization & PostGIS', desc: 'Spatial alignment to 30m grid resolution & vector boundaries.' },
              { step: '3. Feature Derivation', desc: 'Hazard, vulnerability, elevation, and infrastructure metrics.' },
              { step: '4. Red-Zone Engine', desc: 'Dynamic threshold classification (Elevation < 10m + Cat-4 Surge).' },
              { step: '5. Relocation Priority (RPI)', desc: 'RPI composite index separating hazard risk from relocation urgency.' },
              { stage: '6. Site Eligibility Funnel', desc: '5-stage exclusion funnel eliminating candidate safe sites.' },
              { step: '7. Carrying Capacity', desc: 'Bottleneck evaluation across 8 infrastructure dimensions.' },
              { step: '8. Site Suitability', desc: 'Multi-criteria suitability scoring (safety, distance, accessibility).' },
              { step: '9. Relocation Optimization', desc: 'Population-to-site matching matching engine.' },
              { step: '10. Phased Relocation Plan', desc: 'Sequenced roadmap (Phase 1 Immediate, Phase 2, Phase 3, Monitor).' },
              { step: '11. Explainable Support', desc: 'Traceable factor breakdowns and decision justifications.' },
              { step: '12. Formal Report Export', desc: 'SDMA action plan generation with provenance annexures.' },
            ].map((item, i) => (
              <div key={i} className="bg-neutral-800 border border-neutral-750 p-2.5 rounded">
                <div className="font-bold text-emerald-400 text-xs mb-0.5">{item.step}</div>
                <div className="text-[11px] text-neutral-300 leading-tight">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Model Limitations & Disclaimers */}
        <div className="bg-amber-50 border border-amber-300 rounded-lg p-4 text-xs text-amber-950">
          <h4 className="font-bold text-amber-900 mb-1 flex items-center gap-1.5">
            <AlertTriangle size={15} className="text-amber-600" />
            Model Uncertainty & Limitations Disclosure
          </h4>
          <ul className="list-disc pl-4 space-y-1 text-[11px] text-amber-900 leading-relaxed">
            <li>Model risk scores are decision-support estimates derived from spatial data; they must not replace ground-truth field verification.</li>
            <li>RPI weights (Hazard 30%, Pop 25%, etc.) are configurable SDMA parameters, not universal scientific constants.</li>
            <li>Simulated DEMO DATA mode is active; live system deployments require authenticated API integration with ISRO/NRSC, IMD, and CWC servers.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
