import { Satellite, SlidersHorizontal, MapPin } from 'lucide-react';

const STEPS = [
  {
    num: '01',
    title: 'ASSESS THREAT',
    sub: 'Satellite, radar & gauge data identifies which communities face real danger.',
    icon: Satellite,
    color: '#4fd1ff',
  },
  {
    num: '02',
    title: 'PRIORITIZE',
    sub: 'Multi-hazard RPI score ranks every habitation by exposure and urgency.',
    icon: SlidersHorizontal,
    color: '#3b82f6',
  },
  {
    num: '03',
    title: 'RELOCATE',
    sub: 'Platform matches at-risk populations to verified safe sites and generates plans.',
    icon: MapPin,
    color: '#22c55e',
  },
];

export function PipelineArchitectureDiagram() {
  return (
    <div style={{ position: 'relative' }}>
      {/* Section label */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 8 }}>
          // HOW_IT_WORKS // PIPELINE_OVERVIEW
        </div>
        <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: 22, fontWeight: 900, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.04em', margin: 0 }}>
          From Data to Decision
        </h2>
        <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: 'rgba(255,255,255,0.3)', marginTop: 6, letterSpacing: '0.06em' }}>
          THREE STEPS · ONE CLEAR OUTCOME
        </p>
      </div>

      {/* Steps grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
        {STEPS.map((step, i) => {
          const Icon = step.icon;
          return (
            <div
              key={i}
              className="hud-panel hud-scanline hud-card-hover"
              style={{ padding: '20px', position: 'relative', minHeight: '180px' }}
            >
              {/* Corner brackets */}
              <span className="hud-corner-tl" style={{ borderColor: step.color + '88' }} />
              <span className="hud-corner-tr" style={{ borderColor: step.color + '44' }} />
              <span className="hud-corner-bl" style={{ borderColor: step.color + '44' }} />
              <span className="hud-corner-br" style={{ borderColor: step.color + '88' }} />

              {/* Step number + icon row */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 28, fontWeight: 900, color: step.color, lineHeight: 1, opacity: 0.9 }}>
                  {step.num}
                </span>
                <div style={{
                  width: 34, height: 34,
                  border: `1px solid ${step.color}44`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: step.color,
                  background: `${step.color}0d`,
                }}>
                  <Icon size={17} />
                </div>
              </div>

              {/* Title */}
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, fontWeight: 700, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8 }}>
                {step.title}
              </div>

              {/* Sub */}
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, margin: 0 }}>
                {step.sub}
              </p>

              {/* Bottom accent line */}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, background: `linear-gradient(to right, transparent, ${step.color}44, transparent)` }} />
            </div>
          );
        })}
      </div>

      {/* Connector / divider between steps — desktop only */}
      <div style={{ position: 'absolute', top: '50%', left: '33.3%', right: '33.3%', height: 1, background: 'linear-gradient(to right, #4fd1ff22, #3b82f688, #22c55e22)', pointerEvents: 'none', zIndex: 0, display: 'none' }} />
    </div>
  );
}
