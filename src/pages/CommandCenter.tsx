import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { KPIBlock, StatusBadge } from '@/components/shared';
import { RiskMap } from '@/components/map/RiskMap';
import { habitations } from '@/data/habitations';
import { alerts, dynamicNotifications } from '@/data/alerts';
import { safeSites } from '@/data/safe-sites';
import { useAppStore } from '@/stores';
import { hazardIcon, formatCompactNumber, timeAgo } from '@/utils/helpers';
import {
  ShieldAlert, AlertTriangle, Users, Home, ArrowRightLeft, MapPin,
  Bell, Activity, Zap, Radio
} from 'lucide-react';

export function CommandCenter() {
  const navigate = useNavigate();
  const selectedDistrict = useAppStore((s) => s.selectedDistrict);
  const [selectedTab, setSelectedTab] = useState<'redzones' | 'notifications' | 'alerts'>('redzones');

  const filteredHabitations = selectedDistrict === 'All Districts'
    ? habitations
    : habitations.filter(h => h.district === selectedDistrict);

  const redZoneHabitations = filteredHabitations.filter(h => h.red_zone.isRedZone);
  const highRiskHabitations = filteredHabitations.filter(h => h.risk_level === 'high');
  const totalExposedPop = redZoneHabitations.reduce((s, h) => s + h.population, 0);
  const totalExposedHouses = redZoneHabitations.reduce((s, h) => s + h.households, 0);
  const immediateRelocHabs = filteredHabitations.filter(h => h.relocation_urgency === 'immediate');

  const suitableSites = safeSites.filter(s => s.status === 'suitable');
  const totalAvailableCapacity = suitableSites.reduce((s, site) => s + site.carrying_capacity.estimated_sustainable_capacity, 0);
  const totalRelocNeed = immediateRelocHabs.reduce((s, h) => s + h.population, 0);
  const capacityDeficit = Math.max(0, totalRelocNeed - totalAvailableCapacity);

  return (
    <div className="flex flex-col h-full bg-[#141414] text-[#F5F5F5] overflow-hidden">
      {/* Dynamic Update Alert Banner */}
      {dynamicNotifications.length > 0 && (
        <div className="bg-[#FFB020]/10 text-[#FFB020] border-b border-[#FFB020]/30 px-4 py-2 text-xs flex items-center justify-between shrink-0 font-mono">
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-[#FFB020] animate-bounce" />
            <span className="font-bold text-[#FFB020]">DYNAMIC UPDATE NOTIFICATION:</span>
            <span>
              <strong>{dynamicNotifications[0].habitationName}</strong> risk score changed{' '}
              <span className="text-white font-bold">{dynamicNotifications[0].previousScore} → {dynamicNotifications[0].newScore}</span>{' '}
              ({dynamicNotifications[0].changeReason})
            </span>
          </div>
          <button
            onClick={() => navigate(`/habitations/${dynamicNotifications[0].habitationId}`)}
            className="text-[11px] underline text-[#FFB020] font-sans font-bold hover:text-white transition-colors"
          >
            Inspect Assessment →
          </button>
        </div>
      )}

      {/* Operational KPI Strip — Exactly 1 Hero Card with Orange Gradient */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3 px-4 py-3 bg-[#141414] border-b border-white/8 shrink-0">
        <KPIBlock isHero={true} label="RED-ZONE HABITATIONS" value={redZoneHabitations.length} riskLevel="critical" icon={<ShieldAlert size={15} className="text-white" />} />
        <KPIBlock label="HIGH RISK HABITATIONS" value={highRiskHabitations.length} riskLevel="high" icon={<AlertTriangle size={15} className="text-[#FF5A1F]" />} />
        <KPIBlock label="EXPOSED POPULATION" value={formatCompactNumber(totalExposedPop)} riskLevel="critical" icon={<Users size={15} className="text-[#FF4D4D]" />} />
        <KPIBlock label="EXPOSED HOUSES" value={formatCompactNumber(totalExposedHouses)} riskLevel="critical" icon={<Home size={15} className="text-[#FF4D4D]" />} />
        <KPIBlock label="IMMEDIATE RELOCATION" value={immediateRelocHabs.length} riskLevel="critical" icon={<ArrowRightLeft size={15} className="text-[#FF4D4D]" />} />
        <KPIBlock label="SUITABLE SITES" value={suitableSites.length} icon={<MapPin size={15} className="text-[#2ECC71]" />} />
        <KPIBlock label="CAPACITY DEFICIT" value={formatCompactNumber(capacityDeficit)} trend="up" icon={<Activity size={15} className="text-[#FFB020]" />} />
        <KPIBlock label="ACTIVE ALERTS" value={alerts.filter(a => a.is_active).length} riskLevel="high" icon={<Bell size={15} className="text-[#FFB020]" />} />
      </div>

      {/* Main Map + Right Intelligence Panel */}
      <div className="flex-1 flex p-4 gap-4 min-h-0">
        {/* Dominant GIS Command Map */}
        <div className="flex-1 bg-[#1C1C1C] rounded-2xl border border-white/10 overflow-hidden shadow-2xl flex flex-col relative">
          <div className="px-4 py-2.5 bg-[#232323] text-white text-xs font-bold flex items-center justify-between z-10 shrink-0 border-b border-white/8">
            <div className="flex items-center gap-2">
              <Radio size={14} className="text-[#2ECC71] animate-pulse" />
              <span className="tracking-tight font-black">GEOSPATIAL COMMAND CENTER MAP — RED-ZONE & HAZARD OVERLAY</span>
            </div>
            <span className="text-[10px] text-[#9A9A9A] font-mono">ISRO CartoDEM + IMD Track + CWC Inundation Layer</span>
          </div>

          <div className="flex-1 relative">
            <RiskMap
              height="100%"
              onHabitationClick={(id) => navigate(`/workspace/communities/${id}`)}
              onEventClick={() => navigate('/workspace/historical')}
              onSiteClick={() => navigate('/workspace/safe-sites')}
            />
          </div>
        </div>

        {/* Right Intelligence & Red-Zone Drawer */}
        <div className="w-88 shrink-0 flex flex-col gap-3">
          {/* Tab Switcher */}
          <div className="flex bg-[#1C1C1C] border border-white/8 rounded-2xl p-1 text-xs shrink-0 font-medium">
            <button
              onClick={() => setSelectedTab('redzones')}
              className={`flex-1 py-1.5 rounded-xl transition-all ${
                selectedTab === 'redzones' ? 'bg-[#232323] text-[#FF4D4D] font-bold shadow-xs border border-white/10' : 'text-[#9A9A9A] hover:text-white'
              }`}
            >
              Red-Zones ({redZoneHabitations.length})
            </button>
            <button
              onClick={() => setSelectedTab('notifications')}
              className={`flex-1 py-1.5 rounded-xl transition-all ${
                selectedTab === 'notifications' ? 'bg-[#232323] text-white font-bold shadow-xs border border-white/10' : 'text-[#9A9A9A] hover:text-white'
              }`}
            >
              Updates ({dynamicNotifications.length})
            </button>
            <button
              onClick={() => setSelectedTab('alerts')}
              className={`flex-1 py-1.5 rounded-xl transition-all ${
                selectedTab === 'alerts' ? 'bg-[#232323] text-[#FFB020] font-bold shadow-xs border border-white/10' : 'text-[#9A9A9A] hover:text-white'
              }`}
            >
              Alerts ({alerts.length})
            </button>
          </div>

          {/* Tab Content Box */}
          <div className="flex-1 bg-[#1C1C1C] rounded-2xl border border-white/10 overflow-y-auto shadow-2xl flex flex-col">
            {selectedTab === 'redzones' && (
              <div className="divide-y divide-white/5">
                <div className="px-3.5 py-2.5 bg-[#FF4D4D]/10 border-b border-[#FF4D4D]/20">
                  <div className="text-xs font-bold text-[#FF4D4D] flex items-center gap-1.5">
                    <ShieldAlert size={14} className="text-[#FF4D4D]" />
                    <span>Red-Zone Emergency Habitations</span>
                  </div>
                  <div className="text-[10px] text-[#9A9A9A]">Priority 1 evacuation & relocation candidates</div>
                </div>

                {redZoneHabitations.map((hab) => (
                  <div
                    key={hab.id}
                    onClick={() => navigate(`/habitations/${hab.id}`)}
                    className="p-3.5 hover:bg-[#232323] cursor-pointer transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#FF4D4D] animate-pulse" />
                          <span>{hab.name}</span>
                        </div>
                        <div className="text-[10px] text-[#9A9A9A] mt-0.5 font-medium">
                          {hab.district} · Pop: {hab.population.toLocaleString()} · Elev: {hab.elevation_m}m
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-black text-[#FF4D4D] tabular-nums">{hab.risk_score}</div>
                        <span className="text-[9px] font-bold text-[#FF4D4D] bg-[#FF4D4D]/15 border border-[#FF4D4D]/30 px-1.5 py-0.5 rounded-full">RPI {hab.relocation_priority}</span>
                      </div>
                    </div>
                    <div className="mt-2 text-[10px] text-[#F5F5F5] bg-[#232323] border border-white/5 rounded-xl p-2 leading-tight">
                      <strong className="text-[#FF4D4D]">Trigger:</strong> {hab.red_zone.primaryTrigger}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedTab === 'notifications' && (
              <div className="p-3 space-y-2.5">
                <div className="text-xs font-bold text-white mb-1">Dynamic Assessment Updates</div>
                {dynamicNotifications.map((notif) => (
                  <div key={notif.id} className="bg-[#232323] border border-[#FFB020]/30 rounded-xl p-3 text-xs">
                    <div className="flex items-center justify-between font-bold text-[#FFB020]">
                      <span>{notif.habitationName}</span>
                      <span className="text-[10px] text-[#9A9A9A]">{timeAgo(notif.timestamp)}</span>
                    </div>
                    <div className="text-[11px] text-white mt-1">
                      Score Delta: <strong className="text-[#FF5A1F]">{notif.previousScore} → {notif.newScore}</strong>
                    </div>
                    <p className="text-[10px] text-[#9A9A9A] mt-1 leading-tight">{notif.changeReason}</p>
                  </div>
                ))}
              </div>
            )}

            {selectedTab === 'alerts' && (
              <div className="divide-y divide-white/5">
                {alerts.map((alert) => (
                  <div key={alert.id} className="p-3.5 hover:bg-[#232323] transition-colors">
                    <div className="flex items-start gap-2.5">
                      <span className="text-base">{hazardIcon(alert.hazard_type)}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <StatusBadge level={alert.severity} />
                          <span className="text-[10px] text-[#6B6B6B]">{timeAgo(alert.timestamp)}</span>
                        </div>
                        <div className="text-xs font-bold text-white mt-1">{alert.title}</div>
                        <p className="text-[10px] text-[#9A9A9A] mt-0.5 leading-tight">{alert.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
