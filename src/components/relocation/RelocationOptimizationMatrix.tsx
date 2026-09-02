import { relocationAssignments } from '@/data/relocation-assignments';
import { safeSites } from '@/data/safe-sites';
import { ArrowRight, Building2, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function RelocationOptimizationMatrix() {
  const navigate = useNavigate();

  const totalAssignedPop = relocationAssignments.reduce((s, a) => s + a.assignedPopulation, 0);
  const totalSiteCapacity = safeSites.filter(s => s.status === 'suitable').reduce((s, site) => s + site.carrying_capacity.estimated_sustainable_capacity, 0);
  const netDeficit = Math.max(0, 15000 - totalSiteCapacity);

  return (
    <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-5 py-4 bg-neutral-900 text-white flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold tracking-wide">Relocation Optimization Assignment Matrix</h3>
          <p className="text-xs text-neutral-400 mt-0.5">Optimal matching between vulnerable Red-Zone habitations & eligible safe sites</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <div>
            <span className="text-neutral-400">Assigned Pop:</span> <strong className="text-emerald-400">{totalAssignedPop.toLocaleString()}</strong>
          </div>
          <div>
            <span className="text-neutral-400">Net Deficit:</span> <strong className="text-red-400">{netDeficit.toLocaleString()}</strong>
          </div>
        </div>
      </div>

      {/* Assignment Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-neutral-100 border-b border-neutral-200 text-neutral-600 uppercase font-semibold text-[10px] tracking-wider">
            <tr>
              <th className="py-2.5 px-4">Source Habitation</th>
              <th className="py-2.5 px-4">Population</th>
              <th className="py-2.5 px-4">Optimal Assigned Site</th>
              <th className="py-2.5 px-4">Transit Distance</th>
              <th className="py-2.5 px-4">Site Surplus Capacity</th>
              <th className="py-2.5 px-4">Infra Stress Load</th>
              <th className="py-2.5 px-4">Phase</th>
              <th className="py-2.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-150">
            {relocationAssignments.map((a) => (
              <tr key={a.id} className="hover:bg-neutral-25 transition-colors">
                <td className="py-3 px-4 font-bold text-neutral-800">
                  <div className="flex items-center gap-1.5">
                    <Building2 size={13} className="text-red-600 shrink-0" />
                    <span>{a.habitationName}</span>
                  </div>
                </td>
                <td className="py-3 px-4 font-semibold text-neutral-700">{a.habitationPopulation.toLocaleString()}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                    <MapPin size={13} className="text-emerald-600 shrink-0" />
                    <span>{a.siteName}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-neutral-600 font-mono">{a.travelDistanceKm} km</td>
                <td className="py-3 px-4">
                  <span className={`font-bold font-mono ${a.remainingSiteCapacity > 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                    +{a.remainingSiteCapacity.toLocaleString()}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="w-24">
                    <div className="flex justify-between text-[9px] text-neutral-500 mb-0.5">
                      <span>Load</span>
                      <span>{a.infrastructureStressPercent}%</span>
                    </div>
                    <div className="h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${a.infrastructureStressPercent > 90 ? 'bg-red-500' : 'bg-emerald-500'}`}
                        style={{ width: `${a.infrastructureStressPercent}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-red-100 text-red-800 border border-red-200">
                    {a.phase.replace('_', ' ')}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => navigate(`/workspace/communities/${a.habitationId}`)}
                    className="text-xs text-accent font-semibold hover:underline flex items-center gap-1 ml-auto"
                  >
                    Details <ArrowRight size={12} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
