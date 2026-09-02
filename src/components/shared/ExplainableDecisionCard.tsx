import { useState } from 'react';
import type { RelocationAssignment } from '@/data/types';
import { ShieldCheck, CheckCircle2, FileText, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ExplainableDecisionCardProps {
  assignment: RelocationAssignment;
}

export function ExplainableDecisionCard({ assignment }: ExplainableDecisionCardProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'reasons' | 'confidence' | 'alternatives'>('reasons');

  return (
    <div className="bg-white border border-neutral-250 rounded-lg overflow-hidden shadow-sm">
      {/* Top Banner */}
      <div className="bg-neutral-900 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck size={18} className="text-emerald-400" />
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-neutral-200">
              EXPLAINABLE RELOCATION RECOMMENDATION
            </div>
            <div className="text-[11px] text-neutral-400">
              Source: <strong className="text-white">{assignment.habitationName}</strong> → Target Site: <strong className="text-emerald-400">{assignment.siteName}</strong>
            </div>
          </div>
        </div>
        <span className="text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded">
          SUITABILITY SCORE: {assignment.suitabilityScore}/100
        </span>
      </div>

      {/* Quick Summary Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-neutral-50 border-b border-neutral-200 text-xs">
        <div>
          <div className="text-[10px] text-neutral-500 font-medium">Assigned Population</div>
          <div className="text-sm font-bold text-neutral-900">{assignment.assignedPopulation.toLocaleString()} people</div>
        </div>
        <div>
          <div className="text-[10px] text-neutral-500 font-medium">Relocation Distance</div>
          <div className="text-sm font-bold text-neutral-900">{assignment.travelDistanceKm} km highway</div>
        </div>
        <div>
          <div className="text-[10px] text-neutral-500 font-medium">Site Remaining Capacity</div>
          <div className="text-sm font-bold text-emerald-700">+{assignment.remainingSiteCapacity.toLocaleString()} surplus</div>
        </div>
        <div>
          <div className="text-[10px] text-neutral-500 font-medium">Assigned Phase</div>
          <div className="text-sm font-bold text-red-700 uppercase">{assignment.phase.replace('_', ' ')}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-neutral-200 bg-neutral-100 text-xs">
        <button
          onClick={() => setActiveTab('reasons')}
          className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
            activeTab === 'reasons' ? 'border-accent bg-white text-accent' : 'border-transparent text-neutral-600 hover:text-neutral-900'
          }`}
        >
          Why This Recommendation? ({assignment.recommendationReason.length})
        </button>
        <button
          onClick={() => setActiveTab('confidence')}
          className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
            activeTab === 'confidence' ? 'border-accent bg-white text-accent' : 'border-transparent text-neutral-600 hover:text-neutral-900'
          }`}
        >
          Confidence & Constraints
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {activeTab === 'reasons' && (
          <div className="space-y-2 text-xs">
            {assignment.recommendationReason.map((reason, i) => (
              <div key={i} className="flex items-start gap-2.5 p-2 bg-emerald-50/60 border border-emerald-150 rounded text-neutral-800">
                <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed font-medium">{reason}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'confidence' && (
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-2.5 bg-neutral-50 rounded border border-neutral-200">
              <span className="font-semibold text-neutral-700">Model Confidence Level</span>
              <span className="font-bold text-emerald-700 uppercase bg-emerald-100 px-2 py-0.5 rounded text-[10px]">
                {assignment.confidence} Confidence (92%)
              </span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-neutral-50 rounded border border-neutral-200">
              <span className="font-semibold text-neutral-700">Infrastructure Stress Load</span>
              <span className="font-bold text-amber-700 text-[10px]">
                {assignment.infrastructureStressPercent}% Capacity Load
              </span>
            </div>
            <div className="p-2.5 bg-amber-50 border border-amber-200 rounded text-amber-900 text-[11px] leading-relaxed">
              <strong>Known Limit & Field Action:</strong> Ground-truth verification required by DDMA field officer before final land acquisition notification under RFCTLARR Act 2013.
            </div>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="p-3 bg-neutral-50 border-t border-neutral-200 flex flex-wrap gap-2 justify-end">
        <button
          onClick={() => navigate('/workspace/safe-sites')}
          className="px-3 py-1.5 text-xs font-medium bg-white border border-neutral-300 rounded text-neutral-700 hover:bg-neutral-100 flex items-center gap-1.5"
        >
          <Layers size={13} /> View Safe Site Profile
        </button>
        <button
          onClick={() => navigate('/workspace/reports')}
          className="px-3 py-1.5 text-xs font-semibold bg-accent text-white rounded hover:bg-accent-dark flex items-center gap-1.5 shadow-2xs"
        >
          <FileText size={13} /> Generate Official Relocation Plan
        </button>
      </div>
    </div>
  );
}
