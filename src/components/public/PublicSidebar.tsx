import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, ChevronRight, Lock } from 'lucide-react';

const NAV = [
  { label: 'AWARENESS',     id: 'awareness'   },
  { label: 'THE NEED',      id: 'the-need'    },
  { label: 'OUR APPROACH',  id: 'our-approach'},
  { label: 'CONSEQUENCES',  id: 'consequences'},
];

export function PublicSidebar() {
  const navigate = useNavigate();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <aside
      className="hud-sidebar"
      style={{
        width: '220px',
        minHeight: '100vh',
        position: 'sticky',
        top: 0,
        height: '100dvh',
        background: '#060606',
        borderRight: '1px solid rgba(255,255,255,0.07)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        zIndex: 40,
        overflowY: 'auto',
      }}
    >
      {/* ── Logo ── */}
      <div style={{ padding: '20px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ position: 'relative', width: 32, height: 32, background: '#ff7a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Shield size={16} color="#0a0a0a" />
            <span style={{ position: 'absolute', top: -2, left: -2, width: 7, height: 7, borderTop: '1.5px solid #4fd1ff', borderLeft: '1.5px solid #4fd1ff' }} />
            <span style={{ position: 'absolute', bottom: -2, right: -2, width: 7, height: 7, borderBottom: '1.5px solid #4fd1ff', borderRight: '1.5px solid #4fd1ff' }} />
          </div>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 14, fontWeight: 800, color: '#ffffff', letterSpacing: '0.18em' }}>NEXUS</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 8, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 1 }}>DISASTER AWARENESS</div>
          </div>
        </Link>
      </div>

      {/* ── System Status ── */}
      <div style={{ padding: '12px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span className="hud-blink" style={{ background: '#22c55e' }} />
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 8, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          INTELLIGENCE ACTIVE
        </span>
      </div>

      {/* ── Navigation ── */}
      <nav style={{ flex: 1, paddingTop: 16 }}>
        {NAV.map((item) => (
          <button key={item.id} onClick={() => scrollTo(item.id)} className="hud-nav-btn">
            <span style={{ color: '#ff7a1a', fontWeight: 700, flexShrink: 0 }}>//</span>
            {item.label}
            <ChevronRight size={10} style={{ marginLeft: 'auto', opacity: 0.3 }} />
          </button>
        ))}
      </nav>

      {/* ── Platform Access Button ── */}
      <div style={{ padding: '16px 18px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <button
          onClick={() => navigate('/workspace')}
          style={{
            width: '100%',
            background: 'rgba(255,122,26,0.1)',
            border: '1px solid rgba(255,122,26,0.4)',
            padding: '10px 12px',
            cursor: 'pointer',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 9,
            color: '#ff7a1a',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,122,26,0.2)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,122,26,0.1)'; }}
        >
          <Lock size={12} />
          ENTER PLATFORM
        </button>
      </div>

      {/* ── Clock ── */}
      <div style={{ padding: '12px 18px', borderTop: '1px solid rgba(255,255,255,0.06)', fontFamily: 'JetBrains Mono, monospace' }}>
        <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>{dateStr}</div>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.06em' }}>{timeStr}</div>
      </div>
    </aside>
  );
}
