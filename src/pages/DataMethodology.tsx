import { PageHeader, SectionHeader } from '@/components/shared';
import { agencyStatuses } from '@/data/alerts';
import { agencyMeta } from '@/data/types';
import { AlertTriangle } from 'lucide-react';

export function DataMethodology() {
  return (
    <div className="flex flex-col h-full bg-[#141414] text-[#F5F5F5] overflow-hidden">
      <PageHeader title="Data Provenance & System Methodology" subtitle="Full transparency into the 12-step decision pipeline, authoritative agency attributions, and model uncertainty" />

      <div className="flex-1 overflow-y-auto px-6 py-4">
        {/* Authoritative Data Feeds Status */}
        <div className="bg-[#1C1C1C] border border-white/10 rounded-2xl p-5 mb-4 shadow-2xl">
          <SectionHeader title="Authoritative Agency Feeds & Data Freshness" subtitle="Live and periodic data feeds integrated into the decision pipeline" />
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#141414] border-b border-white/8 text-[10px] uppercase font-bold text-[#9A9A9A]">
                <tr>
                  <th className="py-3 px-3">Agency</th>
                  <th className="py-3 px-3">Dataset Name</th>
                  <th className="py-3 px-3">Update Cadence</th>
                  <th className="py-3 px-3">Last Sync</th>
                  <th className="py-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {agencyStatuses.map((as, i) => {
                  const meta = agencyMeta[as.agency] || agencyMeta.DISTRICT_ADMIN;
                  return (
                    <tr key={i} className="hover:bg-[#232323] transition-colors">
                      <td className="py-3 px-3 font-bold">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${meta.color}`}>
                          {meta.name}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-bold text-white">{as.datasetName}</td>
                      <td className="py-3 px-3 text-[#9A9A9A] font-mono text-[11px]">{as.updateFrequency}</td>
                      <td className="py-3 px-3 text-[#9A9A9A] font-mono text-[11px]">{as.lastUpdated.replace('T', ' ')}</td>
                      <td className="py-3 px-3">
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${as.status === 'fresh' ? 'bg-[#2ECC71]/15 text-[#2ECC71] border border-[#2ECC71]/30' : 'bg-[#FFB020]/15 text-[#FFB020] border border-[#FFB020]/30'}`}>
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
        <div className="bg-[#1C1C1C] text-white rounded-2xl p-5 mb-4 border border-white/10 shadow-2xl">
          <h3 className="text-sm font-black tracking-wide mb-1 text-white">12-Step Core Decision Pipeline Architecture</h3>
          <p className="text-xs text-[#9A9A9A] mb-4">How raw geospatial observations are transformed into actionable phased relocation plans</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            {[
              { step: '1. Authoritative Data', desc: 'Raw feeds from ISRO/NRSC, IMD, CWC, GSI, and NCSCM.' },
              { step: '2. Normalization & PostGIS', desc: 'Spatial alignment to 30m grid resolution & vector boundaries.' },
              { step: '3. Feature Derivation', desc: 'Hazard, vulnerability, elevation, and infrastructure metrics.' },
              { step: '4. Red-Zone Engine', desc: 'Dynamic threshold classification (Elevation < 10m + Cat-4 Surge).' },
              { step: '5. Relocation Priority (RPI)', desc: 'RPI composite index separating hazard risk from relocation urgency.' },
              { step: '6. Site Eligibility Funnel', desc: '5-stage exclusion funnel eliminating candidate safe sites.' },
              { step: '7. Carrying Capacity', desc: 'Bottleneck evaluation across 8 infrastructure dimensions.' },
              { step: '8. Site Suitability', desc: 'Multi-criteria suitability scoring (safety, distance, accessibility).' },
              { step: '9. Relocation Optimization', desc: 'Population-to-site matching matching engine.' },
              { step: '10. Phased Relocation Plan', desc: 'Sequenced roadmap (Phase 1 Immediate, Phase 2, Phase 3, Monitor).' },
              { step: '11. Explainable Support', desc: 'Traceable factor breakdowns and decision justifications.' },
              { step: '12. Formal Report Export', desc: 'SDMA action plan generation with provenance annexures.' },
            ].map((item, i) => (
              <div key={i} className="bg-[#232323] border border-white/8 p-3 rounded-xl">
                <div className="font-bold text-[#FF5A1F] text-xs mb-1">{item.step}</div>
                <div className="text-[11px] text-[#9A9A9A] leading-tight font-medium">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Model Limitations & Disclaimers */}
        <div className="bg-[#FFB020]/10 border border-[#FFB020]/30 rounded-2xl p-4 text-xs text-[#FFB020]">
          <h4 className="font-bold text-[#FFB020] mb-1.5 flex items-center gap-2">
            <AlertTriangle size={15} className="text-[#FFB020]" />
            Model Uncertainty & Limitations Disclosure
          </h4>
          <ul className="list-disc pl-4 space-y-1 text-[11px] text-[#F5F5F5] leading-relaxed">
            <li>Model risk scores are decision-support estimates derived from spatial data; they must not replace ground-truth field verification.</li>
            <li>RPI weights (Hazard 30%, Pop 25%, etc.) are configurable SDMA parameters, not universal scientific constants.</li>
            <li>Simulated DEMO DATA mode is active; live system deployments require authenticated API integration with ISRO/NRSC, IMD, and CWC servers.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
