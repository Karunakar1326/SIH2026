import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, SectionHeader, StatusBadge } from '@/components/shared';
import { alerts, currentConditions } from '@/data/alerts';
import { historicalEvents } from '@/data/historical-events';
import { hazardLabel, hazardIcon, timeAgo } from '@/utils/helpers';
import type { HazardType } from '@/data/types';
import {
  AlertTriangle, ArrowRight, Radio, Clock, MapPin,
  Shield, TrendingUp, Eye
} from 'lucide-react';

export function EarlyWarning() {
  const navigate = useNavigate();
  const [hazardFilter, setHazardFilter] = useState<HazardType | 'all'>('all');

  const activeAlerts = alerts.filter(a => a.is_active);
  const filteredAlerts = hazardFilter === 'all'
    ? activeAlerts
    : activeAlerts.filter(a => a.hazard_type === hazardFilter);

  const closestAnalogue = historicalEvents.find(e => e.id === currentConditions.closest_analogue_id);

  return (
    <div className="flex flex-col h-full bg-[#141414] text-[#F5F5F5] overflow-hidden">
      <PageHeader
        title="Hazard Forecast & Early Warning"
        subtitle="Is a significant hazard likely to occur or intensify?"
        actions={
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#FFB020] bg-[#FFB020]/10 border border-[#FFB020]/30 px-3 py-1.5 rounded-xl font-bold">
              <AlertTriangle size={12} />
              <span>{activeAlerts.length} ACTIVE WARNINGS</span>
            </div>
            <button
              onClick={() => navigate('/workspace/intensity')}
              className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF7A3D] to-[#FF3D1F] text-white shadow-[0_0_20px_rgba(255,90,31,0.4)] hover:shadow-[0_0_28px_rgba(255,90,31,0.55)] transition-all cursor-pointer"
            >
              Assess Intensity <ArrowRight size={13} />
            </button>
          </div>
        }
      />

      {/* Hazard Filter */}
      <div className="px-6 py-3 bg-[#141414] border-b border-white/8 flex items-center gap-3 shrink-0">
        <label className="text-[10px] font-bold text-[#9A9A9A] uppercase tracking-wider">Filter by Hazard:</label>
        <select
          value={hazardFilter}
          onChange={(e) => setHazardFilter(e.target.value as HazardType | 'all')}
          className="text-xs border border-white/10 rounded-xl px-3 py-1.5 bg-[#232323] text-white focus:outline-none focus:ring-1 focus:ring-[#FF5A1F] font-semibold"
        >
          <option value="all" className="bg-[#1C1C1C]">All Hazard Types</option>
          <option value="cyclone" className="bg-[#1C1C1C]">🌀 Cyclone</option>
          <option value="flood" className="bg-[#1C1C1C]">🌊 Flood</option>
          <option value="landslide" className="bg-[#1C1C1C]">⛰️ Landslide</option>
          <option value="extreme_rainfall" className="bg-[#1C1C1C]">⛈️ Extreme Rainfall</option>
          <option value="coastal_erosion" className="bg-[#1C1C1C]">🏖️ Coastal Erosion</option>
        </select>
        <span className="text-xs text-[#9A9A9A] font-mono ml-auto">
          {filteredAlerts.length} active warning{filteredAlerts.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
        {/* Current Threat Summary */}
        <div className="bg-[#1C1C1C] border border-[#FF5A1F]/30 rounded-2xl p-5 shadow-2xl">
          <SectionHeader
            title="Current Primary Threat Assessment"
            subtitle="Based on latest IMD observations and forecast models"
          />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
            <div className="bg-[#232323] border border-white/8 rounded-xl p-4">
              <div className="text-[10px] text-[#9A9A9A] font-medium uppercase tracking-wider mb-1">Active Hazard</div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{hazardIcon(currentConditions.hazard_type)}</span>
                <span className="text-lg font-black text-white">{hazardLabel(currentConditions.hazard_type)}</span>
              </div>
            </div>
            <div className="bg-[#232323] border border-white/8 rounded-xl p-4">
              <div className="text-[10px] text-[#9A9A9A] font-medium uppercase tracking-wider mb-1">Likelihood</div>
              <div className="text-2xl font-black text-[#FF4D4D] tabular-nums">HIGH</div>
              <div className="text-[10px] text-[#6B6B6B] font-mono mt-1">Based on current parameters</div>
            </div>
            <div className="bg-[#232323] border border-white/8 rounded-xl p-4">
              <div className="text-[10px] text-[#9A9A9A] font-medium uppercase tracking-wider mb-1">Historical Match</div>
              <div className="text-2xl font-black text-[#FF5A1F] tabular-nums">{currentConditions.similarity_to_historical}%</div>
              <div className="text-[10px] text-[#6B6B6B] font-mono mt-1">
                {closestAnalogue ? closestAnalogue.name : 'No analogue'}
              </div>
            </div>
            <div className="bg-[#232323] border border-white/8 rounded-xl p-4">
              <div className="text-[10px] text-[#9A9A9A] font-medium uppercase tracking-wider mb-1">Confidence</div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-[#141414] rounded-full overflow-hidden border border-white/5">
                  <div className="h-full bg-gradient-to-r from-[#FF7A3D] to-[#FF3D1F] rounded-full" style={{ width: '78%' }} />
                </div>
                <span className="text-sm font-bold text-white tabular-nums">78%</span>
              </div>
              <div className="text-[10px] text-[#6B6B6B] font-mono mt-1">Source: IMD Forecast Model</div>
            </div>
          </div>
        </div>

        {/* Active Warnings List */}
        <div className="bg-[#1C1C1C] border border-white/10 rounded-2xl p-5 shadow-2xl">
          <SectionHeader
            title="Active Warnings & Advisories"
            subtitle="Official warnings from authoritative agencies"
          />
          <div className="mt-4 space-y-3">
            {filteredAlerts.map(alert => (
              <div key={alert.id} className="bg-[#232323] border border-white/8 rounded-xl p-4 hover:bg-[#2a2a2a] transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 min-w-0">
                    <span className="text-2xl shrink-0 mt-0.5">{hazardIcon(alert.hazard_type)}</span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <StatusBadge level={alert.severity} />
                        <span className="text-[10px] text-[#6B6B6B] font-mono flex items-center gap-1">
                          <Clock size={10} />
                          {timeAgo(alert.timestamp)}
                        </span>
                      </div>
                      <div className="text-sm font-bold text-white mt-1.5">{alert.title}</div>
                      <p className="text-xs text-[#9A9A9A] mt-1 leading-relaxed">{alert.description}</p>
                      <div className="flex items-center gap-3 mt-2 text-[10px] text-[#6B6B6B] font-mono">
                        <span className="flex items-center gap-1"><MapPin size={10} /> {alert.district}</span>
                        <span className="flex items-center gap-1"><Shield size={10} /> {hazardLabel(alert.hazard_type)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {alert.is_active && (
                      <span className="flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#FF4D4D]/15 text-[#FF4D4D] border border-[#FF4D4D]/30">
                        <Radio size={9} className="animate-pulse" /> ACTIVE
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Forecast Context */}
        <div className="bg-[#1C1C1C] border border-white/10 rounded-2xl p-5 shadow-2xl">
          <SectionHeader
            title="Forecast Context"
            subtitle="Expected development based on current trajectory and historical patterns"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="bg-[#232323] border border-white/8 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <TrendingUp size={14} className="text-[#FF5A1F]" />
                Expected Development
              </div>
              <p className="text-[11px] text-[#9A9A9A] leading-relaxed">
                System expected to intensify over next 12-24 hours. Landfall conditions likely along Odisha coast between Gopalpur and Puri.
              </p>
            </div>
            <div className="bg-[#232323] border border-white/8 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <MapPin size={14} className="text-[#FF5A1F]" />
                Expected Affected Region
              </div>
              <p className="text-[11px] text-[#9A9A9A] leading-relaxed">
                Coastal districts: Ganjam, Puri, Jagatsinghpur, Kendrapara. Inland impact expected in Balasore from associated rainfall.
              </p>
            </div>
            <div className="bg-[#232323] border border-white/8 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <Eye size={14} className="text-[#FF5A1F]" />
                Source & Freshness
              </div>
              <p className="text-[11px] text-[#9A9A9A] leading-relaxed">
                IMD Cyclone Warning Division, Bhubaneswar. Last bulletin: 11:00 IST. Next update expected: 14:00 IST. Confidence: Moderate-High.
              </p>
            </div>
          </div>
        </div>

        {/* Workflow Prompt */}
        <div className="bg-[#1C1C1C] border border-white/10 rounded-2xl p-5 shadow-2xl flex items-center justify-between">
          <div>
            <div className="text-sm font-bold text-white">How intense could this event become?</div>
            <div className="text-xs text-[#9A9A9A] mt-1">Assess hazard-specific intensity parameters and severity classification</div>
          </div>
          <button
            onClick={() => navigate('/workspace/intensity')}
            className="flex items-center gap-2 text-xs font-bold px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF7A3D] to-[#FF3D1F] text-white shadow-[0_0_20px_rgba(255,90,31,0.35)] hover:shadow-[0_0_28px_rgba(255,90,31,0.55)] transition-all cursor-pointer shrink-0"
          >
            Intensity Assessment <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
