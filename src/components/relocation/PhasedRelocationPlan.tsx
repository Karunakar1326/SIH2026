import { habitations } from '@/data/habitations';
import type { RelocationPhase } from '@/data/types';
import { Calendar, ArrowRight, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const phases: { phase: RelocationPhase; title: string; timeframe: string; color: string; border: string; bg: string }[] = [
  { phase: 'phase_1', title: 'PHASE 1 — IMMEDIATE RELOCATION', timeframe: '0 – 6 Months Timeline', color: 'text-red-700', border: 'border-l-red-600', bg: 'bg-red-50/40' },
  { phase: 'phase_2', title: 'PHASE 2 — SHORT-TERM RELOCATION', timeframe: '6 – 18 Months Timeline', color: 'text-orange-700', border: 'border-l-orange-500', bg: 'bg-orange-50/40' },
  { phase: 'phase_3', title: 'PHASE 3 — MEDIUM-TERM RELOCATION', timeframe: '1 – 3 Years Timeline', color: 'text-yellow-700', border: 'border-l-yellow-500', bg: 'bg-yellow-50/40' },
  { phase: 'monitor', title: 'MONITOR — CONTINUOUS SURVEILLANCE', timeframe: 'Ongoing Monitoring', color: 'text-blue-700', border: 'border-l-blue-500', bg: 'bg-blue-50/40' },
];

export function PhasedRelocationPlan() {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <div className="bg-neutral-900 text-white p-4 rounded-lg flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold tracking-wide">Government Phased Relocation Plan Roadmap</h3>
          <p className="text-xs text-neutral-400 mt-0.5">Structured multi-year relocation sequence prioritizing Red-Zone habitations</p>
        </div>
        <div className="text-xs font-mono text-neutral-300 flex items-center gap-1">
          <Calendar size={14} className="text-accent" />
          <span>SDMA Implementation Plan 2026-2029</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {phases.map((p) => {
          const phaseHabs = habitations.filter(h => h.assigned_phase === p.phase);
          const totalPop = phaseHabs.reduce((s, h) => s + h.population, 0);

          return (
            <div key={p.phase} className={`bg-white border border-neutral-200 rounded-lg overflow-hidden border-l-[5px] ${p.border} p-4 ${p.bg}`}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className={`text-sm font-bold ${p.color}`}>{p.title}</h4>
                  <div className="text-xs text-neutral-500">{p.timeframe}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold px-2.5 py-1 rounded bg-neutral-900 text-white font-mono">
                    {phaseHabs.length} Habitations
                  </span>
                  <span className="text-xs font-bold px-2.5 py-1 rounded bg-white border border-neutral-300 text-neutral-800 font-mono">
                    {totalPop.toLocaleString()} People
                  </span>
                </div>
              </div>

              {/* Settlement Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
                {phaseHabs.map((hab) => (
                  <div
                    key={hab.id}
                    onClick={() => navigate(`/workspace/communities/${hab.id}`)}
                    className="bg-white border border-neutral-200 rounded p-2.5 text-xs hover:border-accent hover:shadow-2xs cursor-pointer transition-all flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-neutral-800 flex items-center gap-1.5">
                        {hab.red_zone.isRedZone && <ShieldAlert size={13} className="text-red-600 shrink-0" />}
                        <span>{hab.name}</span>
                      </div>
                      <div className="text-[10px] text-neutral-500 mt-0.5">
                        {hab.district} · Pop: {hab.population.toLocaleString()} · RPI: <strong className="text-neutral-900">{hab.relocation_priority}</strong>
                      </div>
                    </div>
                    <ArrowRight size={14} className="text-neutral-400 shrink-0 ml-2" />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
