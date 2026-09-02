import { Database, Cpu, ShieldAlert, SlidersHorizontal, MapPin, CheckCircle2 } from 'lucide-react';

const pipelineNodes = [
  { step: '01', title: 'Authoritative Data', subtitle: 'ISRO / IMD / CWC / GSI Feeds', icon: Database, color: 'border-blue-500 text-blue-400 bg-blue-950/40' },
  { step: '02', title: 'Data Normalization', subtitle: '30m PostGIS Spatial Grid', icon: Cpu, color: 'border-cyan-500 text-cyan-400 bg-cyan-950/40' },
  { step: '03', title: 'Feature Derivation', subtitle: 'Hazard + Vuln + Infra', icon: SlidersHorizontal, color: 'border-indigo-500 text-indigo-400 bg-indigo-950/40' },
  { step: '04', title: 'Red-Zone Engine', subtitle: 'Dynamic Elevation & Surge Criteria', icon: ShieldAlert, color: 'border-red-500 text-red-400 bg-red-950/40' },
  { step: '05', title: 'Relocation Priority', subtitle: 'RPI Score (0-100)', icon: SlidersHorizontal, color: 'border-amber-500 text-amber-400 bg-amber-950/40' },
  { step: '06', title: 'Candidate Site Funnel', subtitle: '5-Stage Exclusion Funnel', icon: MapPin, color: 'border-emerald-500 text-emerald-400 bg-emerald-950/40' },
  { step: '07', title: 'Carrying Capacity', subtitle: '8-Dimension Infrastructure Gauge', icon: Cpu, color: 'border-teal-500 text-teal-400 bg-teal-950/40' },
  { step: '08', title: 'Relocation Plan', subtitle: 'Phased Implementation & Action Plan', icon: CheckCircle2, color: 'border-accent text-accent bg-accent/20' },
];

export function PipelineArchitectureDiagram() {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-md">
      <div className="text-center mb-6">
        <span className="text-[10px] font-mono font-bold text-accent tracking-widest uppercase bg-accent/10 border border-accent/20 px-2.5 py-1 rounded">
          SYSTEM ARCHITECTURE
        </span>
        <h3 className="text-xl font-extrabold text-white mt-2">FROM DATA TO DECISION</h3>
        <p className="text-xs text-neutral-400 max-w-xl mx-auto mt-1">
          How raw satellite observations, weather radar, and river gauge telemetry pass through the PostGIS spatial engine to generate explainable relocation action plans.
        </p>
      </div>

      {/* Grid of Technical Nodes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {pipelineNodes.map((node, i) => {
          const Icon = node.icon;
          return (
            <div key={i} className={`border rounded-lg p-4 transition-all ${node.color} relative group`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-extrabold px-1.5 py-0.5 rounded bg-neutral-950 text-neutral-300">
                  STEP {node.step}
                </span>
                <Icon size={18} />
              </div>
              <div className="font-extrabold text-white text-xs mb-0.5">{node.title}</div>
              <div className="text-[10.5px] text-neutral-400 leading-tight">{node.subtitle}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
