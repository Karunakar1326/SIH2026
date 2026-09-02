import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAppStore } from '@/stores';
import { agencyStatuses } from '@/data/alerts';
import {
  Shield, Radio, RefreshCw, LayoutDashboard, AlertTriangle, History,
  Building2, ArrowRightLeft, MapPin, BarChart3, ClipboardCheck,
  BookOpen, Settings, SlidersHorizontal, LogOut
} from 'lucide-react';

const workspaceNav = [
  { group: 'MONITOR', items: [{ path: '/workspace', label: 'Situation Overview', icon: LayoutDashboard }] },
  { group: 'ASSESS', items: [
    { path: '/workspace/risk', label: 'Risk & Red-Zones', icon: AlertTriangle },
    { path: '/workspace/historical', label: 'Disaster History', icon: History },
    { path: '/workspace/communities', label: 'Communities', icon: Building2 },
  ]},
  { group: 'PLAN', items: [
    { path: '/workspace/relocation', label: 'Relocation Priority', icon: ArrowRightLeft },
    { path: '/workspace/safe-sites', label: 'Safe Sites & Capacity', icon: MapPin },
    { path: '/workspace/optimization', label: 'Optimization Engine', icon: SlidersHorizontal },
  ]},
  { group: 'OPERATE', items: [{ path: '/workspace/field-verification', label: 'Field Operations', icon: ClipboardCheck }] },
  { group: 'REVIEW', items: [
    { path: '/workspace/reports', label: 'Reports & Action Plans', icon: BarChart3 },
    { path: '/workspace/data-methodology', label: 'Data & Methodology', icon: BookOpen },
  ]},
  { group: 'SYSTEM', items: [{ path: '/workspace/settings', label: 'Administration', icon: Settings }] },
];

export function WorkspaceHeader() {
  const selectedDistrict = useAppStore((s) => s.selectedDistrict);
  const setSelectedDistrict = useAppStore((s) => s.setSelectedDistrict);
  const location = useLocation();
  const navigate = useNavigate();
  const districts = ['All Districts', 'Ganjam', 'Puri', 'Jagatsinghpur', 'Kendrapara', 'Balasore'];

  return (
    <header className="bg-neutral-950 text-white border-b border-neutral-800 flex flex-col shrink-0 z-30 shadow-md">
      {/* Tier 1: Command Header */}
      <div className="h-12 px-5 flex items-center justify-between border-b border-neutral-850">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded bg-accent flex items-center justify-center font-bold text-white shadow-xs">
            <Shield size={16} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold tracking-wider text-white">NEXUS</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-300 border border-neutral-700">
                AUTHORITY WORKSPACE
              </span>
            </div>
            <div className="text-[10px] text-neutral-400 leading-none">
              State Disaster Management Authority · Decision-Support System
            </div>
          </div>

          <div className="h-5 w-px bg-neutral-800 mx-2 hidden md:block" />

          {/* District Selector */}
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
            <span className="text-xs text-neutral-500 font-mono hidden lg:inline">ODISHA</span>
          </div>
        </div>

        {/* Operational Status & Exit Public CTA */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 bg-emerald-950/70 border border-emerald-800/70 text-emerald-400 px-2.5 py-1 rounded text-[11px] font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-dot" />
            <span>AUTHORITY WORKSPACE ACTIVE</span>
          </div>

          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1 text-[11px] font-semibold text-neutral-400 hover:text-white px-2 py-1 rounded border border-neutral-800 hover:bg-neutral-850 transition-colors"
            title="Return to Public Explore Landing"
          >
            <LogOut size={12} />
            <span>Public Explore</span>
          </button>
        </div>
      </div>

      {/* Tier 2: Grouped Navigation Bar (MONITOR | ASSESS | PLAN | OPERATE | REVIEW | SYSTEM) */}
      <div className="bg-neutral-900 border-b border-neutral-850 px-4 overflow-x-auto flex items-center gap-6 shrink-0 scrollbar-none py-1 text-xs">
        {workspaceNav.map((grp) => (
          <div key={grp.group} className="flex items-center gap-1 border-r border-neutral-800/80 pr-4 last:border-0">
            <span className="text-[9.5px] font-mono font-bold text-neutral-500 uppercase tracking-widest mr-1.5">
              {grp.group}
            </span>
            {grp.items.map(({ path, label, icon: Icon }) => {
              const isActive = location.pathname === path || (path !== '/workspace' && location.pathname.startsWith(path));
              return (
                <NavLink
                  key={path}
                  to={path}
                  end={path === '/workspace'}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-accent/20 text-white font-bold border border-accent/40 shadow-2xs'
                      : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
                  }`}
                >
                  <Icon size={13} className={isActive ? 'text-accent' : 'text-neutral-400'} />
                  <span>{label}</span>
                </NavLink>
              );
            })}
          </div>
        ))}
      </div>

      {/* Tier 3: Authoritative Feeds Ticker */}
      <div className="h-6 px-5 bg-neutral-950 flex items-center justify-between text-[10px] text-neutral-400 overflow-x-auto gap-4 font-mono border-t border-neutral-900">
        <div className="flex items-center gap-1.5 shrink-0 text-neutral-300 uppercase">
          <Radio size={11} className="text-emerald-400 animate-pulse" />
          <span>AUTHORITATIVE FEEDS:</span>
        </div>

        <div className="flex items-center gap-4 overflow-x-auto shrink-0">
          {agencyStatuses.slice(0, 6).map((agency, i) => (
            <div key={i} className="flex items-center gap-1.5 shrink-0">
              <span className="font-bold text-neutral-200">{agency.agency}</span>
              <span className="text-neutral-500">({agency.lastUpdated.split('T')[1]?.slice(0, 5) || '11:00'})</span>
              <span className={`w-1.5 h-1.5 rounded-full ${agency.status === 'fresh' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
            </div>
          ))}
        </div>

        <div className="flex items-center gap-1 shrink-0 ml-auto text-neutral-500">
          <RefreshCw size={9} className="animate-spin text-neutral-600" />
          <span>Sync 60s</span>
        </div>
      </div>
    </header>
  );
}
