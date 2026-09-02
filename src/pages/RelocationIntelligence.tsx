import { useState } from 'react';
import { PageHeader, KPIBlock } from '@/components/shared';
import { RelocationOptimizationMatrix } from '@/components/relocation/RelocationOptimizationMatrix';
import { PhasedRelocationPlan } from '@/components/relocation/PhasedRelocationPlan';
import { habitations } from '@/data/habitations';
import { safeSites } from '@/data/safe-sites';
import { formatCompactNumber } from '@/utils/helpers';
import { AlertTriangle, Users, TrendingUp, MapPin } from 'lucide-react';

export function RelocationIntelligence() {
  const [activeView, setActiveView] = useState<'matrix' | 'phases'>('matrix');

  const immediateCount = habitations.filter(h => h.relocation_urgency === 'immediate').length;
  const totalRelocPop = habitations.filter(h => h.relocation_urgency === 'immediate' || h.relocation_urgency === 'short-term').reduce((s, h) => s + h.population, 0);

  const suitableSites = safeSites.filter(s => s.status === 'suitable');
  const totalAvailableCapacity = suitableSites.reduce((s, site) => s + site.carrying_capacity.estimated_sustainable_capacity, 0);
  const capacityDeficit = Math.max(0, totalRelocPop - totalAvailableCapacity);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <PageHeader
        title="Relocation Priority & Phased Implementation"
        subtitle="Priority-ranked relocation assignment matrix, RPI scoring formula, and multi-year implementation roadmap"
        actions={
          <div className="flex bg-neutral-200 p-1 rounded text-xs font-semibold">
            <button
              onClick={() => setActiveView('matrix')}
              className={`px-3 py-1 rounded transition-colors ${activeView === 'matrix' ? 'bg-white text-neutral-900 shadow-2xs font-bold' : 'text-neutral-600'}`}
            >
              Assignment Matrix
            </button>
            <button
              onClick={() => setActiveView('phases')}
              className={`px-3 py-1 rounded transition-colors ${activeView === 'phases' ? 'bg-white text-neutral-900 shadow-2xs font-bold' : 'text-neutral-600'}`}
            >
              Phased Roadmap
            </button>
          </div>
        }
      />

      <div className="flex-1 overflow-y-auto">
        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 px-6 py-4">
          <KPIBlock label="Immediate Relocation" value={immediateCount} riskLevel="critical" icon={<AlertTriangle size={14} />} />
          <KPIBlock label="Total Relocation Pop." value={formatCompactNumber(totalRelocPop)} riskLevel="high" icon={<Users size={14} />} />
          <KPIBlock label="Suitable Sites" value={suitableSites.length} icon={<MapPin size={14} />} />
          <KPIBlock label="Net Capacity Deficit" value={formatCompactNumber(capacityDeficit)} trend="up" icon={<TrendingUp size={14} />} />
        </div>

        {/* View Selection */}
        <div className="px-6 pb-6 space-y-4">
          {activeView === 'matrix' ? (
            <RelocationOptimizationMatrix />
          ) : (
            <PhasedRelocationPlan />
          )}

          {/* RPI Formula Disclosure */}
          <div className="bg-neutral-900 text-white rounded-lg p-5 border border-neutral-800 text-xs">
            <h4 className="font-bold text-sm mb-2 text-white">Relocation Priority Index (RPI) Formula Methodology</h4>
            <p className="text-neutral-300 leading-relaxed mb-3">
              RPI is an authoritative decision-support score (0-100) that separates raw "Hazard Risk" from "Relocation Urgency".
              A settlement with high hazard risk may receive a lower priority if population exposure is minimal, whereas a settlement with moderate hazard but critical vulnerability and dense population will be prioritized first.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-[11px] font-mono">
              <div className="bg-neutral-800 p-2 rounded border border-neutral-700">
                <div className="text-neutral-400">Hazard Severity</div>
                <div className="text-sm font-bold text-red-400">30% Weight</div>
              </div>
              <div className="bg-neutral-800 p-2 rounded border border-neutral-700">
                <div className="text-neutral-400">Population Exposure</div>
                <div className="text-sm font-bold text-orange-400">25% Weight</div>
              </div>
              <div className="bg-neutral-800 p-2 rounded border border-neutral-700">
                <div className="text-neutral-400">Vulnerability Index</div>
                <div className="text-sm font-bold text-yellow-400">20% Weight</div>
              </div>
              <div className="bg-neutral-800 p-2 rounded border border-neutral-700">
                <div className="text-neutral-400">Historical Recurrence</div>
                <div className="text-sm font-bold text-emerald-400">15% Weight</div>
              </div>
              <div className="bg-neutral-800 p-2 rounded border border-neutral-700">
                <div className="text-neutral-400">Infra Deficit</div>
                <div className="text-sm font-bold text-purple-400">10% Weight</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
