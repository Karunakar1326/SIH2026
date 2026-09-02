import { NavLink, useLocation } from 'react-router-dom';
import { useAppStore } from '@/stores';
import { agencyStatuses } from '@/data/alerts';
import {
  Shield, Radio, RefreshCw, LayoutDashboard, AlertTriangle, History,
  Building2, ArrowRightLeft, MapPin, BarChart3, ClipboardCheck,
  BookOpen, Settings, SlidersHorizontal, Sparkles
} from 'lucide-react';

const navItems = [
  { path: '/', label: 'Situation Overview', icon: LayoutDashboard },
  { path: '/risk', label: 'Risk Intelligence', icon: AlertTriangle },
  { path: '/habitations', label: 'Habitation Intelligence', icon: Building2 },
  { path: '/historical', label: 'Historical Disaster Intelligence', icon: History },
  { path: '/relocation', label: 'Relocation Priority', icon: ArrowRightLeft },
  { path: '/safe-sites', label: 'Safe Sites & Capacity', icon: MapPin },
  { path: '/optimization', label: 'Relocation Optimization', icon: SlidersHorizontal },
  { path: '/scenarios', label: 'Scenarios & What-If', icon: Sparkles },
  { path: '/field-verification', label: 'Field Verification', icon: ClipboardCheck },
  { path: '/reports', label: 'Reports & Action Plans', icon: BarChart3 },
  { path: '/data-methodology', label: 'Data & Methodology', icon: BookOpen },
  { path: '/settings', label: 'Administration', icon: Settings },
];

export function AuthoritativeHeader() {
  const selectedDistrict = useAppStore((s) => s.selectedDistrict);
  const setSelectedDistrict = useAppStore((s) => s.setSelectedDistrict);
  const location = useLocation();
  const districts = ['All Districts', 'Ganjam', 'Puri', 'Jagatsinghpur', 'Kendrapara', 'Balasore'];

  return (
    <header className="bg-[#1C1C1C] text-[#F5F5F5] border-b border-white/8 flex flex-col shrink-0 z-30 shadow-lg">
      {/* Row 1: Command Header & Title */}
      <div className="h-12 px-5 flex items-center justify-between border-b border-white/8">
        {/* Branding */}
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-[#FF7A3D] to-[#FF3D1F] flex items-center justify-center font-bold text-white shadow-[0_0_16px_rgba(255,90,31,0.4)]">
            <Shield size={16} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-black tracking-tight text-white">NEXUS</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-[#232323] text-[#9A9A9A] border border-white/10 font-bold">
                SDMA / DDMA COMMAND
              </span>
            </div>
            <div className="text-[10px] text-[#9A9A9A] leading-none font-medium">
              State Disaster Management Authority · Relocation Decision Platform
            </div>
          </div>

          <div className="h-5 w-px bg-white/10 mx-2 hidden md:block" />

          {/* Region Selector */}
          <div className="flex items-center gap-2">
            <label className="text-xs text-[#9A9A9A] font-semibold hidden sm:inline">District:</label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="text-xs bg-[#232323] border border-white/10 text-white rounded-xl px-3 py-1 font-semibold focus:outline-none focus:ring-1 focus:ring-[#FF5A1F] cursor-pointer"
            >
              {districts.map((d) => (
                <option key={d} value={d} className="bg-[#1C1C1C] text-white">{d}</option>
              ))}
            </select>
            <span className="text-xs text-[#6B6B6B] font-mono hidden lg:inline font-bold">STATE: ODISHA</span>
          </div>
        </div>

        {/* System Status & Duty Officer */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 bg-[#2ECC71]/10 border border-[#2ECC71]/30 text-[#2ECC71] px-3 py-1 rounded-full text-[11px] font-bold">
            <span className="w-2 h-2 rounded-full bg-[#2ECC71] animate-pulse" />
            <span>SYSTEM OPERATIONAL</span>
          </div>

          <span className="text-[10px] font-mono bg-[#FFB020]/10 text-[#FFB020] border border-[#FFB020]/30 px-2.5 py-0.5 rounded-full font-bold hidden sm:inline">
            DEMO DATA MODE
          </span>

          <div className="flex items-center gap-2 pl-2 border-l border-white/10">
            <div className="w-7 h-7 rounded-full bg-[#232323] border border-white/10 flex items-center justify-center text-[10px] font-bold text-white shadow-xs">
              DDMA
            </div>
            <div className="hidden xl:block text-left text-[11px] leading-tight">
              <div className="text-white font-bold">Duty Officer</div>
              <div className="text-[#9A9A9A] text-[9px]">Emergency Ops</div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Horizontal Navigation Bar */}
      <div className="bg-[#141414] border-b border-white/8 px-4 py-1 overflow-x-auto flex items-center gap-1 shrink-0 scrollbar-none">
        {navItems.map(({ path, label, icon: Icon }) => {
          const isActive = location.pathname === path || (path !== '/' && location.pathname.startsWith(path));
          return (
            <NavLink
              key={path}
              to={path}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-all rounded-xl border-b-2 ${
                isActive
                  ? 'border-[#FF5A1F] text-white bg-[#FF5A1F]/14 font-bold shadow-[0_0_12px_rgba(255,90,31,0.2)]'
                  : 'border-transparent text-[#9A9A9A] hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={14} className={isActive ? 'text-[#FF5A1F]' : 'text-[#9A9A9A]'} />
              <span>{label}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Row 3: Authoritative Data Freshness Bar */}
      <div className="h-7 px-5 bg-[#141414] border-t border-white/5 flex items-center justify-between text-[10.5px] text-[#9A9A9A] overflow-x-auto gap-4">
        <div className="flex items-center gap-1.5 shrink-0 text-[#F5F5F5] font-mono text-[10px] uppercase font-bold tracking-wider">
          <Radio size={12} className="text-[#2ECC71] animate-pulse" />
          <span>AUTHORITATIVE FEEDS:</span>
        </div>

        <div className="flex items-center gap-4 overflow-x-auto shrink-0 font-mono">
          {agencyStatuses.slice(0, 6).map((agency, i) => (
            <div key={i} className="flex items-center gap-1.5 shrink-0">
              <span className="font-bold text-[#F5F5F5]">{agency.agency}</span>
              <span className="text-[#6B6B6B] text-[10px]">({agency.lastUpdated.split('T')[1]?.slice(0, 5) || '11:00'})</span>
              <span className={`w-1.5 h-1.5 rounded-full ${agency.status === 'fresh' ? 'bg-[#2ECC71]' : 'bg-[#FFB020]'}`} />
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 shrink-0 ml-auto text-[10px] text-[#6B6B6B]">
          <RefreshCw size={10} className="animate-spin text-[#9A9A9A]" />
          <span>Sync 60s</span>
        </div>
      </div>
    </header>
  );
}
