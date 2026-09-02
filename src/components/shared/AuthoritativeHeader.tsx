import { NavLink, useLocation } from 'react-router-dom';
import { useAppStore } from '@/stores';
import { agencyStatuses } from '@/data/alerts';
import {
  Shield, Radio, RefreshCw, LayoutDashboard, AlertTriangle, History,
  Building2, ArrowRightLeft, MapPin, BarChart3, ClipboardCheck,
  BookOpen, Settings, SlidersHorizontal
} from 'lucide-react';

const navItems = [
  { path: '/', label: 'Command Center', icon: LayoutDashboard },
  { path: '/risk', label: 'Risk & Red-Zones', icon: AlertTriangle },
  { path: '/historical', label: 'Historical Intelligence', icon: History },
  { path: '/habitations', label: 'Habitations', icon: Building2 },
  { path: '/relocation', label: 'Relocation Intelligence', icon: ArrowRightLeft },
  { path: '/safe-sites', label: 'Safe Sites & Capacity', icon: MapPin },
  { path: '/optimization', label: 'Optimization', icon: SlidersHorizontal },
  { path: '/analytics', label: 'Analytics & Reports', icon: BarChart3 },
  { path: '/field-verification', label: 'Field Verification', icon: ClipboardCheck },
  { path: '/data-methodology', label: 'Data & Methodology', icon: BookOpen },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export function AuthoritativeHeader() {
  const selectedDistrict = useAppStore((s) => s.selectedDistrict);
  const setSelectedDistrict = useAppStore((s) => s.setSelectedDistrict);
  const location = useLocation();
  const districts = ['All Districts', 'Ganjam', 'Puri', 'Jagatsinghpur', 'Kendrapara', 'Balasore'];

  return (
    <header className="bg-neutral-950 text-white border-b border-neutral-800 flex flex-col shrink-0 z-30 shadow-md">
      {/* Row 1: Command Header & Title */}
      <div className="h-12 px-5 flex items-center justify-between border-b border-neutral-850">
        {/* Branding */}
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded bg-accent flex items-center justify-center font-bold text-white shadow-xs">
            <Shield size={16} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold tracking-wider text-white">NEXUS</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-300 border border-neutral-700">
                SDMA / DDMA COMMAND
              </span>
            </div>
            <div className="text-[10px] text-neutral-400 leading-none">
              State Disaster Management Authority · Relocation Decision Platform
            </div>
          </div>

          <div className="h-5 w-px bg-neutral-800 mx-2 hidden md:block" />

          {/* Region Selector */}
          <div className="flex items-center gap-2">
            <label className="text-xs text-neutral-400 font-medium hidden sm:inline">District:</label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="text-xs bg-neutral-900 border border-neutral-750 text-neutral-200 rounded px-2.5 py-1 font-semibold focus:outline-none focus:ring-1 focus:ring-accent"
            >
              {districts.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <span className="text-xs text-neutral-500 font-mono hidden lg:inline">STATE: ODISHA</span>
          </div>
        </div>

        {/* System Status & Duty Officer */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 bg-emerald-950/70 border border-emerald-800/70 text-emerald-400 px-2.5 py-1 rounded text-[11px] font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-dot" />
            <span>SYSTEM OPERATIONAL</span>
          </div>

          <span className="text-[10px] font-mono bg-amber-950/80 text-amber-300 border border-amber-800/80 px-2 py-0.5 rounded font-bold hidden sm:inline">
            DEMO DATA MODE
          </span>

          <div className="flex items-center gap-2 pl-2 border-l border-neutral-800">
            <div className="w-7 h-7 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-[10px] font-bold text-neutral-200">
              DDMA
            </div>
            <div className="hidden xl:block text-left text-[11px] leading-tight">
              <div className="text-neutral-200 font-semibold">Duty Officer</div>
              <div className="text-neutral-500 text-[9px]">Emergency Ops</div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Horizontal Navigation Bar */}
      <div className="bg-neutral-900 border-b border-neutral-850 px-3 overflow-x-auto flex items-center gap-1 shrink-0 scrollbar-none">
        {navItems.map(({ path, label, icon: Icon }) => {
          const isActive = location.pathname === path || (path !== '/' && location.pathname.startsWith(path));
          return (
            <NavLink
              key={path}
              to={path}
              className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold whitespace-nowrap transition-all border-b-2 ${
                isActive
                  ? 'border-accent text-white bg-neutral-850/80 font-bold'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200 hover:bg-neutral-850/40'
              }`}
            >
              <Icon size={14} className={isActive ? 'text-accent' : 'text-neutral-400'} />
              <span>{label}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Row 3: Authoritative Data Freshness Bar */}
      <div className="h-7 px-5 bg-neutral-950 flex items-center justify-between text-[10.5px] text-neutral-400 overflow-x-auto gap-4">
        <div className="flex items-center gap-1.5 shrink-0 text-neutral-300 font-mono text-[10px] uppercase">
          <Radio size={12} className="text-emerald-400 animate-pulse" />
          <span>AUTHORITATIVE FEEDS:</span>
        </div>

        <div className="flex items-center gap-4 overflow-x-auto shrink-0 font-mono">
          {agencyStatuses.slice(0, 6).map((agency, i) => (
            <div key={i} className="flex items-center gap-1.5 shrink-0">
              <span className="font-bold text-neutral-200">{agency.agency}</span>
              <span className="text-neutral-500 text-[10px]">({agency.lastUpdated.split('T')[1]?.slice(0, 5) || '11:00'})</span>
              <span className={`w-1.5 h-1.5 rounded-full ${agency.status === 'fresh' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 shrink-0 ml-auto text-[10px] text-neutral-500">
          <RefreshCw size={10} className="animate-spin text-neutral-600" />
          <span>Sync 60s</span>
        </div>
      </div>
    </header>
  );
}
