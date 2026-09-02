import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { PublicHeader } from '@/components/public/PublicHeader';
import { ArrowRight, Lock, ChevronDown } from 'lucide-react';

/* ─── 5 Consequences Disaster Images ─── */
const CONSEQUENCES_IMAGES = [
  {
    url: '/images/consequences/download_12.jpg',
    statement: 'Communities are displaced.',
    label: 'DISPLACEMENT // COASTAL FLOOD',
    pos: 'top-left',
    rotation: '-2.5deg',
  },
  {
    url: '/images/consequences/img001.webp',
    statement: 'Infrastructure is damaged.',
    label: 'DESTRUCTION // STORM SURGE',
    pos: 'top-right',
    rotation: '3deg',
  },
  {
    url: '/images/consequences/img003.jpg',
    statement: 'Livelihoods are disrupted.',
    label: 'DISRUPTION // EROSION IMPACT',
    pos: 'center-left',
    rotation: '-1.5deg',
  },
  {
    url: '/images/consequences/img004.jpg',
    statement: 'Recovery takes time.',
    label: 'AFTERMATH // LONGLASTING IMPACT',
    pos: 'center-right',
    rotation: '2deg',
  },
  {
    url: '/images/consequences/img005.jpg',
    statement: "That's why understanding risk matters.",
    label: 'PREPAREDNESS // ACTION NEEDED',
    pos: 'bottom-center',
    rotation: '-1deg',
  },
];

export function PublicExploreLanding() {
  const navigate = useNavigate();
  const [scrollProgress, setScrollProgress] = useState(0);
  const consequencesRef = useRef<HTMLDivElement>(null);
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  // Track scroll position inside consequences section for floating photo animation
  useEffect(() => {
    const handleScroll = () => {
      if (!consequencesRef.current) return;
      const rect = consequencesRef.current.getBoundingClientRect();
      const windowH = window.innerHeight;
      const totalDist = rect.height - windowH;
      if (totalDist <= 0) return;

      const currentScroll = Math.max(0, -rect.top);
      const progress = Math.min(1, Math.max(0, currentScroll / totalDist));
      setScrollProgress(progress);

      const step = Math.min(
        CONSEQUENCES_IMAGES.length - 1,
        Math.floor(progress * CONSEQUENCES_IMAGES.length)
      );
      setActiveStepIndex(step);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="hud-root relative min-h-screen w-full bg-[#050507] text-slate-100 font-sans selection:bg-orange-500 selection:text-white">
      {/* ── 1. PERSISTENT FULL-PAGE UNIFORM CLEAR MAP BACKGROUND (FIXED) ── */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: 'url(/images/landing_hero_map.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: 'brightness(1.35) contrast(1.15)',
        }}
      />

      {/* ── 2. UNIFORM ATMOSPHERIC OVERLAY (FIXED - EQUAL ACROSS ALL SECTIONS) ── */}
      <div
        className="fixed inset-0 z-[1] pointer-events-none"
        style={{
          background: `
            linear-gradient(to right,
              rgba(5,5,7,0.78) 0%,
              rgba(5,5,7,0.55) 40%,
              rgba(5,5,7,0.38) 75%,
              rgba(5,5,7,0.48) 100%
            ),
            radial-gradient(ellipse 120% 120% at 50% 50%,
              transparent 35%,
              rgba(0,0,0,0.55) 100%
            )
          `,
        }}
      />

      {/* ── Inline keyframes for entrance animations ── */}
      <style>{`
        @keyframes heroFadeSlideUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hero-anim {
          opacity: 0;
          animation: heroFadeSlideUp 0.8s ease-out forwards;
        }
        .hero-anim-d1 { animation-delay: 0.15s; }
        .hero-anim-d2 { animation-delay: 0.35s; }
        .hero-anim-d3 { animation-delay: 0.55s; }
        .hero-anim-d4 { animation-delay: 0.75s; }
        .hero-anim-d5 { animation-delay: 0.95s; }
      `}</style>

      {/* ── Top Header Navigation ── */}
      <PublicHeader />

      {/* ── Main Content Area ── */}
      <main className="relative z-10 w-full overflow-x-hidden">

        {/* ══════════════════════════════════════════════════════════════
            SECTION 1 — HERO
            ══════════════════════════════════════════════════════════════ */}
        <section
          id="hero"
          className="relative min-h-[92vh] flex flex-col justify-between overflow-hidden"
        >
          {/* Top HUD status bar */}
          <div className="relative z-10 flex items-center justify-between font-mono text-[9px] text-white/40 tracking-widest uppercase border-b border-white/10 pb-4 px-8 md:px-14 pt-6 hero-anim hero-anim-d1">
            <div className="flex items-center gap-2">
              <span className="hud-blink bg-orange-500" />
              <span className="font-orbitron font-semibold text-white/70">NEXUS // DISASTER RISK AWARENESS</span>
            </div>
            <div className="hidden sm:flex items-center gap-4 text-white/30 font-mono">
              <span>GEOSPATIAL INTELLIGENCE</span>
              <span>EST. 2026</span>
            </div>
          </div>

          {/* Hero Content — Left 45% */}
          <div className="relative z-10 flex-1 flex items-center px-8 md:px-14 py-12">
            <div className="max-w-2xl space-y-8">
              {/* Eyebrow */}
              <div className="font-mono text-[10.5px] text-orange-400 tracking-[0.22em] uppercase flex items-center gap-2 hero-anim hero-anim-d1">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse shadow-[0_0_8px_#f97316]" />
                <span className="font-orbitron font-bold text-orange-400">// AWARENESS & PREPAREDNESS</span>
              </div>

              {/* Futuristic Pure White Headline */}
              <h1 className="font-orbitron font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-white uppercase tracking-tight leading-[1.02] drop-shadow-[0_0_35px_rgba(255,255,255,0.35)]">
                <span className="block hero-anim hero-anim-d2 text-white">DISASTERS</span>
                <span className="block hero-anim hero-anim-d3 text-white">
                  DON'T WAIT.
                </span>
              </h1>

              {/* Supporting text */}
              <p className="font-mono text-xs sm:text-sm text-slate-200 max-w-md leading-relaxed tracking-wide hero-anim hero-anim-d4 bg-black/40 p-3 rounded border border-white/10">
                Understanding risk today can help protect communities tomorrow.
              </p>

              {/* CTA buttons */}
              <div className="pt-3 flex flex-wrap items-center gap-4 hero-anim hero-anim-d5">
                <button
                  onClick={() => navigate('/workspace')}
                  className="hud-cta-orange bg-orange-500/25 border border-orange-500/80 hover:bg-orange-500/40 text-orange-300 font-orbitron font-bold text-xs uppercase tracking-widest px-8 py-4 rounded-sm flex items-center gap-3 transition-all cursor-pointer shadow-[0_0_20px_rgba(249,115,22,0.3)]"
                >
                  <Lock size={13} />
                  <span>EXPLORE THE PLATFORM</span>
                  <ArrowRight size={13} />
                </button>

                <button
                  onClick={() => document.getElementById('awareness')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-black/50 border border-white/20 hover:border-white/50 text-slate-200 font-orbitron font-semibold text-xs uppercase tracking-widest px-7 py-4 rounded-sm transition-all cursor-pointer"
                >
                  LEARN WHY RISK MATTERS
                </button>
              </div>
            </div>
          </div>

          {/* Scroll prompt */}
          <div className="relative z-10 flex items-center justify-center pb-8 hero-anim hero-anim-d5">
            <button
              onClick={() => document.getElementById('awareness')?.scrollIntoView({ behavior: 'smooth' })}
              className="flex flex-col items-center gap-1.5 font-orbitron text-[9px] text-white/40 hover:text-white/80 transition-colors cursor-pointer uppercase tracking-widest"
            >
              <span>SCROLL TO DISCOVER</span>
              <ChevronDown size={14} className="animate-bounce text-orange-400" />
            </button>
          </div>
        </section>


        {/* ══════════════════════════════════════════════════════════════
            SECTION 2 — AWARENESS
            Uniform background clarity across scroll
            ══════════════════════════════════════════════════════════════ */}
        <section
          id="awareness"
          className="hud-section-reveal py-28 px-8 md:px-16 border-b border-white/10 relative bg-black/20"
        >
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="space-y-4">
              <div className="font-orbitron font-semibold text-[10px] text-cyan-400 tracking-[0.2em] uppercase">
                // SECTION 02 // AWARENESS
              </div>

              <h2 className="font-orbitron font-black text-3xl sm:text-5xl text-white uppercase tracking-tight leading-tight drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                DISASTER RISK IS EVERYWHERE.
              </h2>

              <p className="text-sm sm:text-base text-slate-200 font-mono leading-relaxed max-w-2xl pt-2">
                Floods. Cyclones. Earthquakes. Landslides. <br />
                Different disasters. One common challenge — understanding risk before it becomes a crisis.
              </p>
            </div>

            {/* Minimal visual hazard indicator tags */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
              {[
                { tag: 'FLOODS', code: 'IMD / CWC', color: '#4fd1ff' },
                { tag: 'CYCLONES', code: 'BAY OF BENGAL', color: '#ff7a1a' },
                { tag: 'EARTHQUAKES', code: 'SEISMIC V', color: '#f87171' },
                { tag: 'LANDSLIDES', code: 'GSI SLOPES', color: '#22c55e' },
              ].map((h, i) => (
                <div
                  key={i}
                  className="hud-panel p-5 rounded-sm border border-white/15 bg-black/60 space-y-3 shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: h.color, boxShadow: `0 0 10px ${h.color}` }} />
                    <span className="font-mono text-[8.5px] text-white/40">{h.code}</span>
                  </div>
                  <div className="font-orbitron text-xs font-bold text-white tracking-widest">
                    {h.tag}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* ══════════════════════════════════════════════════════════════
            SECTION 3 — THE NEED
            Uniform background clarity across scroll
            ══════════════════════════════════════════════════════════════ */}
        <section
          id="the-need"
          className="hud-section-reveal py-28 px-8 md:px-16 border-b border-white/10 relative bg-black/25"
        >
          <div className="max-w-4xl mx-auto space-y-10 text-center sm:text-left">
            <div className="font-orbitron font-semibold text-[10px] text-orange-400 tracking-[0.2em] uppercase">
              // SECTION 03 // THE NEED
            </div>

            <h2 className="font-orbitron font-black text-3xl sm:text-5xl md:text-6xl text-white uppercase tracking-tight leading-tight drop-shadow-[0_0_20px_rgba(255,255,255,0.25)]">
              RISK IS MORE THAN A RED ZONE.
            </h2>

            <p className="text-base sm:text-xl text-slate-200 font-sans font-light leading-relaxed max-w-2xl">
              Behind every vulnerable region are communities, infrastructure and livelihoods.
            </p>

            <div className="pt-8 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="font-orbitron text-sm text-cyan-400 tracking-wider uppercase font-semibold">
                "Better understanding leads to better action."
              </div>

              <div className="font-mono text-[10px] text-white/40 tracking-widest uppercase">
                COMMUNITIES · INFRASTRUCTURE · LIVELIHOODS
              </div>
            </div>
          </div>
        </section>


        {/* ══════════════════════════════════════════════════════════════
            SECTION 4 — OUR APPROACH
            Uniform background clarity across scroll
            ══════════════════════════════════════════════════════════════ */}
        <section
          id="our-approach"
          className="hud-section-reveal py-28 px-8 md:px-16 border-b border-white/10 relative bg-black/20"
        >
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="space-y-4">
              <div className="font-orbitron font-semibold text-[10px] text-emerald-400 tracking-[0.2em] uppercase">
                // SECTION 04 // OUR APPROACH
              </div>

              <h2 className="font-orbitron font-black text-3xl sm:text-5xl text-white uppercase tracking-tight leading-tight drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                FROM RISK TO INFORMED ACTION.
              </h2>

              <p className="text-sm sm:text-base text-slate-200 font-mono leading-relaxed max-w-2xl">
                Our platform combines disaster-risk intelligence, geographic data and relocation analysis to support better decisions.
              </p>
            </div>

            {/* Simple visual sequence: RISK → INTELLIGENCE → ACTION */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4">
              {[
                { step: '01', title: 'RISK', desc: 'Identify exposure across hazards, geography, and population.', color: '#4fd1ff' },
                { step: '02', title: 'INTELLIGENCE', desc: 'Synthesize multi-source spatial data into actionable risk priorities.', color: '#ff7a1a' },
                { step: '03', title: 'ACTION', desc: 'Support safe site selection and phased community relocation plans.', color: '#22c55e' },
              ].map((s, i) => (
                <div
                  key={i}
                  className="hud-panel p-6 rounded-sm border border-white/15 bg-black/60 space-y-3 relative shadow-xl"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-orbitron text-2xl font-black" style={{ color: s.color }}>
                      {s.step}
                    </span>
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: s.color, boxShadow: `0 0 8px ${s.color}` }} />
                  </div>

                  <div className="font-orbitron text-sm font-bold text-white tracking-widest uppercase">
                    {s.title}
                  </div>

                  <p className="text-xs text-slate-300 font-sans leading-relaxed">
                    {s.desc}
                  </p>

                  {/* Connecting Arrow for desktop */}
                  {i < 2 && (
                    <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-white/30 font-mono text-xs">
                      →
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* ══════════════════════════════════════════════════════════════
            SECTION 5 — CONSEQUENCES
            Uniform background clarity across scroll
            ══════════════════════════════════════════════════════════════ */}
        <section
          id="consequences"
          ref={consequencesRef}
          className="relative min-h-[220vh] py-24 px-6 md:px-16 border-b border-white/10 bg-black/25"
        >
          {/* Sticky Container so text and floating photos stay in view as user scrolls */}
          <div className="sticky top-16 max-w-5xl mx-auto space-y-12 py-10">
            {/* Header */}
            <div className="space-y-3 text-center">
              <div className="font-orbitron font-semibold text-[10px] text-red-400 tracking-[0.2em] uppercase">
                // SECTION 05 // CONSEQUENCES
              </div>

              <h2 className="font-orbitron font-black text-3xl sm:text-5xl text-white uppercase tracking-tight drop-shadow-[0_0_20px_rgba(255,255,255,0.25)]">
                WHEN RISK BECOMES REAL.
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 font-mono max-w-xl mx-auto">
                The consequences are not numbers on a map. They affect people, homes and communities.
              </p>
            </div>

            {/* Central Typography Statement Reveal Box */}
            <div className="relative min-h-[320px] flex items-center justify-center text-center p-6 my-8 z-20">
              {CONSEQUENCES_IMAGES.map((item, idx) => {
                const isActive = idx === activeStepIndex;
                return (
                  <div
                    key={idx}
                    className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 ${
                      isActive
                        ? 'opacity-100 scale-100 translate-y-0'
                        : 'opacity-0 scale-95 translate-y-4 pointer-events-none'
                    }`}
                  >
                    <div className="font-orbitron text-[10px] text-red-400 uppercase tracking-widest mb-3">
                      IMPACT STATEMENT // 0{idx + 1}
                    </div>

                    <blockquote className="font-orbitron text-2xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tight max-w-3xl leading-tight drop-shadow-[0_0_25px_rgba(255,255,255,0.3)]">
                      "{item.statement}"
                    </blockquote>

                    <div className="font-mono text-[9px] text-white/40 tracking-widest uppercase mt-4">
                      {item.label}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* FLOATING DISASTER PHOTOGRAPHS */}
            <div className="relative h-[220px] sm:h-[300px] w-full max-w-4xl mx-auto">
              {CONSEQUENCES_IMAGES.map((img, idx) => {
                const isActive = idx === activeStepIndex;
                const isNearby = Math.abs(idx - activeStepIndex) <= 1;

                const posClasses: Record<string, string> = {
                  'top-left': 'left-2 sm:left-6 top-0 sm:top-2',
                  'top-right': 'right-2 sm:right-6 top-0 sm:top-4',
                  'center-left': 'left-4 sm:left-12 bottom-4',
                  'center-right': 'right-4 sm:right-12 bottom-4',
                  'bottom-center': 'left-1/2 -translate-x-1/2 bottom-0',
                };

                return (
                  <div
                    key={idx}
                    className={`absolute ${posClasses[img.pos]} transition-all duration-700 ease-out z-10 ${
                      isActive
                        ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                        : isNearby
                        ? 'opacity-25 scale-90 translate-y-6 pointer-events-none'
                        : 'opacity-0 scale-80 translate-y-12 pointer-events-none'
                    }`}
                    style={{
                      transform: isActive
                        ? `rotate(${img.rotation}) translateY(0px)`
                        : `rotate(${img.rotation}) translateY(20px)`,
                    }}
                  >
                    {/* Photo frame card */}
                    <div className="relative w-48 sm:w-64 rounded-sm border border-white/20 bg-neutral-900/95 p-2 shadow-2xl">
                      <div className="overflow-hidden rounded-xs aspectRatio-[4/3]">
                        <img
                          src={img.url}
                          alt={img.label}
                          className="w-full h-36 sm:h-44 object-cover filter contrast-110 brightness-90 hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="pt-2 px-1 flex items-center justify-between font-mono text-[8px] text-white/60 uppercase tracking-wider">
                        <span>{img.label}</span>
                        <span className="text-orange-400 font-bold font-orbitron">0{idx + 1}/05</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Scroll Progress Step Indicator */}
            <div className="flex items-center justify-center gap-2 pt-4">
              {CONSEQUENCES_IMAGES.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    i === activeStepIndex ? 'w-8 bg-red-500 shadow-[0_0_10px_#ef4444]' : 'w-2 bg-white/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </section>


        {/* ══════════════════════════════════════════════════════════════
            FINAL TRANSITION & CTA
            ENTER THE PLATFORM
            ══════════════════════════════════════════════════════════════ */}
        <section className="py-32 px-8 text-center bg-black/30 relative border-t border-white/10">
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="font-orbitron font-semibold text-[10px] text-orange-400 tracking-[0.2em] uppercase">
              // READY TO PLAN // ENTER PLATFORM
            </div>

            <h2 className="font-orbitron font-black text-3xl sm:text-5xl text-white uppercase tracking-tight leading-tight drop-shadow-[0_0_25px_rgba(255,255,255,0.3)]">
              UNDERSTAND THE RISK. <br />
              <span className="text-emerald-400">PLAN THE RESPONSE.</span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 font-mono tracking-wide max-w-lg mx-auto">
              Explore the intelligence behind better disaster decisions.
            </p>

            <div className="pt-4 flex items-center justify-center">
              <button
                onClick={() => navigate('/workspace')}
                className="hud-cta-orange bg-orange-500/25 border border-orange-500/80 hover:bg-orange-500/40 text-orange-300 font-orbitron font-bold text-xs uppercase tracking-widest px-9 py-4 rounded-sm flex items-center gap-3 transition-all cursor-pointer shadow-[0_0_25px_rgba(249,115,22,0.25)]"
              >
                <Lock size={14} />
                <span>ENTER THE PLATFORM</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
