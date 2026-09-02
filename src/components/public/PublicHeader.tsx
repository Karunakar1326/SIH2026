import { Link, useNavigate } from 'react-router-dom';
import { Shield, ArrowRight, Lock } from 'lucide-react';

export function PublicHeader() {
  const navigate = useNavigate();

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="bg-[#080808]/90 backdrop-blur-md text-white border-b border-white/10 h-16 px-6 md:px-12 flex items-center justify-between sticky top-0 z-50 font-sans">
      {/* Logo & Platform Name */}
      <Link to="/" className="flex items-center gap-3 text-white no-underline group">
        <div className="relative w-8 h-8 bg-orange-500 flex items-center justify-center font-bold text-black shrink-0">
          <Shield size={16} color="#0a0a0a" />
          <span className="absolute -top-0.5 -left-0.5 w-2 h-2 border-t-2 border-l-2 border-cyan-400" />
          <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 border-b-2 border-r-2 border-cyan-400" />
        </div>
        <div>
          <div className="font-orbitron text-sm font-extrabold tracking-widest text-white">NEXUS</div>
          <div className="font-mono text-[8.5px] text-white/50 tracking-wider uppercase leading-none mt-0.5">DISASTER AWARENESS</div>
        </div>
      </Link>

      {/* Navigation Links */}
      <nav className="hidden md:flex items-center gap-8 font-mono text-xs tracking-wider text-slate-300">
        <button onClick={() => scrollToSection('awareness')} className="hover:text-orange-400 transition-colors cursor-pointer uppercase">
          // AWARENESS
        </button>
        <button onClick={() => scrollToSection('the-need')} className="hover:text-orange-400 transition-colors cursor-pointer uppercase">
          // THE NEED
        </button>
        <button onClick={() => scrollToSection('our-approach')} className="hover:text-orange-400 transition-colors cursor-pointer uppercase">
          // OUR APPROACH
        </button>
        <button onClick={() => scrollToSection('consequences')} className="hover:text-orange-400 transition-colors cursor-pointer uppercase">
          // CONSEQUENCES
        </button>
      </nav>

      {/* Right Authority Access CTA */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/workspace')}
          className="hud-cta-orange flex items-center gap-2 px-4 py-2 rounded-sm bg-orange-500/15 border border-orange-500/60 hover:bg-orange-500/25 text-orange-400 font-mono text-xs uppercase tracking-wider transition-all cursor-pointer"
        >
          <Lock size={13} />
          <span>ENTER PLATFORM</span>
          <ArrowRight size={13} />
        </button>
      </div>
    </header>
  );
}
