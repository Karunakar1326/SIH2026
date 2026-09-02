import { useState } from 'react';
import { PageHeader, KPIBlock } from '@/components/shared';
import { RelocationOptimizationMatrix } from '@/components/relocation/RelocationOptimizationMatrix';
import { PhasedRelocationPlan } from '@/components/relocation/PhasedRelocationPlan';
import { safeSites } from '@/data/safe-sites';
import { habitations } from '@/data/habitations';
import { formatCompactNumber } from '@/utils/helpers';
import { SlidersHorizontal, Users, MapPin, Activity } from 'lucide-react';

export function RelocationOptimization() {
  const [selectedScenario, setSelectedScenario] = useState<'optimal' | 'distance' | 'capacity'>('optimal');

  const suitableSites = safeSites.filter(s => s.status === 'suitable');
  const totalNeed = habitations.filter(h => h.relocation_urgency === 'immediate' || h.relocation_urgency === 'short-term').reduce((s, h) => s + h.population, 0);
  const totalCapacity = suitableSites.reduce((s, site) => s + site.carrying_capacity.estimated_sustainable_capacity, 0);
  const capacityDeficit = Math.max(0, totalNeed - totalCapacity);

  return (
    <div className="flex flex-col h-full bg-[#141414] text-[#F5F5F5] overflow-hidden">
      <PageHeader
        title="Relocation Optimization Simulator"
        subtitle="Population-to-site matching engine, scenario comparison, remaining site capacity tracking, and infrastructure stress modeling"
        actions={
          <div className="flex bg-[#1C1C1C] border border-white/10 p-1 rounded-2xl text-xs font-semibold">
            <button
              onClick={() => setSelectedScenario('optimal')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${selectedScenario === 'optimal' ? 'bg-[#232323] text-white shadow-xs font-bold border border-white/10' : 'text-[#9A9A9A] hover:text-white'}`}
            >
              Balanced Optimal
            </button>
            <button
              onClick={() => setSelectedScenario('distance')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${selectedScenario === 'distance' ? 'bg-[#232323] text-white shadow-xs font-bold border border-white/10' : 'text-[#9A9A9A] hover:text-white'}`}
            >
              Min Distance
            </button>
            <button
              onClick={() => setSelectedScenario('capacity')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${selectedScenario === 'capacity' ? 'bg-[#232323] text-white shadow-xs font-bold border border-white/10' : 'text-[#9A9A9A] hover:text-white'}`}
            >
              Max Capacity
            </button>
          </div>
        }
      />

      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 px-6 py-4">
          <KPIBlock isHero={true} label="Total Relocation Need" value={formatCompactNumber(totalNeed)} riskLevel="critical" icon={<Users size={15} className="text-white" />} />
          <KPIBlock label="Available Site Capacity" value={formatCompactNumber(totalCapacity)} icon={<MapPin size={15} className="text-[#2ECC71]" />} />
          <KPIBlock label="Net Capacity Deficit" value={formatCompactNumber(capacityDeficit)} trend="up" icon={<Activity size={15} className="text-[#FFB020]" />} />
          <KPIBlock label="Optimization Engine" value="Active (Greedy)" icon={<SlidersHorizontal size={15} className="text-[#FF5A1F]" />} />
        </div>

        <div className="px-6 pb-6 space-y-6">
          {/* Assignment Matrix */}
          <RelocationOptimizationMatrix />

          {/* Phased Implementation Roadmap */}
          <PhasedRelocationPlan />
        </div>
      </div>
    </div>
  );
}
