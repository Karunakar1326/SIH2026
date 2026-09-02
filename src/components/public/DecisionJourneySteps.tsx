import { Search, AlertTriangle, ArrowRightLeft, MapPin, Building2, FileCheck } from 'lucide-react';

const STEPS = [
  { num: '01', title: 'IDENTIFY',   icon: Search,          color: '#4fd1ff' },
  { num: '02', title: 'ASSESS',     icon: AlertTriangle,   color: '#60a5fa' },
  { num: '03', title: 'PRIORITIZE', icon: ArrowRightLeft,  color: '#818cf8' },
  { num: '04', title: 'FIND',       icon: MapPin,          color: '#a78bfa' },
  { num: '05', title: 'EVALUATE',   icon: Building2,       color: '#c084fc' },
  { num: '06', title: 'PLAN',       icon: FileCheck,       color: '#22c55e' },
];

export function DecisionJourneySteps() {
  return (
    <div>
      {/* Section label */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 8 }}>
          // DECISION_WORKFLOW // RISK_TO_RELOCATION
        </div>
        <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: 22, fontWeight: 900, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.04em', margin: 0 }}>
          From Risk to Relocation
        </h2>
        <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: 'rgba(255,255,255,0.3)', marginTop: 6, letterSpacing: '0.06em' }}>
          SIX CLEAR DECISION STEPS · THREAT DETECTION → ACTION PLAN
        </p>
      </div>

      {/* Timeline */}
      <div style={{ position: 'relative' }}>
        {/* Connector line */}
        <div style={{
          position: 'absolute', top: 28, left: 28, right: 28, height: 1,
          background: 'linear-gradient(to right, #4fd1ff33, #22c55e33)',
          zIndex: 0,
        }} />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 2, position: 'relative', zIndex: 1 }}>
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            const isLast = i === STEPS.length - 1;
            return (
              <div
                key={i}
                className="hud-panel"
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  textAlign: 'center', padding: '16px 8px', gap: 8,
                  background: isLast ? `${step.color}0d` : '#0a0a0a',
                  borderColor: isLast ? `${step.color}55` : 'rgba(255,255,255,0.08)',
                  transition: 'all 0.18s',
                  cursor: 'default',
                }}
              >
                {/* Corner brackets */}
                <span className="hud-corner-tl" style={{ borderColor: step.color + '55' }} />
                <span className="hud-corner-br" style={{ borderColor: step.color + '33' }} />

                {/* Step number */}
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 8, color: step.color, letterSpacing: '0.1em', marginBottom: -4 }}>
                  {step.num}
                </div>

                {/* Icon circle */}
                <div style={{
                  width: 36, height: 36,
                  border: `1px solid ${step.color}${isLast ? '99' : '44'}`,
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: step.color,
                  background: `${step.color}${isLast ? '22' : '0d'}`,
                }}>
                  <Icon size={15} />
                </div>

                {/* Title */}
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, fontWeight: 700, color: isLast ? step.color : 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.08em', lineHeight: 1.2 }}>
                  {step.title}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
