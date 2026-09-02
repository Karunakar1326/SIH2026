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
    <div className="flex flex-col h-full overflow-hidden">
      <PageHeader
        title="Relocation Optimization Simulator"
        subtitle="Population-to-site matching engine, scenario comparison, remaining site capacity tracking, and infrastructure stress modeling"
        actions={
          <div className="flex bg-neutral-200 p-1 rounded text-xs font-semibold">
            <button
              onClick={() => setSelectedScenario('optimal')}
              className={`px-3 py-1 rounded transition-colors ${selectedScenario === 'optimal' ? 'bg-white text-neutral-900 shadow-2xs font-bold' : 'text-neutral-600'}`}
            >
              Balanced Optimal
            </button>
            <button
              onClick={() => setSelectedScenario('distance')}
              className={`px-3 py-1 rounded transition-colors ${selectedScenario === 'distance' ? 'bg-white text-neutral-900 shadow-2xs font-bold' : 'text-neutral-600'}`}
            >
              Min Distance
            </button>
            <button
              onClick={() => setSelectedScenario('capacity')}
              className={`px-3 py-1 rounded transition-colors ${selectedScenario === 'capacity' ? 'bg-white text-neutral-900 shadow-2xs font-bold' : 'text-neutral-600'}`}
            >
              Max Capacity
            </button>
          </div>
        }
      />

      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 px-6 py-4">
          <KPIBlock label="Total Relocation Need" value={formatCompactNumber(totalNeed)} riskLevel="critical" icon={<Users size={14} />} />
          <KPIBlock label="Available Site Capacity" value={formatCompactNumber(totalCapacity)} icon={<MapPin size={14} />} />
          <KPIBlock label="Net Capacity Deficit" value={formatCompactNumber(capacityDeficit)} trend="up" icon={<Activity size={14} />} />
          <KPIBlock label="Optimization Engine" value="Active (Greedy)" icon={<SlidersHorizontal size={14} />} />
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
