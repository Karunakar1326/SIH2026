import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { PublicHeader } from "@/components/public/PublicHeader";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { ArrowRight, ChevronDown, AlertTriangle, Wind, Waves, Mountain, Shield } from "lucide-react";

const DISASTERS = [
  {
    id: "cyclone",
    label: "Cyclone",
    color: "#60a5fa",
    tagline: "Coastal Devastation",
    stat: "220 km/h",
    statLabel: "peak wind speed",
    images: ["/assets/disasters/cyclone01.jpg", "/assets/disasters/cyclone02.jpg"],
    desc: "Cyclonic storms annually displace millions along India's 7,500 km coastline, with intensifying frequency in the Bay of Bengal.",
    Icon: Wind,
  },
  {
    id: "flood",
    label: "Flood",
    color: "#34d399",
    tagline: "Rivers Unbound",
    stat: "1,200 km\u00b2",
    statLabel: "avg submerged area",
    images: ["/assets/disasters/flood01.jpg", "/assets/disasters/flood02.jpg", "/assets/disasters/flood03.jpg"],
    desc: "Floods are India's most recurrent disaster affecting over 45 million people each year, destroying crops, homes and infrastructure.",
    Icon: Waves,
  },
  {
    id: "landslide",
    label: "Landslide",
    color: "#f97316",
    tagline: "Hills Give Way",
    stat: "85,000 m\u00b3",
    statLabel: "typical debris volume",
    images: ["/assets/disasters/landslide01.webp", "/assets/disasters/landslide02.jpg"],
    desc: "Triggered by heavy rain and seismic activity, landslides isolate communities in hill states for weeks, cutting critical supply routes.",
    Icon: Mountain,
  },
];

const STATS = [
  { value: "45M+", label: "People affected annually" },
  { value: "20,000 Cr", label: "Economic losses / year" },
  { value: "22", label: "Disaster-prone states" },
  { value: "72 hrs", label: "Critical response window" },
];

const GALLERY = [
  { img: "/assets/disasters/cyclone01.jpg", caption: "Cyclone Landfall \u00b7 Odisha", tilt: -3 },
  { img: "/assets/disasters/flood01.jpg", caption: "Riverine Flood \u00b7 Bihar", tilt: 2 },
  { img: "/assets/disasters/landslide01.webp", caption: "Slope Failure \u00b7 Uttarakhand", tilt: -5 },
  { img: "/assets/disasters/flood03.jpg", caption: "Flash Flood \u00b7 Urban Drain", tilt: 4 },
  { img: "/assets/disasters/cyclone02.jpg", caption: "Storm Surge \u00b7 Chennai", tilt: -2 },
  { img: "/assets/disasters/landslide02.jpg", caption: "Debris Flow \u00b7 Himachal", tilt: 3 },
];

const TIMELINE_EVENTS = [
  {
    year: "1999",
    name: "Odisha Super Cyclone",
    type: "Cyclone",
    color: "#60a5fa",
    deaths: "10,000+",
    affected: "15M",
    desc: "The deadliest cyclone in India since 1971. Winds at 260 km/h obliterated 15 coastal districts. Entire villages vanished overnight.",
  },
  {
    year: "2004",
    name: "Indian Ocean Tsunami",
    type: "Tsunami",
    color: "#34d399",
    deaths: "16,000+",
    affected: "2.7M",
    desc: "Tsunami waves reaching 10m struck Tamil Nadu and Andaman & Nicobar Islands, erasing coastal settlements within minutes.",
  },
  {
    year: "2005",
    name: "Kashmir Earthquake",
    type: "Earthquake",
    color: "#a78bfa",
    deaths: "86,000+",
    affected: "3.5M",
    desc: "A 7.6 magnitude quake devastated Muzaffarabad and Uri. Entire mountainside communities were buried under rubble and debris.",
  },
  {
    year: "2013",
    name: "Kedarnath Flash Flood",
    type: "Flood",
    color: "#f97316",
    deaths: "5,700+",
    affected: "100K",
    desc: "Glacial lake outburst triggered flash floods in Uttarakhand. Ancient Kedarnath temple survived; 400 villages did not.",
  },
  {
    year: "2018",
    name: "Kerala Floods",
    type: "Flood",
    color: "#34d399",
    deaths: "483",
    affected: "5.4M",
    desc: "The worst flood in a century. 14 districts were submerged. India's first social-media-driven rescue operation mobilized civilians.",
  },
  {
    year: "2020",
    name: "Cyclone Amphan",
    type: "Cyclone",
    color: "#60a5fa",
    deaths: "128",
    affected: "13M",
    desc: "A super cyclonic storm that made landfall at 185 km/h, causing unprecedented damage across West Bengal and Bangladesh.",
  },
  {
    year: "2023",
    name: "Sikkim Glacial Burst",
    type: "Flood",
    color: "#f97316",
    deaths: "40+",
    affected: "100K",
    desc: "Sudden outburst of South Lhonak Lake swept through the Teesta valley, collapsing bridges and washing away a major dam.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: i * 0.12 },
  }),
};

/* ─────────────────────────────────────────────────────────────
   ANIMATED WORDS — premium word-by-word reveal
   Each word slides up from below with blur → clear
───────────────────────────────────────────────────────────── */
function AnimatedWords({
  text,
  className = '',
  delay = 0,
  as: Tag = 'h2',
}: {
  text: string;
  className?: string;
  delay?: number;
  as?: keyof JSX.IntrinsicElements;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const words = text.split(' ');

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.09, delayChildren: delay } },
  };

  const word = {
    hidden: { opacity: 0, y: 30, filter: 'blur(8px)', skewY: 2 },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      skewY: 0,
      transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <motion.div
      ref={ref as React.RefObject<HTMLDivElement>}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={container}
      className={`inline ${className}`}
      style={{ display: 'block' }}
    >
      {React.createElement(Tag, { className }, words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom mr-[0.25em] last:mr-0">
          <motion.span className="inline-block" variants={word}>{w}</motion.span>
        </span>
      )))}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   ANIMATED LABEL — tracking-expand + blur reveal for eyebrow labels
───────────────────────────────────────────────────────────── */
function AnimatedLabel({ text, className = '', delay = 0 }: { text: string; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-30px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, letterSpacing: '0.05em', filter: 'blur(4px)' }}
      animate={inView ? { opacity: 1, letterSpacing: '0.3em', filter: 'blur(0px)' } : {}}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      {text}
    </motion.div>
  );
}


/* ─────────────────────────────────────────────────────────────
   TIMELINE ITEM COMPONENT
───────────────────────────────────────────────────────────── */
function TimelineItem({ ev, i }: { ev: typeof TIMELINE_EVENTS[0]; i: number }) {
  const isLeft = i % 2 === 0;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <div ref={ref} className={`relative flex flex-col md:flex-row md:items-center gap-0 ${isLeft ? '' : 'md:flex-row-reverse'}`}>
      {/* Mobile year */}
      <div className="md:hidden flex items-center gap-3 mb-2 px-1">
        <div className="w-3 h-3 rounded-full shrink-0" style={{ background: ev.color }} />
        <span className="font-black text-sm" style={{ color: ev.color }}>{ev.year}</span>
      </div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        className="md:w-[calc(50%-2rem)] group"
      >
        <div className={`bg-white/4 border border-white/8 rounded-2xl p-6 hover:bg-white/7 hover:border-white/14 transition-all duration-500 ${isLeft ? "md:mr-8" : "md:ml-8"}`}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] font-bold tracking-[0.25em] uppercase px-2.5 py-1 rounded-full"
              style={{ color: ev.color, background: `${ev.color}18`, border: `1px solid ${ev.color}30` }}>
              {ev.type}
            </span>
          </div>
          <h3 className="text-white font-black text-xl tracking-tight mb-1.5">{ev.name}</h3>
          <p className="text-white/50 text-sm leading-relaxed mb-4">{ev.desc}</p>
          <div className="flex items-center gap-5 pt-3 border-t border-white/8">
            <div>
              <div className="text-white font-black text-lg">{ev.deaths}</div>
              <div className="text-white/35 text-[10px] uppercase tracking-wide font-medium">Deaths</div>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div>
              <div className="text-white font-black text-lg">{ev.affected}</div>
              <div className="text-white/35 text-[10px] uppercase tracking-wide font-medium">Affected</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Center year node — desktop — tagged with id for spine measurement */}
      <motion.div
        id={`timeline-node-${i}`}
        initial={{ opacity: 0, scale: 0 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1], delay: 0.25 }}
        className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center justify-center z-10"
      >
        <div className="w-14 h-14 rounded-full flex items-center justify-center font-black text-sm text-white border-2"
          style={{ background: `${ev.color}22`, borderColor: `${ev.color}60`, boxShadow: `0 0 24px ${ev.color}30` }}>
          {ev.year}
        </div>
      </motion.div>

      {/* Spacer for alternating side */}
      <div className="hidden md:block md:w-[calc(50%-2rem)]" />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   TIMELINE SPINE
   Scroll-driven arrow trajectory that travels node-to-node
   down the center axis as the user scrolls each year into view.
───────────────────────────────────────────────────────────── */
function TimelineSpine({ containerRef }: { containerRef: React.RefObject<HTMLDivElement> }) {
  const [nodeYs, setNodeYs] = React.useState<number[]>([]);
  const [containerH, setContainerH] = React.useState(0);

  React.useEffect(() => {
    const measure = () => {
      if (!containerRef.current) return;
      const base = containerRef.current.getBoundingClientRect().top + window.scrollY;
      const ys: number[] = [];
      TIMELINE_EVENTS.forEach((_, i) => {
        const el = document.getElementById(`timeline-node-${i}`);
        if (el) {
          const r = el.getBoundingClientRect();
          ys.push(r.top + window.scrollY - base + r.height / 2);
        }
      });
      if (ys.length) setNodeYs(ys);
      setContainerH(containerRef.current.scrollHeight);
    };
    const t = setTimeout(measure, 350);
    window.addEventListener('resize', measure);
    return () => { clearTimeout(t); window.removeEventListener('resize', measure); };
  }, [containerRef]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 75%', 'end 25%'],
  });

  const n = nodeYs.length;
  const inputRange  = n > 1 ? nodeYs.map((_, i) => i / (n - 1)) : [0, 1];
  const outputRange = n > 1 ? nodeYs : [0, containerH];

  // Y position of the travelling arrow dot
  const arrowY = useTransform(scrollYProgress, inputRange, outputRange);
  // Trail height grows from first node to arrow position
  const trailScaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  // Active event color (changes per node as arrow passes)
  const [activeIdx, setActiveIdx] = React.useState(0);
  React.useEffect(() => {
    const unsub = scrollYProgress.on('change', (v) => {
      setActiveIdx(Math.max(0, Math.min(Math.round(v * (n - 1)), n - 1)));
    });
    return unsub;
  }, [scrollYProgress, n]);

  if (!nodeYs.length) return null;
  const color = TIMELINE_EVENTS[activeIdx]?.color ?? '#f97316';
  const firstY = nodeYs[0];
  const lastY  = nodeYs[n - 1];

  return (
    <div className="absolute left-1/2 top-0 bottom-0 w-0 hidden md:block" style={{ height: containerH }}>
      {/* Ghost spine — full height */}
      <div
        className="absolute left-1/2 -translate-x-1/2 w-px"
        style={{ top: firstY, height: lastY - firstY, background: 'rgba(255,255,255,0.07)' }}
      />

      {/* Drawn trail — scaleY from top to arrow */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 w-0.5 origin-top"
        style={{
          top: firstY,
          height: lastY - firstY,
          scaleY: trailScaleY,
          background: `linear-gradient(to bottom, ${color}90, ${color}30)`,
          boxShadow: `0 0 10px ${color}50`,
          transition: 'background 0.5s ease, box-shadow 0.5s ease',
        }}
      />

      {/* ── Moving arrow dot ── */}
      <motion.div
        className="absolute"
        style={{ left: '50%', top: 0, y: arrowY, translateX: '-50%', translateY: '-50%' }}
      >
        {/* Outer breathing ring */}
        <motion.div
          className="absolute rounded-full -translate-x-1/2 -translate-y-1/2"
          style={{
            width: 40, height: 40, left: '50%', top: '50%',
            background: `${color}14`,
            border: `1.5px solid ${color}35`,
          }}
          animate={{ scale: [1, 1.5, 1], opacity: [0.7, 0.2, 0.7] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Arrow circle */}
        <div
          className="relative w-7 h-7 rounded-full flex items-center justify-center z-20"
          style={{
            background: color,
            boxShadow: `0 0 18px ${color}80, 0 0 36px ${color}35`,
            transition: 'background 0.5s ease, box-shadow 0.5s ease',
          }}
        >
          {/* Downward pointing chevron */}
          <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
            <path d="M1 1L5.5 7L10 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </motion.div>
    </div>
  );
}


/* ─────────────────────────────────────────────────────────────
   MAP PATH OVERLAY
   Scroll-driven SVG arrow tracing a KDE-style evacuation route
   through India's disaster zones as the user scrolls.
───────────────────────────────────────────────────────────── */
function MapPathOverlay({ scrollProgress }: { scrollProgress: ReturnType<typeof useScroll>['scrollYProgress'] }) {

  const pathLength = useTransform(scrollProgress, [0, 0.88], [0, 1]);
  const opacity    = useTransform(scrollProgress, [0, 0.08, 0.82, 1], [0, 1, 1, 0]);

  // KDE-style curved route: Gujarat → Karnataka → Kerala → Tamil Nadu
  // → Andhra → Odisha → West Bengal, in a 1000×1200 portrait viewBox
  const ROUTE = [
    'M 310,185',
    'C 292,232 272,282 262,332',
    'C 252,382 257,422 247,462',
    'C 237,502 217,533 212,573',
    'C 207,613 217,647 222,682',
    'C 227,717 232,747 237,777',
    'C 242,807 257,837 272,862',
    'C 292,892 327,912 362,927',
    'C 397,942 437,950 472,954',
    'C 512,958 552,952 587,937',
    'C 622,922 652,897 672,867',
    'C 692,837 697,802 692,772',
    'C 687,742 672,717 662,690',
    'C 652,662 650,632 657,602',
    'C 664,572 680,547 692,517',
    'C 704,487 710,457 707,427',
    'C 704,397 690,372 677,347',
    'C 662,317 647,297 652,267',
    'C 657,237 682,217 702,192',
    'C 722,167 742,150 762,132',
  ].join(' ');

  const HOTSPOTS = [
    { cx: 262, cy: 332, r: 4,   label: 'Gujarat Flood Zone' },
    { cx: 237, cy: 573, r: 3.5, label: 'Goa Coastal Risk' },
    { cx: 227, cy: 717, r: 5,   label: 'Kerala Flood Belt' },
    { cx: 272, cy: 862, r: 4.5, label: 'Tamil Nadu Cyclone Coast' },
    { cx: 657, cy: 602, r: 4,   label: 'Andhra Coast' },
    { cx: 707, cy: 427, r: 5.5, label: 'Odisha Super Cyclone Zone' },
    { cx: 762, cy: 132, r: 4,   label: 'West Bengal / NE Flood' },
  ];

  return (
    <motion.div className="absolute inset-0 pointer-events-none z-[5]" style={{ opacity }}>
      <svg viewBox="0 0 1000 1200" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <filter id="pathGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="5"  result="b1" />
            <feGaussianBlur stdDeviation="14" result="b2" />
            <feMerge><feMergeNode in="b2"/><feMergeNode in="b1"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="dotGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <marker id="arrowTip" markerWidth="9" markerHeight="9" refX="4.5" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,6 L8,3 z" fill="#fb923c" filter="url(#pathGlow)" />
          </marker>
        </defs>

        {/* Ghost dashed base path — full route, always faintly visible */}
        <path d={ROUTE} fill="none" stroke="rgba(249,115,22,0.07)" strokeWidth="2"
          strokeLinecap="round" strokeDasharray="6 10" />

        {/* Outer KDE density glow */}
        <motion.path d={ROUTE} fill="none" stroke="rgba(251,146,60,0.15)" strokeWidth="16"
          strokeLinecap="round" style={{ pathLength }} filter="url(#pathGlow)" />

        {/* Mid glow ring */}
        <motion.path d={ROUTE} fill="none" stroke="rgba(249,115,22,0.30)" strokeWidth="6"
          strokeLinecap="round" style={{ pathLength }} filter="url(#pathGlow)" />

        {/* Core bright line with arrowhead */}
        <motion.path d={ROUTE} fill="none" stroke="rgba(249,115,22,0.85)" strokeWidth="2.2"
          strokeLinecap="round" style={{ pathLength }} markerEnd="url(#arrowTip)" />

        {/* Fine dashed inner highlight */}
        <motion.path d={ROUTE} fill="none" stroke="rgba(253,186,116,0.55)" strokeWidth="1"
          strokeLinecap="round" strokeDasharray="3 14" style={{ pathLength }} />

        {/* Disaster hotspot markers */}
        {HOTSPOTS.map((dot, i) => (
          <motion.g key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2 + i * 0.18, duration: 0.55, ease: [0.34, 1.56, 0.64, 1] }}>
            <motion.circle cx={dot.cx} cy={dot.cy} r={dot.r * 5}
              fill="rgba(249,115,22,0.06)"
              animate={{ r: [dot.r * 5, dot.r * 7, dot.r * 5] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }} />
            <circle cx={dot.cx} cy={dot.cy} r={dot.r * 2.2} fill="rgba(249,115,22,0.18)" />
            <circle cx={dot.cx} cy={dot.cy} r={dot.r} fill="#f97316" filter="url(#dotGlow)" />
          </motion.g>
        ))}
      </svg>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   STAT CARD — proper component so hooks aren't inside .map()
───────────────────────────────────────────────────────────── */
function StatCard({ value, label, index }: { value: string; label: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div ref={ref} custom={index} variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'} className="text-center">
      <div className="text-3xl md:text-4xl font-black text-white tracking-tight">{value}</div>
      <div className="text-white/45 text-xs mt-2 tracking-wide uppercase font-medium">{label}</div>
    </motion.div>
  );
}

export function PublicExploreLanding() {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLElement>(null);
  const timelineContainerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroBgScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const heroTextY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const BG = "/landing page.png";

  return (
    <div className="landing-grid-bg min-h-screen bg-[#050508] text-white overflow-x-hidden" style={{ fontFamily: "'Inter', 'Helvetica Neue', sans-serif" }}>
      <PublicHeader />

      {/* HERO */}
      <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div className="absolute inset-0" style={{ scale: heroBgScale }}>
          <img src={BG} alt="India Disaster Risk Map" className="w-full h-full object-cover object-center" style={{ filter: "brightness(0.5) saturate(1.1)" }} />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050508]/70 via-transparent to-[#050508]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050508]/30 via-transparent to-[#050508]/30" />
        </motion.div>

        {/* KDE-style scroll-driven path arrow over India map */}
        <MapPathOverlay scrollProgress={scrollYProgress} />

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.7 }}
          className="absolute top-24 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-orange-500/15 border border-orange-500/40 rounded-full px-5 py-2 text-orange-400 text-xs font-semibold tracking-widest uppercase z-10">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
          India's Disaster Intelligence Platform
        </motion.div>

        <motion.div style={{ y: heroTextY, opacity: heroOpacity }} className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.13 } } }}>
            <motion.h1 variants={fadeUp}
              className="text-5xl sm:text-7xl md:text-[88px] font-black text-white tracking-[-0.02em] leading-[0.92] mb-7"
              style={{ textShadow: "0 4px 40px rgba(0,0,0,0.9)" }}>
              When Nature{" "}
              <span
                className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500 animate-gradient-text"
                style={{ backgroundSize: "200% 200%" }}>
                Strikes India
              </span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg md:text-xl text-white/60 max-w-lg mx-auto leading-relaxed mb-10">
              Understand the risk. Visualize the impact.<br />
              Navigate to safety � with intelligence.
            </motion.p>
            <motion.div variants={fadeUp} className="flex items-center justify-center gap-5 flex-wrap">
              <button onClick={() => navigate("/workspace")}
                className="group flex items-center gap-2.5 bg-orange-500 hover:bg-orange-400 text-white font-bold text-sm px-8 py-4 rounded-xl transition-all duration-300 shadow-[0_0_36px_rgba(249,115,22,0.45)] hover:shadow-[0_0_56px_rgba(249,115,22,0.7)] cursor-pointer">
                Enter the Platform
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => document.getElementById("awareness")?.scrollIntoView({ behavior: "smooth" })}
                className="flex items-center gap-2 text-white/55 hover:text-white/90 text-sm font-medium transition-colors cursor-pointer">
                Learn More <ChevronDown size={15} className="animate-bounce" />
              </button>
            </motion.div>
          </motion.div>
        </motion.div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-35 z-10">
          <div className="w-px h-14 bg-gradient-to-b from-transparent to-white" />
          <span className="text-[9px] tracking-[0.35em] uppercase text-white">Scroll</span>
        </div>
      </section>

      {/* STATS */}
      <section id="awareness" className="py-16 border-y border-white/8 bg-white/3 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-10">
          {STATS.map((s, i) => (
            <StatCard key={s.label} value={s.value} label={s.label} index={i} />
          ))}
        </div>
      </section>

      {/* WHY THIS MATTERS */}
      <section id="the-need" className="py-28 md:py-36">
        <div className="max-w-4xl mx-auto px-6 text-center">
          {(() => {
            const ref = useRef<HTMLDivElement>(null);
            const inView = useInView(ref, { once: true });
            return (
              <div ref={ref}>
                <AnimatedLabel
                  text="The Problem"
                  className="text-orange-400 text-xs font-bold uppercase mb-5"
                />
                <AnimatedWords
                  as="h2"
                  text="India is one of the world's"
                  className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight mb-2"
                />
                <div className="mb-8">
                  <AnimatedWords
                    as="span"
                    text="most disaster-prone nations."
                    delay={0.35}
                    className="text-4xl md:text-6xl font-black tracking-tight leading-tight text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400"
                  />
                </div>
                <motion.p custom={2} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
                  className="text-white/50 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
                  Floods, cyclones, landslides — they don't wait for systems to catch up. The gap between disaster and response costs lives. We built Nexus to close that gap.
                </motion.p>
              </div>
            );
          })()}
        </div>
      </section>

      {/* DISASTER CATEGORIES */}
      <section id="consequences" className="py-20 md:py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-20">
            <AnimatedLabel
              text="Three Primary Threats"
              className="text-orange-400 text-xs font-bold uppercase mb-4"
            />
            <AnimatedWords
              as="h2"
              text="Know Your Disaster"
              delay={0.1}
              className="text-4xl md:text-5xl font-black text-white tracking-tight"
            />
          </div>

          <div className="space-y-28 md:space-y-36">
            {DISASTERS.map((d, index) => {
              const ref = useRef<HTMLDivElement>(null);
              const inView = useInView(ref, { once: true, margin: "-60px" });
              const isEven = index % 2 === 0;
              const Icon = d.Icon;
              return (
                <motion.div key={d.id} ref={ref}
                  initial={{ opacity: 0, x: isEven ? -60 : 60 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                  className={`flex flex-col ${isEven ? "md:flex-row" : "md:flex-row-reverse"} gap-10 md:gap-20 items-center`}>

                  {/* Image Collage */}
                  <div className="relative w-full md:w-1/2 aspect-[4/3] shrink-0">
                    {d.images.slice(0, 2).map((img, i) => (
                      <motion.div key={i}
                        initial={{ opacity: 0, scale: 0.88, rotate: i === 0 ? -5 : 4 }}
                        animate={inView ? { opacity: 1, scale: 1, rotate: i === 0 ? -2 : 2 } : {}}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.25 + i * 0.18 }}
                        className="absolute rounded-2xl overflow-hidden border border-white/12 shadow-2xl"
                        style={{
                          width: i === 0 ? "72%" : "56%",
                          aspectRatio: "4/3",
                          top: i === 0 ? "0" : "25%",
                          left: i === 0 ? "0" : "30%",
                          zIndex: i + 1,
                        }}>
                        <img src={img} alt={d.label} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      </motion.div>
                    ))}
                    <div className="absolute bottom-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-25" style={{ background: d.color }} />
                  </div>

                  {/* Text */}
                  <div className="flex-1 space-y-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: `${d.color}18`, border: `1px solid ${d.color}35` }}>
                        <Icon size={17} style={{ color: d.color }} />
                      </div>
                      <span className="text-xs font-bold tracking-[0.25em] uppercase" style={{ color: d.color }}>{d.label}</span>
                    </div>
                    <h3 className="text-3xl md:text-4xl font-black text-white leading-tight tracking-tight">{d.tagline}</h3>
                    <p className="text-white/55 text-base leading-relaxed max-w-md">{d.desc}</p>
                    <div className="inline-flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl px-5 py-3.5">
                      <div className="text-2xl font-black text-white">{d.stat}</div>
                      <div className="text-white/45 text-xs uppercase tracking-wide font-medium">{d.statLabel}</div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* POLAROID GALLERY */}
      <section className="py-20 bg-[#08080d]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-white/35 text-xs uppercase tracking-[0.35em] mb-3">Field Documentation</motion.p>
            <AnimatedWords
              as="h2"
              text="On the Ground Reality"
              delay={0.1}
              className="text-4xl font-black text-white tracking-tight"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-5 md:gap-6">
            {GALLERY.map((c, i) => {
              const ref = useRef<HTMLDivElement>(null);
              const inView = useInView(ref, { once: true, margin: "-30px" });
              return (
                <motion.div key={i} ref={ref}
                  initial={{ opacity: 0, y: 55, rotate: 0 }}
                  animate={inView ? { opacity: 1, y: 0, rotate: c.tilt } : {}}
                  transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: i * 0.13 }}
                  className="w-36 md:w-44 bg-white p-2.5 pb-9 shadow-2xl hover:scale-105 hover:z-10 transition-transform duration-300 cursor-pointer relative">
                  <div className="aspect-[3/4] overflow-hidden">
                    <img src={c.img} alt={c.caption} className="w-full h-full object-cover" />
                  </div>
                  <div className="mt-3 text-center text-[9px] font-bold text-gray-600 tracking-wider uppercase leading-tight px-1">{c.caption}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* INDIA DISASTER TIMELINE */}
      <section className="py-24 md:py-32 bg-[#050508] relative overflow-hidden">
        {/* Subtle grid texture */}
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "48px 48px" }} />

        <div className="max-w-5xl mx-auto px-6 relative z-10">
          {/* Header */}
          <div className="text-center mb-20">
            <AnimatedLabel
              text="A History of Loss"
              className="text-orange-400 text-xs font-bold uppercase mb-4"
            />
            <AnimatedWords
              as="h2"
              text="India's Defining Disasters"
              delay={0.1}
              className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight"
            />
            <motion.p
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: 0.35, duration: 0.7 }}
              className="text-white/45 text-base mt-4 max-w-xl mx-auto leading-relaxed">
              Every decade has brought catastrophe. Every catastrophe has taught a lesson.
              This platform exists so those lessons save the next generation.
            </motion.p>
          </div>

          {/* Timeline */}
          <div ref={timelineContainerRef} className="relative">
            <TimelineSpine containerRef={timelineContainerRef} />

            <div className="space-y-10 md:space-y-16">
              {TIMELINE_EVENTS.map((ev, i) => (
                <TimelineItem key={ev.year} ev={ev} i={i} />
              ))}
            </div>

          </div>

          {/* Bottom note */}
          <motion.p
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-center text-white/25 text-xs mt-16 tracking-wide uppercase">
            And hundreds more events not recorded in any database. That's why we built Nexus.
          </motion.p>
        </div>
      </section>

      {/* HOW IT WORKS */}

      <section className="py-24 md:py-32 bg-gradient-to-b from-[#08080d] to-[#050508]">
        {(() => {
          const ref = useRef<HTMLDivElement>(null);
          const inView = useInView(ref, { once: true });
          const cards = [
            { Icon: AlertTriangle, color: "#f97316", title: "Real-Time Risk Mapping", desc: "Live hazard overlays across all 28 states � updated as conditions evolve on the ground." },
            { Icon: Shield, color: "#60a5fa", title: "Safe Route Planning", desc: "AI-powered evacuation routing that adapts to blocked roads and flood zones automatically." },
            { Icon: Waves, color: "#34d399", title: "Community Response", desc: "Connect affected citizens with shelters, aid, and emergency services instantly." },
          ];
          return (
            <div ref={ref} className="max-w-5xl mx-auto px-6">
              <div className="text-center mb-16">
                <AnimatedLabel
                  text="Our Approach"
                  className="text-orange-400 text-xs font-bold uppercase mb-4"
                />
                <AnimatedWords
                  as="h2"
                  text="Intelligence That Saves Lives"
                  delay={0.1}
                  className="text-4xl md:text-5xl font-black text-white tracking-tight"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {cards.map((item, i) => {
                  const Icon = item.Icon;
                  return (
                    <motion.div key={i} custom={i} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
                      className="group bg-white/4 border border-white/8 rounded-2xl p-7 hover:bg-white/7 hover:border-white/14 transition-all duration-500">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                        style={{ background: `${item.color}14`, border: `1px solid ${item.color}28` }}>
                        <Icon size={18} style={{ color: item.color }} />
                      </div>
                      <h3 className="text-white font-bold text-lg mb-2.5 tracking-tight">{item.title}</h3>
                      <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          );
        })()}
      </section>

      {/* FINAL CTA */}
      <section className="relative py-40 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={BG} alt="" className="w-full h-full object-cover object-center opacity-15" style={{ filter: "blur(3px) saturate(0.5)" }} />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050508] via-[#050508]/55 to-[#050508]" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[700px] h-[700px] rounded-full bg-orange-500/6 blur-[140px]" />
        </div>

        <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 text-center px-6">
          <AnimatedLabel
            text="Ready When You Are"
            className="text-orange-400 text-xs font-bold uppercase mb-6"
          />
          <AnimatedWords
            as="h2"
            text="PATH TO SAFETY"
            delay={0.1}
            className={`text-6xl md:text-8xl font-black tracking-tight leading-none mb-10 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500 animate-gradient-text`}
          />
          <p className="text-white/45 text-base mb-10 max-w-sm mx-auto leading-relaxed">
            Your intelligent companion for disaster preparedness and safe evacuation.
          </p>
          <button onClick={() => navigate("/workspace")}
            className="group inline-flex items-center gap-3 bg-orange-500 hover:bg-orange-400 text-white font-bold text-base px-10 py-4 rounded-xl transition-all duration-300 shadow-[0_0_48px_rgba(249,115,22,0.4)] hover:shadow-[0_0_80px_rgba(249,115,22,0.7)] cursor-pointer">
            PATH TO SAFETY ?
            <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
          </button>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/8 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-white/25 text-xs">� 2026 Nexus Disaster Intelligence. Built for SIH 2026.</div>
          <div className="text-white/20 text-xs tracking-widest uppercase">India � Awareness � Preparedness � Response</div>
        </div>
      </footer>
    </div>
  );
}




