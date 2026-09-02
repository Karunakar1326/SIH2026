import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAppStore } from '@/stores';
import { agencyStatuses } from '@/data/alerts';
import {
  Shield, Radio, RefreshCw, LayoutDashboard, AlertTriangle, History,
  Building2, ArrowRightLeft, MapPin, BarChart3, ClipboardCheck,
  BookOpen, Settings, SlidersHorizontal, LogOut, ChevronRight, PanelLeftClose, PanelLeftOpen, Sparkles
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
      { path: '/workspace/risk', label: 'Risk Intelligence', icon: AlertTriangle },
      { path: '/workspace/communities', label: 'Habitation Intelligence', icon: Building2 },
      { path: '/workspace/historical', label: 'Historical Disaster Intelligence', icon: History },
    ]
  },
  {
    group: 'PLAN',
    items: [
      { path: '/workspace/relocation', label: 'Relocation Priority', icon: ArrowRightLeft },
      { path: '/workspace/safe-sites', label: 'Safe Sites & Capacity', icon: MapPin },
      { path: '/workspace/optimization', label: 'Relocation Optimization', icon: SlidersHorizontal },
      { path: '/workspace/scenarios', label: 'Scenarios & What-If', icon: Sparkles },
    ]
  },
  {
    group: 'OPERATE',
    items: [
      { path: '/workspace/field-verification', label: 'Field Verification', icon: ClipboardCheck }
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
  const sidebarCollapsed = useAppStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useAppStore((s) => s.toggleSidebar);
  const location = useLocation();
  const navigate = useNavigate();
  const districts = ['All Districts', 'Ganjam', 'Puri', 'Jagatsinghpur', 'Kendrapara', 'Balasore'];

  return (
    <aside
      className={`bg-[#1C1C1C] text-[#F5F5F5] border-r border-white/8 flex flex-col shrink-0 h-screen z-30 shadow-2xl overflow-hidden font-sans transition-all duration-300 ease-in-out ${
        sidebarCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="p-3.5 border-b border-white/8 flex flex-col gap-2.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#FF7A3D] to-[#FF3D1F] flex items-center justify-center font-bold text-white shadow-[0_0_16px_rgba(255,90,31,0.4)] shrink-0">
              <Shield size={18} />
            </div>
            {!sidebarCollapsed && (
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-black tracking-tight text-white leading-tight">NEXUS</span>
                  <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded-full bg-[#232323] text-[#9A9A9A] border border-white/10 font-bold shrink-0">
                    AUTHORITY
                  </span>
                </div>
                <span className="text-[10px] text-[#9A9A9A] truncate leading-tight mt-0.5 font-medium">
                  State Disaster Management Authority
                </span>
              </div>
            )}
          </div>

          {/* Minimize / Expand Toggle Button */}
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-xl bg-[#232323] text-[#9A9A9A] hover:text-white hover:bg-white/10 border border-white/10 transition-colors cursor-pointer shrink-0"
            title={sidebarCollapsed ? "Expand Sidebar" : "Minimize Sidebar"}
          >
            {sidebarCollapsed ? <PanelLeftOpen size={16} className="text-[#FF5A1F]" /> : <PanelLeftClose size={16} />}
          </button>
        </div>

        {/* District Selector & Status */}
        {!sidebarCollapsed ? (
          <div className="pt-2 border-t border-white/8 flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <label className="text-[11px] text-[#9A9A9A] font-medium">District:</label>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="text-xs bg-[#232323] border border-white/10 text-white rounded-xl px-2.5 py-1 font-semibold focus:outline-none focus:ring-1 focus:ring-[#FF5A1F] flex-1 max-w-[140px]"
              >
                {districts.map((d) => (
                  <option key={d} value={d} className="bg-[#1C1C1C]">{d}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between bg-[#2ECC71]/10 border border-[#2ECC71]/30 text-[#2ECC71] px-2.5 py-1 rounded-xl text-[10px] font-bold font-mono">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#2ECC71] animate-pulse" />
                <span>ACTIVE SYSTEM</span>
              </div>
              <span className="text-[#9A9A9A] text-[9px]">ODISHA</span>
            </div>
          </div>
        ) : (
          <div className="pt-1 border-t border-white/8 flex justify-center">
            <div
              className="w-8 h-8 rounded-xl bg-[#2ECC71]/10 border border-[#2ECC71]/30 flex items-center justify-center text-[#2ECC71]"
              title={`District: ${selectedDistrict} · ACTIVE SYSTEM ODISHA`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#2ECC71] animate-pulse" />
            </div>
          </div>
        )}
      </div>

      {/* Navigation Links Area */}
      <div className="flex-1 overflow-y-auto py-3 px-2.5 space-y-3.5 scrollbar-thin scrollbar-thumb-white/10">
        {workspaceNav.map((grp) => (
          <div key={grp.group} className="space-y-1">
            {!sidebarCollapsed ? (
              <div className="px-2 text-[10px] font-mono font-bold text-[#6B6B6B] uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>{grp.group}</span>
                <span className="h-px bg-white/5 flex-1 ml-2" />
              </div>
            ) : (
              <div className="h-px bg-white/8 my-2 mx-1" />
            )}

            {grp.items.map(({ path, label, icon: Icon }) => {
              const isActive = location.pathname === path || (path !== '/workspace' && location.pathname.startsWith(path));
              return (
                <NavLink
                  key={path}
                  to={path}
                  end={path === '/workspace'}
                  title={sidebarCollapsed ? label : undefined}
                  className={`group flex items-center ${sidebarCollapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2'} rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#FF5A1F]/15 text-white font-bold border border-[#FF5A1F] shadow-[0_0_12px_rgba(255,90,31,0.2)]'
                      : 'text-[#9A9A9A] hover:text-white hover:bg-[#232323]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon size={16} className={`shrink-0 transition-colors ${isActive ? 'text-[#FF5A1F]' : 'text-[#9A9A9A] group-hover:text-white'}`} />
                    {!sidebarCollapsed && <span className="truncate">{label}</span>}
                  </div>
                  {!sidebarCollapsed && isActive && <ChevronRight size={13} className="text-[#FF5A1F] shrink-0" />}
                </NavLink>
              );
            })}
          </div>
        ))}
      </div>

      {/* Live Authoritative Feeds Footer */}
      <div className="p-3 border-t border-white/8 bg-[#141414] space-y-2 text-[10px] font-mono">
        {!sidebarCollapsed ? (
          <>
            <div className="flex items-center justify-between text-[#9A9A9A] pb-1 border-b border-white/5">
              <div className="flex items-center gap-1.5 text-white uppercase">
                <Radio size={12} className="text-[#2ECC71] animate-pulse" />
                <span className="font-bold">FEEDS STATUS</span>
              </div>
              <div className="flex items-center gap-1 text-[#9A9A9A]">
                <RefreshCw size={9} className="animate-spin text-[#9A9A9A]" />
                <span>Sync 60s</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-1.5 pt-0.5">
              {agencyStatuses.slice(0, 4).map((agency, i) => (
                <div key={i} className="flex items-center justify-between px-2 py-1 rounded-lg bg-[#232323] border border-white/5">
                  <span className="font-bold text-white text-[9.5px]">{agency.agency}</span>
                  <span className={`w-1.5 h-1.5 rounded-full ${agency.status === 'fresh' ? 'bg-[#2ECC71]' : 'bg-[#FFB020]'}`} />
                </div>
              ))}
            </div>

            {/* Exit Public Explore Button */}
            <button
              onClick={() => navigate('/')}
              className="w-full mt-2 flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-white/10 hover:border-white/20 bg-[#232323] hover:bg-white/10 text-white transition-all text-xs font-bold cursor-pointer"
              title="Return to Public Explore Landing"
            >
              <LogOut size={13} className="text-[#FF5A1F]" />
              <span>Public Explore</span>
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 py-1">
            <div className="flex flex-col items-center gap-1" title="Live Feeds Active (Sync 60s)">
              <Radio size={14} className="text-[#2ECC71] animate-pulse" />
            </div>
            <button
              onClick={() => navigate('/')}
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-white/10 bg-[#232323] hover:bg-white/10 text-white transition-all cursor-pointer"
              title="Return to Public Explore Landing"
            >
              <LogOut size={14} className="text-[#FF5A1F]" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
