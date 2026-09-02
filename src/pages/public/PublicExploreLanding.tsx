import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PublicHeader } from '@/components/public/PublicHeader';
import { DisasterHazardGrid, disasterCategories } from '@/components/public/DisasterHazardGrid';
import { PipelineArchitectureDiagram } from '@/components/public/PipelineArchitectureDiagram';
import { DecisionJourneySteps } from '@/components/public/DecisionJourneySteps';
import { Shield, ArrowRight, Lock } from 'lucide-react';

export function PublicExploreLanding() {
  const navigate = useNavigate();
  const [selectedThreatHazard, setSelectedThreatHazard] = useState('cyclone');

  const selectedHazardObj = disasterCategories.find(c => c.id === selectedThreatHazard) || disasterCategories[0];

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans flex flex-col selection:bg-accent selection:text-white">
      {/* Public Top Header */}
      <PublicHeader />

      {/* Hero Section */}
      <section className="relative py-20 px-6 border-b border-neutral-850 overflow-hidden bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950">
        {/* Subtle Geospatial Grid Overlay Visual */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293715_1px,transparent_1px),linear-gradient(to_bottom,#1f293715_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-accent/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-mono font-bold tracking-wider uppercase">
            <Shield size={14} />
            <span>SIH 2026 PS 191 · DISASTER RELOCATION INTELLIGENCE PLATFORM</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight uppercase text-white">
            UNDERSTAND RISK.<br />
            PROTECT COMMUNITIES.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-accent to-emerald-400">
              PLAN SAFER RELOCATION.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-neutral-300 max-w-2xl mx-auto font-medium leading-relaxed">
            A geospatial decision-support platform for multi-hazard risk assessment, community vulnerability analysis, and evidence-based disaster relocation planning.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => {
                const el = document.getElementById('explore-risks');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3 rounded bg-accent hover:bg-accent-dark text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-accent/20 cursor-pointer flex items-center gap-2"
            >
              <span>Explore Disaster Risks</span>
              <ArrowRight size={14} />
            </button>

            <button
              onClick={() => navigate('/workspace')}
              className="px-6 py-3 rounded bg-neutral-900 border border-neutral-700 hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2"
            >
              <Lock size={14} className="text-amber-400" />
              <span>Authority Access</span>
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto pt-8 border-t border-neutral-850 text-left">
            <div className="bg-neutral-900/80 border border-neutral-800 p-3 rounded">
              <div className="text-[10px] text-neutral-400 font-mono uppercase">Multi-Hazard Models</div>
              <div className="text-lg font-black text-white">6 Categories</div>
            </div>
            <div className="bg-neutral-900/80 border border-neutral-800 p-3 rounded">
              <div className="text-[10px] text-neutral-400 font-mono uppercase">Evaluated Habitations</div>
              <div className="text-lg font-black text-white">15 Coastal Habitats</div>
            </div>
            <div className="bg-neutral-900/80 border border-neutral-800 p-3 rounded">
              <div className="text-[10px] text-neutral-400 font-mono uppercase">Authoritative Feeds</div>
              <div className="text-lg font-black text-emerald-400">ISRO / IMD / CWC</div>
            </div>
            <div className="bg-neutral-900/80 border border-neutral-800 p-3 rounded">
              <div className="text-[10px] text-neutral-400 font-mono uppercase">Relocation Funnel</div>
              <div className="text-lg font-black text-accent">5 Exclusion Stages</div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: Explore Disaster Risks */}
      <section id="explore-risks" className="py-16 px-6 border-b border-neutral-850 bg-neutral-950">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="text-center">
            <span className="text-[10px] font-mono font-bold text-accent tracking-widest uppercase bg-accent/10 border border-accent/20 px-2.5 py-1 rounded">
              HAZARD SPECTRUM
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-2 uppercase">EXPLORE DISASTER RISKS</h2>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-xl mx-auto mt-1">
              Understand how different hazards affect communities, infrastructure, and relocation decisions.
            </p>
          </div>

          <DisasterHazardGrid />
        </div>
      </section>

      {/* Section 2: How NEXUS Works */}
      <section id="how-it-works" className="py-16 px-6 border-b border-neutral-850 bg-neutral-900/50">
        <div className="max-w-6xl mx-auto">
          <PipelineArchitectureDiagram />
        </div>
      </section>

      {/* Section 3: Decision Journey */}
      <section id="decision-journey" className="py-16 px-6 border-b border-neutral-850 bg-neutral-950">
        <div className="max-w-6xl mx-auto">
          <DecisionJourneySteps />
        </div>
      </section>

      {/* Section 4: Interactive Regional Multi-Hazard Threat Visualization */}
      <section className="py-16 px-6 border-b border-neutral-850 bg-neutral-900/40">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="text-center">
            <span className="text-[10px] font-mono font-bold text-amber-400 tracking-widest uppercase bg-amber-950 border border-amber-800 px-2.5 py-1 rounded">
              REGIONAL THREAT CONCEPT
            </span>
            <h2 className="text-2xl font-black text-white mt-2 uppercase">INTERACTIVE REGIONAL THREAT EXPLORER</h2>
            <p className="text-xs text-neutral-400 max-w-xl mx-auto mt-1">
              Select a hazard type to observe conceptual regional threat propagation and relocation implications.
            </p>
          </div>

          {/* Hazard Selection Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {disasterCategories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedThreatHazard(c.id)}
                className={`px-3 py-1.5 rounded text-xs font-bold transition-all border cursor-pointer ${
                  selectedThreatHazard === c.id
                    ? 'bg-accent text-white border-accent shadow-sm'
                    : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
                }`}
              >
                {c.name.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* Threat Pipeline Display */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 grid grid-cols-1 md:grid-cols-5 gap-4 text-xs">
            <div className="bg-neutral-950 border border-neutral-850 p-3 rounded">
              <div className="text-[10px] text-neutral-500 font-mono uppercase">HAZARD CATEGORY</div>
              <div className="font-extrabold text-white text-sm mt-1">{selectedHazardObj.name}</div>
            </div>
            <div className="bg-neutral-950 border border-neutral-850 p-3 rounded">
              <div className="text-[10px] text-neutral-500 font-mono uppercase">AFFECTED REGION</div>
              <div className="font-extrabold text-amber-400 text-sm mt-1">Odisha Coastal Zone</div>
            </div>
            <div className="bg-neutral-950 border border-neutral-850 p-3 rounded">
              <div className="text-[10px] text-neutral-500 font-mono uppercase">EXPOSED COMMUNITIES</div>
              <div className="font-extrabold text-red-400 text-sm mt-1">15 Habitations</div>
            </div>
            <div className="bg-neutral-950 border border-neutral-850 p-3 rounded">
              <div className="text-[10px] text-neutral-500 font-mono uppercase">VULNERABLE POPULATION</div>
              <div className="font-extrabold text-white text-sm mt-1">45,000+ People</div>
            </div>
            <div className="bg-neutral-950 border border-neutral-850 p-3 rounded">
              <div className="text-[10px] text-neutral-500 font-mono uppercase">RELOCATION IMPLICATION</div>
              <div className="font-extrabold text-emerald-400 text-sm mt-1">Phase 1 Immediate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Built For Authorities */}
      <section id="for-authorities" className="py-16 px-6 border-b border-neutral-850 bg-neutral-950">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="text-center">
            <span className="text-[10px] font-mono font-bold text-accent tracking-widest uppercase bg-accent/10 border border-accent/20 px-2.5 py-1 rounded">
              TARGET PERSONAS
            </span>
            <h2 className="text-2xl font-black text-white mt-2 uppercase">BUILT FOR DISASTER MANAGEMENT AUTHORITIES</h2>
            <p className="text-xs text-neutral-400 max-w-xl mx-auto mt-1">
              Purpose-built workflows for state, district, and emergency management officers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5">
              <div className="text-xs font-mono font-bold text-accent uppercase mb-1">PRIMARY USER</div>
              <h3 className="text-sm font-extrabold text-white">State Disaster Management Authority (SDMA)</h3>
              <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                State-level multi-hazard monitoring, regional risk prioritization, resource allocation, and multi-year relocation policy.
              </p>
            </div>
            <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5">
              <div className="text-xs font-mono font-bold text-accent uppercase mb-1">PRIMARY USER</div>
              <h3 className="text-sm font-extrabold text-white">District Disaster Management Authority (DDMA)</h3>
              <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                District-level settlement evaluation, Red-Zone verification, safe site carrying capacity assessment, and local action plans.
              </p>
            </div>
            <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5">
              <div className="text-xs font-mono font-bold text-accent uppercase mb-1">PRIMARY USER</div>
              <h3 className="text-sm font-extrabold text-white">Disaster Management Officers</h3>
              <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                Evidence-based assessment of individual habitations, historical analogue analysis, and explainable relocation decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Transition CTA */}
      <section className="py-20 px-6 bg-gradient-to-b from-neutral-900 to-neutral-950 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl font-black text-white uppercase tracking-tight">
            READY TO EXPLORE THE DECISION SYSTEM?
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-xl mx-auto">
            Transition directly into the operational authority workspace to evaluate habitations, inspect Red-Zones, and generate relocation action plans.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => {
                const el = document.getElementById('explore-risks');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3 rounded bg-neutral-900 border border-neutral-700 hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
            >
              Explore Disaster Risks
            </button>

            <button
              onClick={() => navigate('/workspace')}
              className="px-6 py-3 rounded bg-accent hover:bg-accent-dark text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-accent/20 cursor-pointer flex items-center gap-2"
            >
              <Lock size={14} />
              <span>Authority Access</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
