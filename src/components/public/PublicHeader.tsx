import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowRight } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Awareness', id: 'awareness' },
  { label: 'The Need', id: 'the-need' },
  { label: 'Consequences', id: 'consequences' },
];

export function PublicHeader() {
  const navigate = useNavigate();

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xl border-b border-white/8" />
      <div className="relative h-full max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 text-white no-underline">
          <div className="w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center shadow-[0_0_16px_rgba(249,115,22,0.5)]">
            <ShieldAlert size={16} color="white" />
          </div>
          <div className="leading-none">
            <div className="text-white font-extrabold text-base tracking-tight">NEXUS</div>
            <div className="text-white/50 text-[9px] tracking-widest uppercase font-medium">Disaster Intelligence</div>
          </div>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((l) => (
            <button
              key={l.id}
              onClick={() => scrollTo(l.id)}
              className="text-white/60 hover:text-white text-sm font-medium transition-colors cursor-pointer tracking-wide"
            >
              {l.label}
            </button>
          ))}
        </nav>

        {/* CTA */}
        <button
          onClick={() => navigate('/workspace')}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-all cursor-pointer shadow-[0_0_20px_rgba(249,115,22,0.35)]"
        >
          Enter Platform
          <ArrowRight size={15} />
        </button>
      </div>
    </header>
  );
}
