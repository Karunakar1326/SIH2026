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
    <div className="bg-[#1C1C1C] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="px-5 py-4 bg-[#232323] text-white flex items-center justify-between border-b border-white/8">
        <div>
          <h3 className="text-sm font-bold tracking-wide">Relocation Optimization Assignment Matrix</h3>
          <p className="text-xs text-[#9A9A9A] mt-0.5">Optimal matching between vulnerable Red-Zone habitations & eligible safe sites</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <div>
            <span className="text-[#9A9A9A]">Assigned Pop:</span> <strong className="text-[#2ECC71]">{totalAssignedPop.toLocaleString()}</strong>
          </div>
          <div>
            <span className="text-[#9A9A9A]">Net Deficit:</span> <strong className="text-[#FF4D4D]">{netDeficit.toLocaleString()}</strong>
          </div>
        </div>
      </div>

      {/* Assignment Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-[#141414] border-b border-white/8 text-[#9A9A9A] uppercase font-semibold text-[10px] tracking-wider">
            <tr>
              <th className="py-3 px-4">Source Habitation</th>
              <th className="py-3 px-4">Population</th>
              <th className="py-3 px-4">Optimal Assigned Site</th>
              <th className="py-3 px-4">Transit Distance</th>
              <th className="py-3 px-4">Site Surplus Capacity</th>
              <th className="py-3 px-4">Infra Stress Load</th>
              <th className="py-3 px-4">Phase</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {relocationAssignments.map((a) => (
              <tr key={a.id} className="hover:bg-[#232323] transition-colors">
                <td className="py-3 px-4 font-bold text-white">
                  <div className="flex items-center gap-2">
                    <Building2 size={13} className="text-[#FF4D4D] shrink-0" />
                    <span>{a.habitationName}</span>
                  </div>
                </td>
                <td className="py-3 px-4 font-semibold text-[#F5F5F5] tabular-nums">{a.habitationPopulation.toLocaleString()}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2 font-bold text-[#2ECC71]">
                    <MapPin size={13} className="text-[#2ECC71] shrink-0" />
                    <span>{a.siteName}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-[#9A9A9A] font-mono tabular-nums">{a.travelDistanceKm} km</td>
                <td className="py-3 px-4">
                  <span className={`font-bold font-mono tabular-nums ${a.remainingSiteCapacity > 0 ? 'text-[#2ECC71]' : 'text-[#FF4D4D]'}`}>
                    +{a.remainingSiteCapacity.toLocaleString()}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="w-24">
                    <div className="flex justify-between text-[9px] text-[#9A9A9A] mb-1">
                      <span>Load</span>
                      <span className="font-bold tabular-nums">{a.infrastructureStressPercent}%</span>
                    </div>
                    <div className="h-1.5 bg-[#232323] rounded-full overflow-hidden border border-white/5">
                      <div
                        className={`h-full rounded-full ${a.infrastructureStressPercent > 90 ? 'bg-[#FF4D4D]' : 'bg-[#2ECC71]'}`}
                        style={{ width: `${a.infrastructureStressPercent}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-[#FF4D4D]/15 text-[#FF4D4D] border border-[#FF4D4D]/30">
                    {a.phase.replace('_', ' ')}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => navigate(`/workspace/communities/${a.habitationId}`)}
                    className="text-xs text-[#FF5A1F] font-bold hover:underline flex items-center gap-1 ml-auto cursor-pointer"
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
