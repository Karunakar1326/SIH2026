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
    <div className="flex flex-col h-full bg-neutral-100 overflow-hidden">
      {/* Dynamic Update Alert Banner */}
      {dynamicNotifications.length > 0 && (
        <div className="bg-amber-950 text-amber-200 border-b border-amber-800 px-4 py-2 text-xs flex items-center justify-between shrink-0 font-mono">
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-amber-400 animate-bounce" />
            <span className="font-bold text-amber-300">DYNAMIC UPDATE NOTIFICATION:</span>
            <span>
              <strong>{dynamicNotifications[0].habitationName}</strong> risk score changed{' '}
              <span className="text-white font-bold">{dynamicNotifications[0].previousScore} → {dynamicNotifications[0].newScore}</span>{' '}
              ({dynamicNotifications[0].changeReason})
            </span>
          </div>
          <button
            onClick={() => navigate(`/habitations/${dynamicNotifications[0].habitationId}`)}
            className="text-[11px] underline text-amber-300 font-sans font-bold hover:text-white"
          >
            Inspect Assessment →
          </button>
        </div>
      )}

      {/* Operational KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-2.5 px-4 py-3 bg-white border-b border-neutral-200 shrink-0 shadow-2xs">
        <KPIBlock label="RED-ZONE HABITATIONS" value={redZoneHabitations.length} riskLevel="critical" icon={<ShieldAlert size={14} className="text-red-600" />} />
        <KPIBlock label="HIGH RISK HABITATIONS" value={highRiskHabitations.length} riskLevel="high" icon={<AlertTriangle size={14} />} />
        <KPIBlock label="EXPOSED POPULATION" value={formatCompactNumber(totalExposedPop)} riskLevel="critical" icon={<Users size={14} />} />
        <KPIBlock label="EXPOSED HOUSES" value={formatCompactNumber(totalExposedHouses)} riskLevel="critical" icon={<Home size={14} />} />
        <KPIBlock label="IMMEDIATE RELOCATION" value={immediateRelocHabs.length} riskLevel="critical" icon={<ArrowRightLeft size={14} />} />
        <KPIBlock label="SUITABLE SITES" value={suitableSites.length} icon={<MapPin size={14} />} />
        <KPIBlock label="CAPACITY DEFICIT" value={formatCompactNumber(capacityDeficit)} trend="up" icon={<Activity size={14} />} />
        <KPIBlock label="ACTIVE ALERTS" value={alerts.filter(a => a.is_active).length} riskLevel="high" icon={<Bell size={14} />} />
      </div>

      {/* Main Map + Right Intelligence Panel */}
      <div className="flex-1 flex p-4 gap-4 min-h-0">
        {/* Dominant GIS Command Map (70% Visual focus) */}
        <div className="flex-1 bg-white rounded-lg border border-neutral-300 overflow-hidden shadow-sm flex flex-col relative">
          <div className="px-4 py-2 bg-neutral-900 text-white text-xs font-bold flex items-center justify-between z-10 shrink-0">
            <div className="flex items-center gap-2">
              <Radio size={14} className="text-emerald-400 animate-pulse" />
              <span>GEOSPATIAL COMMAND CENTER MAP — RED-ZONE & HAZARD OVERLAY</span>
            </div>
            <span className="text-[10px] text-neutral-400 font-mono">ISRO CartoDEM + IMD Track + CWC Inundation Layer</span>
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
          <div className="flex bg-neutral-200 rounded p-1 text-xs shrink-0 font-medium">
            <button
              onClick={() => setSelectedTab('redzones')}
              className={`flex-1 py-1.5 rounded transition-all ${
                selectedTab === 'redzones' ? 'bg-white text-red-900 font-bold shadow-2xs' : 'text-neutral-600'
              }`}
            >
              Red-Zones ({redZoneHabitations.length})
            </button>
            <button
              onClick={() => setSelectedTab('notifications')}
              className={`flex-1 py-1.5 rounded transition-all ${
                selectedTab === 'notifications' ? 'bg-white text-neutral-900 font-bold shadow-2xs' : 'text-neutral-600'
              }`}
            >
              Updates ({dynamicNotifications.length})
            </button>
            <button
              onClick={() => setSelectedTab('alerts')}
              className={`flex-1 py-1.5 rounded transition-all ${
                selectedTab === 'alerts' ? 'bg-white text-neutral-900 font-bold shadow-2xs' : 'text-neutral-600'
              }`}
            >
              Alerts ({alerts.length})
            </button>
          </div>

          {/* Tab Content Box */}
          <div className="flex-1 bg-white rounded-lg border border-neutral-300 overflow-y-auto shadow-2xs flex flex-col">
            {selectedTab === 'redzones' && (
              <div className="divide-y divide-neutral-150">
                <div className="px-3 py-2 bg-red-50 border-b border-red-200">
                  <div className="text-xs font-bold text-red-900 flex items-center gap-1.5">
                    <ShieldAlert size={14} className="text-red-600" />
                    <span>Red-Zone Emergency Habitations</span>
                  </div>
                  <div className="text-[10px] text-red-700">Priority 1 evacuation & relocation candidates</div>
                </div>

                {redZoneHabitations.map((hab) => (
                  <div
                    key={hab.id}
                    onClick={() => navigate(`/habitations/${hab.id}`)}
                    className="p-3 hover:bg-red-50/50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                          <span>{hab.name}</span>
                        </div>
                        <div className="text-[10px] text-neutral-500 mt-0.5">
                          {hab.district} · Pop: {hab.population.toLocaleString()} · Elev: {hab.elevation_m}m
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-extrabold text-red-600">{hab.risk_score}</div>
                        <span className="text-[9px] font-bold text-red-800 bg-red-100 px-1.5 py-0.2 rounded">RPI {hab.relocation_priority}</span>
                      </div>
                    </div>
                    <div className="mt-2 text-[10px] text-red-900 bg-red-50 border border-red-200 rounded p-1.5 leading-tight">
                      <strong>Trigger:</strong> {hab.red_zone.primaryTrigger}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedTab === 'notifications' && (
              <div className="p-3 space-y-2">
                <div className="text-xs font-bold text-neutral-800 mb-1">Dynamic Assessment Updates</div>
                {dynamicNotifications.map((notif) => (
                  <div key={notif.id} className="bg-amber-50 border border-amber-200 rounded p-2.5 text-xs">
                    <div className="flex items-center justify-between font-bold text-amber-900">
                      <span>{notif.habitationName}</span>
                      <span className="text-[10px] text-amber-700">{timeAgo(notif.timestamp)}</span>
                    </div>
                    <div className="text-[11px] text-amber-800 mt-1">
                      Score Delta: <strong>{notif.previousScore} → {notif.newScore}</strong>
                    </div>
                    <p className="text-[10px] text-amber-700 mt-1 leading-tight">{notif.changeReason}</p>
                  </div>
                ))}
              </div>
            )}

            {selectedTab === 'alerts' && (
              <div className="divide-y divide-neutral-150">
                {alerts.map((alert) => (
                  <div key={alert.id} className="p-3 hover:bg-neutral-25">
                    <div className="flex items-start gap-2">
                      <span className="text-base">{hazardIcon(alert.hazard_type)}</span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <StatusBadge level={alert.severity} />
                          <span className="text-[10px] text-neutral-400">{timeAgo(alert.timestamp)}</span>
                        </div>
                        <div className="text-xs font-bold text-neutral-900 mt-1">{alert.title}</div>
                        <p className="text-[10px] text-neutral-600 mt-0.5 leading-tight">{alert.description}</p>
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
