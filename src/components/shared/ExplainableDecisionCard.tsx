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
    <div className="bg-[#1C1C1C] border border-white/10 rounded-2xl overflow-hidden shadow-2xl text-[#F5F5F5]">
      {/* Top Banner */}
      <div className="bg-[#232323] text-white px-4 py-3 flex items-center justify-between border-b border-white/8">
        <div className="flex items-center gap-2.5">
          <ShieldCheck size={18} className="text-[#2ECC71]" />
          <div>
            <div className="text-xs font-black uppercase tracking-wider text-white">
              EXPLAINABLE RELOCATION RECOMMENDATION
            </div>
            <div className="text-[11px] text-[#9A9A9A] font-medium">
              Source: <strong className="text-white">{assignment.habitationName}</strong> → Target Site: <strong className="text-[#2ECC71]">{assignment.siteName}</strong>
            </div>
          </div>
        </div>
        <span className="text-[10px] font-mono font-bold bg-[#2ECC71]/15 text-[#2ECC71] border border-[#2ECC71]/30 px-2.5 py-0.5 rounded-full">
          SUITABILITY SCORE: {assignment.suitabilityScore}/100
        </span>
      </div>

      {/* Quick Summary Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-[#141414] border-b border-white/8 text-xs">
        <div>
          <div className="text-[10px] text-[#9A9A9A] font-medium uppercase tracking-wider">Assigned Population</div>
          <div className="text-sm font-black text-white tabular-nums">{assignment.assignedPopulation.toLocaleString()} people</div>
        </div>
        <div>
          <div className="text-[10px] text-[#9A9A9A] font-medium uppercase tracking-wider">Relocation Distance</div>
          <div className="text-sm font-black text-white tabular-nums">{assignment.travelDistanceKm} km highway</div>
        </div>
        <div>
          <div className="text-[10px] text-[#9A9A9A] font-medium uppercase tracking-wider">Site Surplus Capacity</div>
          <div className="text-sm font-black text-[#2ECC71] tabular-nums">+{assignment.remainingSiteCapacity.toLocaleString()} surplus</div>
        </div>
        <div>
          <div className="text-[10px] text-[#9A9A9A] font-medium uppercase tracking-wider">Assigned Phase</div>
          <div className="text-sm font-black text-[#FF4D4D] uppercase">{assignment.phase.replace('_', ' ')}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/8 bg-[#1C1C1C] text-xs">
        <button
          onClick={() => setActiveTab('reasons')}
          className={`px-4 py-2.5 font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'reasons' ? 'border-[#FF5A1F] bg-[#232323] text-[#FF5A1F]' : 'border-transparent text-[#9A9A9A] hover:text-white'
          }`}
        >
          Why This Recommendation? ({assignment.recommendationReason.length})
        </button>
        <button
          onClick={() => setActiveTab('confidence')}
          className={`px-4 py-2.5 font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'confidence' ? 'border-[#FF5A1F] bg-[#232323] text-[#FF5A1F]' : 'border-transparent text-[#9A9A9A] hover:text-white'
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
              <div key={i} className="flex items-start gap-2.5 p-2.5 bg-[#2ECC71]/10 border border-[#2ECC71]/20 rounded-xl text-white">
                <CheckCircle2 size={15} className="text-[#2ECC71] shrink-0 mt-0.5" />
                <span className="leading-relaxed font-medium">{reason}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'confidence' && (
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 bg-[#232323] rounded-xl border border-white/5">
              <span className="font-semibold text-[#9A9A9A]">Model Confidence Level</span>
              <span className="font-bold text-[#2ECC71] uppercase bg-[#2ECC71]/15 border border-[#2ECC71]/30 px-2.5 py-0.5 rounded-full text-[10px]">
                {assignment.confidence} Confidence (92%)
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#232323] rounded-xl border border-white/5">
              <span className="font-semibold text-[#9A9A9A]">Infrastructure Stress Load</span>
              <span className="font-bold text-[#FFB020] text-[10px] font-mono tabular-nums">
                {assignment.infrastructureStressPercent}% Capacity Load
              </span>
            </div>
            <div className="p-3 bg-[#FFB020]/10 border border-[#FFB020]/30 rounded-xl text-[#FFB020] text-[11px] leading-relaxed">
              <strong>Known Limit & Field Action:</strong> Ground-truth verification required by DDMA field officer before final land acquisition notification under RFCTLARR Act 2013.
            </div>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="p-3.5 bg-[#141414] border-t border-white/8 flex flex-wrap gap-2.5 justify-end">
        <button
          onClick={() => navigate('/workspace/safe-sites')}
          className="px-3.5 py-2 text-xs font-bold bg-[#232323] border border-white/10 rounded-xl text-white hover:bg-white/10 transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <Layers size={13} className="text-[#FF5A1F]" /> View Safe Site Profile
        </button>
        <button
          onClick={() => navigate('/workspace/reports')}
          className="px-4 py-2 text-xs font-bold bg-gradient-to-r from-[#FF7A3D] to-[#FF3D1F] text-white rounded-xl shadow-[0_0_16px_rgba(255,90,31,0.35)] hover:shadow-[0_0_24px_rgba(255,90,31,0.55)] flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <FileText size={13} /> Generate Official Relocation Plan
        </button>
      </div>
    </div>
  );
}
