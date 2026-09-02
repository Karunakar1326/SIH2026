import { Link, useNavigate } from 'react-router-dom';
import { Shield, ArrowRight, Lock } from 'lucide-react';

export function PublicHeader() {
  const navigate = useNavigate();

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="bg-neutral-950 text-white border-b border-neutral-800 h-14 px-6 flex items-center justify-between sticky top-0 z-40 shadow-md">
      {/* Logo & Platform Name */}
      <Link to="/" className="flex items-center gap-2.5 group">
        <div className="w-8 h-8 rounded bg-accent flex items-center justify-center font-bold text-white shadow-xs group-hover:bg-accent-dark transition-colors">
          <Shield size={18} />
        </div>
        <div>
          <div className="text-base font-extrabold tracking-wider text-white">NEXUS</div>
          <div className="text-[9.5px] text-neutral-400 leading-none">Disaster Relocation Intelligence Platform</div>
        </div>
      </Link>

      {/* Navigation Links */}
      <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-neutral-300">
        <button onClick={() => scrollToSection('explore-risks')} className="hover:text-white transition-colors cursor-pointer">
          Explore Disaster Risks
        </button>
        <button onClick={() => scrollToSection('how-it-works')} className="hover:text-white transition-colors cursor-pointer">
          How It Works
        </button>
        <button onClick={() => scrollToSection('decision-journey')} className="hover:text-white transition-colors cursor-pointer">
          Decision Journey
        </button>
        <button onClick={() => scrollToSection('for-authorities')} className="hover:text-white transition-colors cursor-pointer">
          For Authorities
        </button>
      </nav>

      {/* Right Authority Access CTA */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/workspace')}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-accent text-white text-xs font-bold hover:bg-accent-dark transition-all shadow-2xs hover:shadow-accent/20 cursor-pointer"
        >
          <Lock size={13} />
          <span>Authority Access</span>
          <ArrowRight size={13} />
        </button>
      </div>
    </header>
  );
}
