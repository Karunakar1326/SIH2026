import { useState } from 'react';
import { agencyMeta, type DataProvenance, type ScoreFactor } from '@/data/types';
import { Database, ShieldCheck, Clock, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';

interface DataProvenancePanelProps {
  scoreTitle: string;
  scoreValue: number;
  scoreMax?: number;
  factors: ScoreFactor[];
  provenanceMap?: Record<string, DataProvenance>;
  compact?: boolean;
}

export function DataProvenancePanel({
  scoreTitle,
  scoreValue,
  scoreMax = 100,
  factors,
  provenanceMap,
  compact = false,
}: DataProvenancePanelProps) {
  const [expanded, setExpanded] = useState(!compact);

  return (
    <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-sm">
      {/* Header */}
      <div
        onClick={() => setExpanded(!expanded)}
        className="px-4 py-3 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between cursor-pointer hover:bg-neutral-100/70 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Database size={14} className="text-accent" />
          <div>
            <div className="text-xs font-bold text-neutral-900">{scoreTitle} Provenance & Factor Traceability</div>
            <div className="text-[10px] text-neutral-500">Score: <span className="font-bold text-neutral-800">{scoreValue} / {scoreMax}</span> · Click to view contributing factors & raw inputs</div>
          </div>
        </div>
        <button className="text-neutral-400 hover:text-neutral-600 p-1">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className="p-4 space-y-4 animate-fade-in">
          {/* Contributing Factors */}
          <div>
            <div className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider mb-2">
              1. Contributing Factor Breakdown
            </div>
            <div className="space-y-2">
              {factors.map((factor, i) => {
                const agency = agencyMeta[factor.agency] || agencyMeta.DISTRICT_ADMIN;
                return (
                  <div key={i} className="bg-neutral-25 border border-neutral-150 rounded-md p-2.5 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-neutral-800">{factor.name}</span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${agency.color}`}>
                          {agency.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-neutral-500 text-[10px]">Weight: {factor.weight}%</span>
                        <span className="font-bold text-neutral-900">{factor.score}/100</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-baseline text-[11px] text-neutral-600 mt-1">
                      <span>Raw Observation: <strong className="text-neutral-800">{factor.rawValue}</strong></span>
                    </div>
                    <p className="text-[10px] text-neutral-500 mt-1 leading-tight">{factor.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Authoritative Datasets & Timestamps */}
          {provenanceMap && (
            <div>
              <div className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider mb-2">
                2. Input Datasets & Authoritative Sources
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {Object.entries(provenanceMap).map(([key, prov]) => {
                  const agency = agencyMeta[prov.agency] || agencyMeta.DISTRICT_ADMIN;
                  return (
                    <div key={key} className="bg-neutral-50 border border-neutral-200 rounded p-2.5 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-neutral-800 truncate">{prov.datasetName}</span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${agency.color}`}>
                          {agency.name}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-neutral-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Clock size={10} />
                          Updated: {new Date(prov.lastUpdated).toLocaleDateString('en-IN')}
                        </span>
                        <span className="flex items-center gap-1 font-semibold text-emerald-700">
                          <ShieldCheck size={10} />
                          {prov.confidence.toUpperCase()} CONFIDENCE ({prov.dataCompleteness}%)
                        </span>
                      </div>
                      {prov.methodologyNote && (
                        <div className="text-[9px] text-neutral-400 mt-1 border-t border-neutral-150 pt-1">
                          Sensor/Method: {prov.methodologyNote}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Provenance Footer */}
          <div className="text-[10px] text-neutral-400 border-t border-neutral-150 pt-2 flex items-center justify-between">
            <span>Traceability Pipeline: Authoritative Dataset → Feature Normalization → Weighted Composite Engine</span>
            <span className="flex items-center gap-1 text-accent font-medium">
              <ExternalLink size={10} /> Audit Pipeline Metadata
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
