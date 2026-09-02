import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAppStore } from '@/stores';
import { agencyStatuses } from '@/data/alerts';
import {
  Shield, Radio, RefreshCw, LayoutDashboard, AlertTriangle, History,
  Building2, ArrowRightLeft, MapPin, BarChart3, ClipboardCheck,
  BookOpen, Settings, SlidersHorizontal, LogOut, Sparkles
} from 'lucide-react';

const workspaceNav = [
  { group: 'MONITOR', items: [{ path: '/workspace', label: 'Situation Overview', icon: LayoutDashboard }] },
  { group: 'ASSESS', items: [
    { path: '/workspace/risk', label: 'Risk Intelligence', icon: AlertTriangle },
    { path: '/workspace/communities', label: 'Habitation Intelligence', icon: Building2 },
    { path: '/workspace/historical', label: 'Historical Disaster Intelligence', icon: History },
  ]},
  { group: 'PLAN', items: [
    { path: '/workspace/relocation', label: 'Relocation Priority', icon: ArrowRightLeft },
    { path: '/workspace/safe-sites', label: 'Safe Sites & Capacity', icon: MapPin },
    { path: '/workspace/optimization', label: 'Relocation Optimization', icon: SlidersHorizontal },
    { path: '/workspace/scenarios', label: 'Scenarios & What-If', icon: Sparkles },
  ]},
  { group: 'OPERATE', items: [{ path: '/workspace/field-verification', label: 'Field Verification', icon: ClipboardCheck }] },
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
    <header className="bg-[#1C1C1C] text-[#F5F5F5] border-b border-white/8 flex flex-col shrink-0 z-30 shadow-lg">
      {/* Tier 1: Command Header */}
      <div className="h-12 px-5 flex items-center justify-between border-b border-white/8">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-[#FF7A3D] to-[#FF3D1F] flex items-center justify-center font-bold text-white shadow-[0_0_16px_rgba(255,90,31,0.4)]">
            <Shield size={16} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-black tracking-tight text-white">NEXUS</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-[#232323] text-[#9A9A9A] border border-white/10 font-bold">
                AUTHORITY WORKSPACE
              </span>
            </div>
            <div className="text-[10px] text-[#9A9A9A] leading-none font-medium">
              State Disaster Management Authority · Decision-Support System
            </div>
          </div>

          <div className="h-5 w-px bg-white/10 mx-2 hidden md:block" />

          {/* District Selector */}
          <div className="flex items-center gap-2">
            <label className="text-xs text-[#9A9A9A] font-medium hidden sm:inline">District:</label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="text-xs bg-[#232323] border border-white/10 text-white rounded-xl px-2.5 py-1 font-semibold focus:outline-none focus:ring-1 focus:ring-[#FF5A1F]"
            >
              {districts.map((d) => (
                <option key={d} value={d} className="bg-[#1C1C1C]">{d}</option>
              ))}
            </select>
            <span className="text-xs text-[#9A9A9A] font-mono hidden lg:inline">ODISHA</span>
          </div>
        </div>

        {/* Operational Status & Exit Public CTA */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 bg-[#2ECC71]/10 border border-[#2ECC71]/30 text-[#2ECC71] px-3 py-1 rounded-xl text-[11px] font-bold">
            <span className="w-2 h-2 rounded-full bg-[#2ECC71] animate-pulse" />
            <span>AUTHORITY WORKSPACE ACTIVE</span>
          </div>

          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 text-xs font-bold text-white px-3 py-1.5 rounded-xl border border-white/10 bg-[#232323] hover:bg-white/10 transition-colors cursor-pointer"
            title="Return to Public Explore Landing"
          >
            <LogOut size={13} className="text-[#FF5A1F]" />
            <span>Public Explore</span>
          </button>
        </div>
      </div>

      {/* Tier 2: Grouped Navigation Bar */}
      <div className="bg-[#141414] border-b border-white/8 px-4 overflow-x-auto flex items-center gap-6 shrink-0 scrollbar-none py-1.5 text-xs">
        {workspaceNav.map((grp) => (
          <div key={grp.group} className="flex items-center gap-1 border-r border-white/8 pr-4 last:border-0">
            <span className="text-[9.5px] font-mono font-bold text-[#6B6B6B] uppercase tracking-widest mr-1.5">
              {grp.group}
            </span>
            {grp.items.map(({ path, label, icon: Icon }) => {
              const isActive = location.pathname === path || (path !== '/workspace' && location.pathname.startsWith(path));
              return (
                <NavLink
                  key={path}
                  to={path}
                  end={path === '/workspace'}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-[#FF5A1F]/15 text-white font-bold border border-[#FF5A1F] shadow-[0_0_12px_rgba(255,90,31,0.2)]'
                      : 'text-[#9A9A9A] hover:text-white hover:bg-[#232323]'
                  }`}
                >
                  <Icon size={14} className={isActive ? 'text-[#FF5A1F]' : 'text-[#9A9A9A]'} />
                  <span>{label}</span>
                </NavLink>
              );
            })}
          </div>
        ))}
      </div>

      {/* Tier 3: Authoritative Feeds Ticker */}
      <div className="h-6 px-5 bg-[#141414] flex items-center justify-between text-[10px] text-[#9A9A9A] overflow-x-auto gap-4 font-mono border-t border-white/5">
        <div className="flex items-center gap-1.5 shrink-0 text-white uppercase">
          <Radio size={11} className="text-[#2ECC71] animate-pulse" />
          <span>AUTHORITATIVE FEEDS:</span>
        </div>

        <div className="flex items-center gap-4 overflow-x-auto shrink-0">
          {agencyStatuses.slice(0, 6).map((agency, i) => (
            <div key={i} className="flex items-center gap-1.5 shrink-0">
              <span className="font-bold text-white">{agency.agency}</span>
              <span className="text-[#6B6B6B]">({agency.lastUpdated.split('T')[1]?.slice(0, 5) || '11:00'})</span>
              <span className={`w-1.5 h-1.5 rounded-full ${agency.status === 'fresh' ? 'bg-[#2ECC71]' : 'bg-[#FFB020]'}`} />
            </div>
          ))}
        </div>

        <div className="flex items-center gap-1 shrink-0 ml-auto text-[#6B6B6B]">
          <RefreshCw size={9} className="animate-spin text-[#9A9A9A]" />
          <span>Sync 60s</span>
        </div>
      </div>
    </header>
  );
}
