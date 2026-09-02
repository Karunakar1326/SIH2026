import { Search, AlertTriangle, ArrowRightLeft, MapPin, Building2, FileCheck } from 'lucide-react';

const steps = [
  { step: '01', title: 'IDENTIFY', question: 'Which communities are exposed?', desc: 'Overlay ISRO satellite inundation maps and IMD wind tracks with settlement boundaries.', icon: Search },
  { step: '02', title: 'ASSESS', question: 'How severe is the risk?', desc: 'Compute multi-hazard risk score and evaluate dynamic Red-Zone criteria thresholds.', icon: AlertTriangle },
  { step: '03', title: 'PRIORITIZE', question: 'Who needs to move first?', desc: 'Rank habitations by Relocation Priority Index (RPI 0-100) separating risk from urgency.', icon: ArrowRightLeft },
  { step: '04', title: 'FIND', question: 'Where are safer alternative sites?', desc: 'Run 5-stage candidate discovery funnel excluding surge zones, floodplains, and steep slopes.', icon: MapPin },
  { step: '05', title: 'EVALUATE', question: 'Can those sites accommodate them?', desc: 'Analyze 8-dimension infrastructure carrying capacity to determine true sustainable limits.', icon: Building2 },
  { step: '06', title: 'PLAN', question: 'What is the best relocation plan?', desc: 'Generate optimal population-to-site assignments and export formal SDMA action reports.', icon: FileCheck },
];

export function DecisionJourneySteps() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <span className="text-[10px] font-mono font-bold text-emerald-400 tracking-widest uppercase bg-emerald-950 border border-emerald-800 px-2.5 py-1 rounded">
          DECISION WORKFLOW
        </span>
        <h3 className="text-xl font-extrabold text-white mt-2">FROM RISK TO RELOCATION</h3>
        <p className="text-xs text-neutral-400 max-w-xl mx-auto mt-1">
          Six clear decision steps empowering disaster management authorities from early threat identification to site acquisition and relocation planning.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {steps.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 hover:border-neutral-700 transition-all shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl font-black font-mono text-accent">{s.step}</span>
                <div className="w-8 h-8 rounded bg-neutral-800 flex items-center justify-center text-neutral-300">
                  <Icon size={18} />
                </div>
              </div>
              <h4 className="text-xs font-extrabold tracking-wider text-white uppercase mb-1">{s.title}</h4>
              <div className="text-xs font-bold text-accent mb-2">{s.question}</div>
              <p className="text-[11px] text-neutral-400 leading-relaxed">{s.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
