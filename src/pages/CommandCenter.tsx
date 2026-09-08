import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RiskMap } from '@/components/map/RiskMap';
import { alerts } from '@/data/alerts';
import {
  ShieldAlert, AlertTriangle, ArrowRight, CheckCircle2,
  ChevronDown, MapPin, Radio, Clock, RefreshCw
} from 'lucide-react';

export function CommandCenter() {
  const navigate = useNavigate();

  // Threat state mode toggle to test both Active Threats and Clear State
  const [hasActiveThreats, setHasActiveThreats] = useState<boolean>(true);
  const [selectedHazard, setSelectedHazard] = useState<string>('overall');
  const [lastCheckedTime, setLastCheckedTime] = useState<string>('Just now');

  // Hazard options for the central risk map selector
  const hazardOptions = [
    { value: 'overall', label: 'Overall Risk' },
    { value: 'cyclone', label: 'Cyclone' },
    { value: 'flood', label: 'Flood' },
    { value: 'landslide', label: 'Landslide' },
    { value: 'earthquake', label: 'Earthquake' },
  ];

  // Active threat items
  const activeThreatsList = [
    {
      id: 'threat-1',
      hazard: 'Cyclone',
      severity: 'HIGH',
      severityColor: 'bg-[#FF4D4D]/15 text-[#FF4D4D] border-[#FF4D4D]/30',
      badgeDot: 'bg-[#FF4D4D]',
      location: 'Bay of Bengal • Odisha Coast',
      expectedImpact: 'High',
    },
    {
      id: 'threat-2',
      hazard: 'Flood',
      severity: 'MODERATE',
      severityColor: 'bg-[#FFB020]/15 text-[#FFB020] border-[#FFB020]/30',
      badgeDot: 'bg-[#FFB020]',
      location: 'Mahanadi Basin',
      expectedImpact: 'Monitoring',
    },
  ];

  // Areas requiring attention (strictly 3-5 items max)
  const areasRequiringAttention = hasActiveThreats
    ? [
        { id: 'area-1', name: 'Coastal Odisha', riskLevel: 'High', riskDot: 'bg-[#FF4D4D]' },
        { id: 'area-2', name: 'Mahanadi Basin', riskLevel: 'Moderate', riskDot: 'bg-[#FFB020]' },
        { id: 'area-3', name: 'Koraput', riskLevel: 'Moderate', riskDot: 'bg-[#FFB020]' },
      ]
    : [];

  // Single most recent alert
  const latestAlert = hasActiveThreats && alerts.length > 0 ? alerts[0] : null;

  const handleRefreshState = () => {
    setLastCheckedTime('Just now');
  };

  return (
    <div className="flex flex-col h-full bg-[#141414] text-[#F5F5F5] overflow-y-auto p-4 md:p-6 space-y-6">
      
      {/* ------------------------------------------------------------------- */}
      {/* 1. CURRENT SITUATION — PRIMARY TOP SECTION */}
      {/* ------------------------------------------------------------------- */}
      <section className="bg-[#1C1C1C] rounded-2xl border border-white/10 p-5 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/8 pb-4 mb-4">
          <div>
            <div className="text-[11px] font-mono font-bold tracking-wider text-[#9A9A9A] uppercase flex items-center gap-2">
              <Radio size={14} className={hasActiveThreats ? "text-[#FF4D4D] animate-pulse" : "text-[#2ECC71]"} />
              <span>CURRENT SITUATION</span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-white mt-1 flex items-center gap-3">
              {hasActiveThreats ? (
                <>
                  <span>2 Active Threats</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-sans font-bold bg-[#FF4D4D]/20 text-[#FF4D4D] border border-[#FF4D4D]/40">
                    High Alert
                  </span>
                </>
              ) : (
                <>
                  <span className="text-[#2ECC71]">No Active Threats</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-sans font-bold bg-[#2ECC71]/20 text-[#2ECC71] border border-[#2ECC71]/40">
                    Normal Operations
                  </span>
                </>
              )}
            </h1>
          </div>

          {/* Threat Mode Toggle (For Operational Demo & Testing) */}
          <div className="flex items-center gap-2 shrink-0 bg-[#232323] border border-white/10 rounded-xl p-1 text-xs">
            <span className="text-[10px] text-[#9A9A9A] px-2 font-mono uppercase">Simulation State:</span>
            <button
              onClick={() => setHasActiveThreats(true)}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                hasActiveThreats
                  ? 'bg-[#FF5A1F] text-white shadow-md'
                  : 'text-[#9A9A9A] hover:text-white'
              }`}
            >
              Active Threats (2)
            </button>
            <button
              onClick={() => setHasActiveThreats(false)}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                !hasActiveThreats
                  ? 'bg-[#2ECC71] text-black shadow-md'
                  : 'text-[#9A9A9A] hover:text-white'
              }`}
            >
              No Threats (0)
            </button>
          </div>
        </div>

        {/* Situation Content Cards */}
        {hasActiveThreats ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeThreatsList.map((threat) => (
              <div
                key={threat.id}
                className="bg-[#232323] rounded-xl border border-white/8 p-4 hover:border-white/20 transition-all flex flex-col justify-between"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className={`w-3 h-3 rounded-full ${threat.badgeDot} animate-pulse`} />
                    <span className="text-base font-extrabold text-white">{threat.hazard}</span>
                  </div>
                  <span className={`text-[11px] font-extrabold font-mono px-2.5 py-0.5 rounded-md border ${threat.severityColor}`}>
                    {threat.severity}
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-[#9A9A9A] block uppercase font-mono">Location</span>
                    <span className="text-white font-semibold">{threat.location}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#9A9A9A] block uppercase font-mono">Expected Impact</span>
                    <span className="text-white font-semibold">{threat.expectedImpact}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[#232323] rounded-xl border border-[#2ECC71]/30 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#2ECC71]/15 border border-[#2ECC71]/30 flex items-center justify-center text-[#2ECC71] shrink-0">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">All Monitored Regions Normal</h3>
                <p className="text-xs text-[#9A9A9A] mt-0.5">
                  All monitored coastal and riverine regions are currently within normal environmental parameters.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#9A9A9A] font-mono shrink-0 bg-[#1C1C1C] px-3.5 py-2 rounded-xl border border-white/8">
              <Clock size={14} className="text-[#2ECC71]" />
              <span>Last checked: {lastCheckedTime}</span>
              <button
                onClick={handleRefreshState}
                className="ml-1 text-[#9A9A9A] hover:text-white transition-colors"
                title="Refresh situation status"
              >
                <RefreshCw size={12} />
              </button>
            </div>
          </div>
        )}
      </section>

      {/* ------------------------------------------------------------------- */}
      {/* 2. CENTRAL RISK MAP & LOWER PANELS GRID */}
      {/* ------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        
        {/* CENTRAL RISK MAP (Dominant Visual Element — 8 Columns) */}
        <div className="lg:col-span-8 flex flex-col bg-[#1C1C1C] rounded-2xl border border-white/10 overflow-hidden shadow-2xl min-h-[500px]">
          
          {/* Map Header with Hazard Selector */}
          <div className="px-5 py-3 bg-[#232323] text-white text-xs font-bold flex items-center justify-between z-10 shrink-0 border-b border-white/8">
            <div className="flex items-center gap-2">
              <ShieldAlert size={16} className="text-[#FF5A1F]" />
              <span className="tracking-tight font-black uppercase text-sm">RISK MAP</span>
            </div>

            {/* Hazard Selector Dropdown */}
            <div className="flex items-center gap-2">
              <label htmlFor="hazard-select" className="text-[11px] text-[#9A9A9A] font-mono font-normal">
                Hazard View:
              </label>
              <div className="relative">
                <select
                  id="hazard-select"
                  value={selectedHazard}
                  onChange={(e) => setSelectedHazard(e.target.value)}
                  className="appearance-none bg-[#1C1C1C] text-white text-xs font-bold border border-white/20 rounded-xl px-3 py-1.5 pr-8 focus:outline-none focus:border-[#FF5A1F] cursor-pointer"
                >
                  {hazardOptions.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-[#1C1C1C] text-white">
                      {opt.label} Risk
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9A9A9A] pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Interactive Geospatial Map */}
          <div className="flex-1 relative min-h-[440px]">
            <RiskMap
              selectedHazard={selectedHazard}
              height="100%"
              showControls={true}
              showLegend={false}
              showLayerPanel={false}
              onHabitationClick={() => navigate('/workspace/risk-map')}
            />

            {/* Clean Risk Legend Overlay */}
            <div className="absolute bottom-4 left-4 bg-[#1C1C1C]/90 backdrop-blur-md text-white rounded-xl shadow-xl border border-white/10 px-4 py-2.5 z-10 flex items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#FF4D4D] inline-block shadow-[0_0_8px_rgba(255,77,77,0.6)]" />
                <span>🔴 High Risk</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#FFB020] inline-block shadow-[0_0_8px_rgba(255,176,32,0.6)]" />
                <span>🟠 Moderate Risk</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#2ECC71] inline-block shadow-[0_0_8px_rgba(46,204,113,0.6)]" />
                <span>🟢 Low / Safe</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR COLUMN — AREAS & ALERT (4 Columns) */}
        <div className="lg:col-span-4 flex flex-col gap-6">

          {/* ------------------------------------------------------------------- */}
          {/* 3. AREAS REQUIRING ATTENTION */}
          {/* ------------------------------------------------------------------- */}
          <div className="bg-[#1C1C1C] rounded-2xl border border-white/10 p-5 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between border-b border-white/8 pb-3 mb-3">
              <h2 className="text-xs font-mono font-bold text-[#9A9A9A] uppercase tracking-wider flex items-center gap-2">
                <MapPin size={14} className="text-[#FF5A1F]" />
                <span>AREAS REQUIRING ATTENTION</span>
              </h2>
              <span className="text-[10px] text-[#6B6B6B] font-mono">
                {areasRequiringAttention.length} Flagged
              </span>
            </div>

            <div className="space-y-2.5 flex-1">
              {areasRequiringAttention.length > 0 ? (
                areasRequiringAttention.map((area) => (
                  <button
                    key={area.id}
                    onClick={() => navigate('/workspace/risk-map')}
                    className="w-full text-left bg-[#232323] hover:bg-[#2a2a2a] border border-white/5 hover:border-white/20 rounded-xl p-3 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`w-2.5 h-2.5 rounded-full ${area.riskDot} shrink-0`} />
                      <span className="text-xs font-extrabold text-white group-hover:text-[#FF7A3D] transition-colors">
                        {area.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-[#9A9A9A] font-semibold">
                        {area.riskLevel}
                      </span>
                      <ArrowRight size={14} className="text-[#6B6B6B] group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </button>
                ))
              ) : (
                <div className="bg-[#232323] rounded-xl p-4 text-center text-xs text-[#9A9A9A]">
                  No areas currently flagged
                </div>
              )}
            </div>
          </div>

          {/* ------------------------------------------------------------------- */}
          {/* 4. LATEST ALERT */}
          {/* ------------------------------------------------------------------- */}
          <div className="bg-[#1C1C1C] rounded-2xl border border-white/10 p-5 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between border-b border-white/8 pb-3 mb-3">
              <h2 className="text-xs font-mono font-bold text-[#9A9A9A] uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle size={14} className="text-[#FFB020]" />
                <span>LATEST ALERT</span>
              </h2>
            </div>

            {latestAlert ? (
              <div className="bg-[#232323] rounded-xl border border-white/8 p-4 flex flex-col justify-between">
                <div>
                  <p className="text-xs font-bold text-white leading-relaxed">
                    {latestAlert.title}
                  </p>
                  <p className="text-[11px] text-[#9A9A9A] mt-1.5 leading-snug">
                    {latestAlert.description}
                  </p>
                  <div className="text-[10px] text-[#6B6B6B] font-mono mt-2">
                    Updated 10 min ago
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex justify-end">
                  <button
                    onClick={() => navigate('/workspace/early-warning')}
                    className="text-xs font-bold text-[#FFB020] hover:text-white transition-colors flex items-center gap-1.5 group"
                  >
                    <span>View Early Warning</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-[#232323] rounded-xl p-4 text-center text-xs text-[#9A9A9A]">
                No new alerts
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
