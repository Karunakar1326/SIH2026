import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, SectionHeader } from '@/components/shared';
import { agencyStatuses, currentConditions } from '@/data/alerts';
import { agencyMeta } from '@/data/types';
import {
  Activity, Wind, Thermometer, CloudRain, Waves, Mountain,
  Radio, ArrowRight, RefreshCw, AlertTriangle
} from 'lucide-react';

type HazardTab = 'all' | 'cyclone' | 'flood' | 'landslide' | 'rainfall';

const hazardTabs: { id: HazardTab; label: string; icon: string; color: string }[] = [
  { id: 'all', label: 'All Sources', icon: '📡', color: '#FF5A1F' },
  { id: 'cyclone', label: 'Cyclone / Wind', icon: '🌀', color: '#60A5FA' },
  { id: 'flood', label: 'River / Flood', icon: '🌊', color: '#34D399' },
  { id: 'landslide', label: 'Landslide / Terrain', icon: '⛰️', color: '#A78BFA' },
  { id: 'rainfall', label: 'Rainfall / Weather', icon: '⛈️', color: '#FFB020' },
];

// Simulated live monitoring data cards organized by category
const monitoringData = {
  cyclone: [
    { label: 'Sustained Wind Speed', value: `${currentConditions.wind_kmh}`, unit: 'km/h', source: 'IMD', icon: Wind, status: 'warning' as const },
    { label: 'Central Pressure', value: `${currentConditions.pressure_hpa}`, unit: 'hPa', source: 'IMD', icon: Activity, status: 'warning' as const },
    { label: 'Storm Translation Speed', value: '18', unit: 'km/h', source: 'IMD', icon: Wind, status: 'normal' as const },
  ],
  flood: [
    { label: 'Mahanadi Water Level (Naraj)', value: '25.95', unit: 'm MSL', source: 'CWC', icon: Waves, status: 'warning' as const },
    { label: 'Danger Level', value: '26.41', unit: 'm MSL', source: 'CWC', icon: AlertTriangle, status: 'critical' as const },
    { label: 'Peak Discharge', value: '42,300', unit: 'm³/s', source: 'CWC', icon: Waves, status: 'warning' as const },
  ],
  landslide: [
    { label: 'Soil Saturation (Western Ganjam)', value: '92', unit: '%', source: 'GSI', icon: Mountain, status: 'warning' as const },
    { label: 'Slope Gradient (Avg)', value: '28', unit: '°', source: 'ISRO DEM', icon: Mountain, status: 'normal' as const },
    { label: 'Antecedent Rainfall (72hr)', value: '185', unit: 'mm', source: 'IMD', icon: CloudRain, status: 'warning' as const },
  ],
  rainfall: [
    { label: 'Accumulated Rainfall (24hr)', value: `${currentConditions.rainfall_mm}`, unit: 'mm', source: 'IMD', icon: CloudRain, status: 'critical' as const },
    { label: 'Surface Temperature', value: '31.2', unit: '°C', source: 'IMD', icon: Thermometer, status: 'normal' as const },
    { label: 'Relative Humidity', value: '94', unit: '%', source: 'IMD', icon: CloudRain, status: 'warning' as const },
  ],
};

function statusBadgeColor(status: 'normal' | 'warning' | 'critical') {
  if (status === 'critical') return 'bg-[#FF4D4D]/15 text-[#FF4D4D] border-[#FF4D4D]/30';
  if (status === 'warning') return 'bg-[#FFB020]/15 text-[#FFB020] border-[#FFB020]/30';
  return 'bg-[#2ECC71]/15 text-[#2ECC71] border-[#2ECC71]/30';
}

function statusLabel(status: 'normal' | 'warning' | 'critical') {
  if (status === 'critical') return 'CRITICAL';
  if (status === 'warning') return 'ELEVATED';
  return 'NORMAL';
}

export function HazardMonitoring() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<HazardTab>('all');

  const getVisibleCategories = () => {
    if (activeTab === 'all') return ['cyclone', 'flood', 'landslide', 'rainfall'] as const;
    return [activeTab] as const;
  };

  const categoryLabels: Record<string, { title: string; subtitle: string }> = {
    cyclone: { title: 'Cyclone & Wind Monitoring', subtitle: 'IMD Tropical Cyclone Tracking & Doppler Radar' },
    flood: { title: 'River & Flood Monitoring', subtitle: 'CWC Basin Telemetry & Gauge Networks' },
    landslide: { title: 'Landslide & Terrain Monitoring', subtitle: 'GSI Susceptibility & ISRO DEM Analysis' },
    rainfall: { title: 'Rainfall & Weather Monitoring', subtitle: 'IMD AWS/ARG Network & Satellite Observations' },
  };

  return (
    <div className="flex flex-col h-full bg-[#141414] text-[#F5F5F5] overflow-hidden">
      <PageHeader
        title="Hazard Monitoring — Live Conditions"
        subtitle="Real-time and frequently updated observations from authoritative sources"
        actions={
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#2ECC71] bg-[#2ECC71]/10 border border-[#2ECC71]/30 px-3 py-1.5 rounded-xl font-bold">
              <Radio size={12} className="animate-pulse" />
              <span>LIVE FEEDS ACTIVE</span>
            </div>
            <button
              onClick={() => navigate('/workspace/early-warning')}
              className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF7A3D] to-[#FF3D1F] text-white shadow-[0_0_20px_rgba(255,90,31,0.4)] hover:shadow-[0_0_28px_rgba(255,90,31,0.55)] transition-all cursor-pointer"
            >
              Early Warning <ArrowRight size={13} />
            </button>
          </div>
        }
      />

      {/* Hazard Tab Selector */}
      <div className="px-6 py-3 bg-[#141414] border-b border-white/8 flex items-center gap-2 overflow-x-auto shrink-0">
        {hazardTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl border transition-all whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[#FF5A1F]/15 border-[#FF5A1F] text-white shadow-[0_0_12px_rgba(255,90,31,0.2)]'
                : 'border-white/8 bg-[#1C1C1C] text-[#9A9A9A] hover:text-white hover:bg-[#232323]'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
        {/* Monitoring Data Cards */}
        {getVisibleCategories().map(category => (
          <div key={category} className="bg-[#1C1C1C] border border-white/10 rounded-2xl p-5 shadow-2xl">
            <SectionHeader
              title={categoryLabels[category].title}
              subtitle={categoryLabels[category].subtitle}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
              {monitoringData[category].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="bg-[#232323] border border-white/8 rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon size={14} className="text-[#9A9A9A]" />
                        <span className="text-[11px] text-[#9A9A9A] font-medium">{item.label}</span>
                      </div>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${statusBadgeColor(item.status)}`}>
                        {statusLabel(item.status)}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-black text-white tabular-nums">{item.value}</span>
                      <span className="text-xs text-[#9A9A9A]">{item.unit}</span>
                    </div>
                    <div className="text-[10px] text-[#6B6B6B] font-mono">
                      Source: {item.source}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Data Source Freshness */}
        <div className="bg-[#1C1C1C] border border-white/10 rounded-2xl p-5 shadow-2xl">
          <SectionHeader
            title="Data Source Status"
            subtitle="Freshness and sync status of all authoritative feeds"
          />
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
            {agencyStatuses.slice(0, 4).map((agency, i) => {
              const meta = agencyMeta[agency.agency] || agencyMeta.DISTRICT_ADMIN;
              return (
                <div key={i} className="bg-[#232323] border border-white/8 rounded-xl p-3.5">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${meta.color}`}>
                      {meta.name}
                    </span>
                    <span className={`w-2 h-2 rounded-full ${agency.status === 'fresh' ? 'bg-[#2ECC71] animate-pulse' : 'bg-[#FFB020]'}`} />
                  </div>
                  <div className="text-xs font-bold text-white mb-1">{agency.datasetName}</div>
                  <div className="flex items-center justify-between text-[10px] text-[#6B6B6B] font-mono">
                    <span>{agency.updateFrequency}</span>
                    <div className="flex items-center gap-1">
                      <RefreshCw size={9} className={agency.isLive ? 'animate-spin text-[#2ECC71]' : 'text-[#6B6B6B]'} />
                      <span>{agency.isLive ? 'LIVE' : 'PERIODIC'}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Workflow Prompt */}
        <div className="bg-[#1C1C1C] border border-white/10 rounded-2xl p-5 shadow-2xl flex items-center justify-between">
          <div>
            <div className="text-sm font-bold text-white">Conditions suggest a developing hazard?</div>
            <div className="text-xs text-[#9A9A9A] mt-1">Check the Early Warning module for forecasts and threat assessments</div>
          </div>
          <button
            onClick={() => navigate('/workspace/early-warning')}
            className="flex items-center gap-2 text-xs font-bold px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF7A3D] to-[#FF3D1F] text-white shadow-[0_0_20px_rgba(255,90,31,0.35)] hover:shadow-[0_0_28px_rgba(255,90,31,0.55)] transition-all cursor-pointer shrink-0"
          >
            Early Warning <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
