import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAppStore } from '@/stores';
import { agencyStatuses } from '@/data/alerts';
import {
  Shield, Radio, RefreshCw, LayoutDashboard, AlertTriangle, History,
  Building2, ArrowRightLeft, MapPin, BarChart3, ClipboardCheck,
  BookOpen, Settings, SlidersHorizontal, LogOut, ChevronRight
} from 'lucide-react';

const workspaceNav = [
  {
    group: 'MONITOR',
    items: [
      { path: '/workspace', label: 'Situation Overview', icon: LayoutDashboard }
    ]
  },
  {
    group: 'ASSESS',
    items: [
      { path: '/workspace/risk', label: 'Risk & Red-Zones', icon: AlertTriangle },
      { path: '/workspace/historical', label: 'Disaster History', icon: History },
      { path: '/workspace/communities', label: 'Communities', icon: Building2 },
    ]
  },
  {
    group: 'PLAN',
    items: [
      { path: '/workspace/relocation', label: 'Relocation Priority', icon: ArrowRightLeft },
      { path: '/workspace/safe-sites', label: 'Safe Sites & Capacity', icon: MapPin },
      { path: '/workspace/optimization', label: 'Optimization Engine', icon: SlidersHorizontal },
    ]
  },
  {
    group: 'OPERATE',
    items: [
      { path: '/workspace/field-verification', label: 'Field Operations', icon: ClipboardCheck }
    ]
  },
  {
    group: 'REVIEW',
    items: [
      { path: '/workspace/reports', label: 'Reports & Action Plans', icon: BarChart3 },
      { path: '/workspace/data-methodology', label: 'Data & Methodology', icon: BookOpen },
    ]
  },
  {
    group: 'SYSTEM',
    items: [
      { path: '/workspace/settings', label: 'Administration', icon: Settings }
    ]
  },
];

export function WorkspaceSidebar() {
  const selectedDistrict = useAppStore((s) => s.selectedDistrict);
  const setSelectedDistrict = useAppStore((s) => s.setSelectedDistrict);
  const location = useLocation();
  const navigate = useNavigate();
  const districts = ['All Districts', 'Ganjam', 'Puri', 'Jagatsinghpur', 'Kendrapara', 'Balasore'];

  return (
    <aside className="w-64 bg-neutral-950 text-white border-r border-neutral-800/80 flex flex-col shrink-0 h-screen z-30 shadow-2xl overflow-hidden font-sans">
      {/* Brand Header */}
      <div className="p-4 border-b border-neutral-850 flex flex-col gap-2.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-md bg-blue-600 flex items-center justify-center font-bold text-white shadow-sm shrink-0">
            <Shield size={18} />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold tracking-wider text-white leading-tight">NEXUS</span>
              <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-blue-950/80 text-blue-400 border border-blue-800/60 font-semibold shrink-0">
                AUTHORITY
              </span>
            </div>
            <span className="text-[10px] text-neutral-400 truncate leading-tight mt-0.5">
              State Disaster Management Authority
            </span>
          </div>
        </div>

        {/* District Selector & Status */}
        <div className="pt-2 border-t border-neutral-900/90 flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <label className="text-[11px] text-neutral-400 font-medium">District:</label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="text-xs bg-neutral-900 border border-neutral-750 text-neutral-200 rounded px-2 py-1 font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 flex-1 max-w-[140px]"
            >
              {districts.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between bg-emerald-950/40 border border-emerald-800/50 text-emerald-400 px-2.5 py-1 rounded text-[10px] font-semibold font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>ACTIVE SYSTEM</span>
            </div>
            <span className="text-neutral-500 text-[9px]">ODISHA</span>
          </div>
        </div>
      </div>

      {/* Navigation Links Area */}
      <div className="flex-1 overflow-y-auto py-3 px-3 space-y-4 scrollbar-thin scrollbar-thumb-neutral-800">
        {workspaceNav.map((grp) => (
          <div key={grp.group} className="space-y-1">
            <div className="px-2 text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>{grp.group}</span>
              <span className="h-px bg-neutral-850 flex-1 ml-2" />
            </div>

            {grp.items.map(({ path, label, icon: Icon }) => {
              const isActive = location.pathname === path || (path !== '/workspace' && location.pathname.startsWith(path));
              return (
                <NavLink
                  key={path}
                  to={path}
                  end={path === '/workspace'}
                  className={`group flex items-center justify-between px-3 py-2 rounded-md text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-600/15 text-white font-bold border border-blue-500/40 shadow-xs'
                      : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/80'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon size={15} className={`shrink-0 transition-colors ${isActive ? 'text-blue-400' : 'text-neutral-400 group-hover:text-neutral-300'}`} />
                    <span className="truncate">{label}</span>
                  </div>
                  {isActive && <ChevronRight size={13} className="text-blue-400 shrink-0" />}
                </NavLink>
              );
            })}
          </div>
        ))}
      </div>

      {/* Live Authoritative Feeds Footer */}
      <div className="p-3 border-t border-neutral-850 bg-neutral-950/90 space-y-2 text-[10px] font-mono">
        <div className="flex items-center justify-between text-neutral-400 pb-1 border-b border-neutral-900">
          <div className="flex items-center gap-1.5 text-neutral-300 uppercase">
            <Radio size={12} className="text-emerald-400 animate-pulse" />
            <span className="font-bold">FEEDS STATUS</span>
          </div>
          <div className="flex items-center gap-1 text-neutral-500">
            <RefreshCw size={9} className="animate-spin text-neutral-600" />
            <span>Sync 60s</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-1.5 pt-0.5">
          {agencyStatuses.slice(0, 4).map((agency, i) => (
            <div key={i} className="flex items-center justify-between px-1.5 py-1 rounded bg-neutral-900/60 border border-neutral-850">
              <span className="font-bold text-neutral-300 text-[9.5px]">{agency.agency}</span>
              <span className={`w-1.5 h-1.5 rounded-full ${agency.status === 'fresh' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
            </div>
          ))}
        </div>

        {/* Exit Public Explore Button */}
        <button
          onClick={() => navigate('/')}
          className="w-full mt-2 flex items-center justify-center gap-2 py-1.5 px-3 rounded border border-neutral-800 hover:border-neutral-700 bg-neutral-900 hover:bg-neutral-850 text-neutral-300 hover:text-white transition-all text-xs font-semibold"
          title="Return to Public Explore Landing"
        >
          <LogOut size={13} className="text-neutral-400" />
          <span>Public Explore</span>
        </button>
      </div>
    </aside>
  );
}
