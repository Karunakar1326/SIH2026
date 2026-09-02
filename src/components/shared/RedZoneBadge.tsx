import { useState } from 'react';
import type { RedZoneCriteria } from '@/data/types';
import { ShieldAlert, CheckCircle2, X } from 'lucide-react';

interface RedZoneBadgeProps {
  redZone: RedZoneCriteria;
  size?: 'sm' | 'md' | 'lg';
  showDetailsButton?: boolean;
}

export function RedZoneBadge({ redZone, size = 'md', showDetailsButton = true }: RedZoneBadgeProps) {
  const [modalOpen, setModalOpen] = useState(false);

  const isRed = redZone.isRedZone;
  const badgeClasses = isRed
    ? 'bg-red-100 text-red-900 border-red-300 font-bold'
    : 'bg-emerald-100 text-emerald-900 border-emerald-300 font-semibold';

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5',
  }[size];

  return (
    <>
      <div className="inline-flex items-center gap-1.5">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border shadow-2xs ${badgeClasses} ${sizeClasses}`}
        >
          {isRed ? (
            <ShieldAlert size={size === 'lg' ? 16 : 13} className="text-red-600 shrink-0" />
          ) : (
            <CheckCircle2 size={size === 'lg' ? 16 : 13} className="text-emerald-600 shrink-0" />
          )}
          <span>{isRed ? 'RED-ZONE CLASSIFIED' : 'CLEAR / NON-RED ZONE'}</span>
        </span>

        {showDetailsButton && (
          <button
            onClick={() => setModalOpen(true)}
            className="text-neutral-500 hover:text-neutral-800 text-[11px] underline font-medium cursor-pointer"
            title="Inspect Red-Zone classification triggers"
          >
            Inspect Triggers
          </button>
        )}
      </div>

      {/* Red Zone Evidence Inspection Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-neutral-300 max-w-xl w-full overflow-hidden shadow-2xl animate-fade-in">
            {/* Modal Header */}
            <div className={`p-4 border-b ${isRed ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200'} flex justify-between items-start`}>
              <div className="flex items-center gap-2.5">
                {isRed ? <ShieldAlert size={22} className="text-red-600 shrink-0" /> : <CheckCircle2 size={22} className="text-emerald-600 shrink-0" />}
                <div>
                  <h3 className={`text-sm font-bold ${isRed ? 'text-red-900' : 'text-emerald-900'}`}>
                    {redZone.classificationTitle}
                  </h3>
                  <p className="text-xs text-neutral-600 mt-0.5">Authoritative Red-Zone Classification Evidence</p>
                </div>
              </div>
              <button onClick={() => setModalOpen(false)} className="text-neutral-400 hover:text-neutral-700">
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              {/* Primary Trigger Statement */}
              <div className="bg-neutral-50 border border-neutral-200 rounded p-3 text-xs">
                <div className="font-bold text-neutral-800 mb-1">Primary Classification Trigger:</div>
                <div className="text-neutral-700 font-medium leading-relaxed">{redZone.primaryTrigger}</div>
              </div>

              {/* Threshold Checklist */}
              <div>
                <div className="text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">
                  Classification Threshold Criteria Checklist
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between p-2 rounded bg-neutral-200/50">
                    <span>Hazard Inundation / Surge Threshold Exceeded</span>
                    <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${redZone.hazardThresholdExceeded ? 'bg-red-100 text-red-800' : 'bg-neutral-100 text-neutral-600'}`}>
                      {redZone.hazardThresholdExceeded ? 'TRIGGERED (YES)' : 'NOT TRIGGERED'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-neutral-200/50">
                    <span>Elevation Deficit Constraint (&lt; 10m MSL)</span>
                    <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${redZone.elevationConstraintMet ? 'bg-red-100 text-red-800' : 'bg-neutral-100 text-neutral-600'}`}>
                      {redZone.elevationConstraintMet ? 'TRIGGERED (YES)' : 'NOT TRIGGERED'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-neutral-200/50">
                    <span>Historical Disaster Recurrence Requirement</span>
                    <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${redZone.historicalRecurrenceMet ? 'bg-red-100 text-red-800' : 'bg-neutral-100 text-neutral-600'}`}>
                      {redZone.historicalRecurrenceMet ? 'TRIGGERED (YES)' : 'NOT TRIGGERED'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Trigger Factors List */}
              {redZone.triggerFactors.length > 0 && (
                <div>
                  <div className="text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">
                    Evidence Factors & Raw Agency Observations
                  </div>
                  <div className="space-y-2">
                    {redZone.triggerFactors.map((factor, i) => (
                      <div key={i} className="border border-neutral-200 rounded p-2.5 text-xs bg-white">
                        <div className="flex justify-between font-bold text-neutral-800 mb-0.5">
                          <span>{factor.name}</span>
                          <span className="text-red-600">{factor.rawValue}</span>
                        </div>
                        <p className="text-[11px] text-neutral-500">{factor.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-neutral-100 border-t border-neutral-200 flex justify-between items-center text-xs">
              <span className="text-neutral-500 text-[10px]">Classification verified by DDMA Spatial Engine</span>
              <button
                onClick={() => setModalOpen(false)}
                className="px-3 py-1.5 bg-neutral-900 text-white rounded font-medium text-xs hover:bg-neutral-800"
              >
                Close Inspection
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
