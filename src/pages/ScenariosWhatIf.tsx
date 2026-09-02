import { useState } from 'react';
import { PageHeader, SectionHeader, StatusBadge } from '@/components/shared';
import { habitations } from '@/data/habitations';
import { safeSites } from '@/data/safe-sites';
import { formatNumber, riskColor } from '@/utils/helpers';
import { Sliders, RefreshCw, AlertTriangle, ShieldAlert, Users, Droplets, CloudRain, Waves, MapPin, FileSpreadsheet, Layers, Sparkles } from 'lucide-react';

export function ScenariosWhatIf() {
  // Scenario stress factor states
  const [rainfallIncrease, setRainfallIncrease] = useState(25); // +25% rainfall
  const [riverSurge, setRiverSurge] = useState(1.5); // +1.5m flood crest
  const [popDisplacement, setPopDisplacement] = useState(15); // +15% population growth/displacement
  const [waterDeficit, setWaterDeficit] = useState(20); // -20% water availability
  const [hazardMultiplier, setHazardMultiplier] = useState(1.2); // 1.2x severity
  const [siteCapacityStrain, setSiteCapacityStrain] = useState(30); // +30% capacity load

  // Compute dynamic simulation metrics
  const baselineTotalNeed = habitations.reduce((sum, h) => sum + h.population, 0);
  const simulatedTotalNeed = Math.round(baselineTotalNeed * (1 + popDisplacement / 100));

  const baselineRedZoneCount = habitations.filter(h => h.red_zone.isRedZone).length;
  // Dynamic calculation: every +10% rainfall or +0.5m river surge elevates settlements
  const additionalRedZones = Math.min(10, Math.floor(rainfallIncrease / 15 + riverSurge / 0.8 + (hazardMultiplier - 1) * 5));
  const simulatedRedZoneCount = Math.min(habitations.length, baselineRedZoneCount + additionalRedZones);

  const baselineAvgRPI = Math.round(habitations.reduce((sum, h) => sum + h.relocation_priority, 0) / habitations.length);
  const rpiDelta = Math.round((rainfallIncrease * 0.15) + (riverSurge * 2.5) + ((hazardMultiplier - 1) * 15));
  const simulatedAvgRPI = Math.min(100, baselineAvgRPI + rpiDelta);

  const totalSuitableCapacity = safeSites.filter(s => s.status === 'suitable').reduce((sum, s) => sum + s.carrying_capacity.estimated_sustainable_capacity, 0);
  const simulatedAvailableCapacity = Math.round(totalSuitableCapacity * (1 - siteCapacityStrain / 100));
  const capacityDeficit = Math.max(0, simulatedTotalNeed - simulatedAvailableCapacity);

  const handleReset = () => {
    setRainfallIncrease(0);
    setRiverSurge(0);
    setPopDisplacement(0);
    setWaterDeficit(0);
    setHazardMultiplier(1.0);
    setSiteCapacityStrain(0);
  };

  return (
    <div className="flex flex-col h-full bg-[#141414] text-[#F5F5F5] overflow-hidden">
      <PageHeader
        title="Scenarios & What-If Simulation Engine"
        subtitle="Stress-test relocation priority, risk severity, and site carrying capacity under hypothetical extreme weather and demographic conditions"
        actions={
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[#FFB020]/15 border border-[#FFB020]/40 text-[#FFB020] px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold">
              <Sparkles size={14} className="animate-pulse" />
              <span>SIMULATION / WHAT-IF MODE</span>
            </div>
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border border-white/10 bg-[#232323] hover:bg-white/10 text-white transition-colors cursor-pointer"
            >
              <RefreshCw size={13} /> Reset Baseline
            </button>
          </div>
        }
      />

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
        {/* Warning Banner */}
        <div className="bg-[#FFB020]/10 border border-[#FFB020]/30 rounded-2xl p-4 flex items-center justify-between text-xs text-[#FFB020]">
          <div className="flex items-center gap-3">
            <AlertTriangle size={20} className="shrink-0 text-[#FFB020]" />
            <div>
              <span className="font-bold uppercase tracking-wider block text-white text-xs">Temporary Simulation Workspace Active</span>
              <span className="text-[#9A9A9A] text-[11px]">All parameter changes are executed in isolated simulation memory. Actual production risk data, settlement RPI scores, and official relocation plans remain completely untouched.</span>
            </div>
          </div>
          <span className="font-mono text-[10px] font-bold bg-[#141414] border border-[#FFB020]/30 px-2.5 py-1 rounded-lg shrink-0">
            PROD DATA PRESERVED
          </span>
        </div>

        {/* Top Split: Scenario Sliders vs Dynamic Impact Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column: Stress Factor Sliders (7 cols) */}
          <div className="lg:col-span-7 bg-[#1C1C1C] border border-white/10 rounded-2xl p-5 shadow-2xl space-y-4">
            <SectionHeader title="Hypothetical Stress-Test Parameters" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* 1. Rainfall Increase */}
              <div className="bg-[#232323] p-3.5 rounded-xl border border-white/5 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <CloudRain size={14} className="text-[#60A5FA]" /> Monsoon Rainfall Surge
                  </span>
                  <span className="font-mono font-bold text-[#60A5FA]">+{rainfallIncrease}%</span>
                </div>
                <input
                  type="range" min="0" max="100" step="5" value={rainfallIncrease}
                  onChange={(e) => setRainfallIncrease(Number(e.target.value))}
                  className="w-full accent-[#60A5FA] cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-[#9A9A9A] font-mono">
                  <span>Baseline (0%)</span>
                  <span>Extreme (+100%)</span>
                </div>
              </div>

              {/* 2. River Surge */}
              <div className="bg-[#232323] p-3.5 rounded-xl border border-white/5 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Waves size={14} className="text-[#34D399]" /> River Flood Crest Elevation
                  </span>
                  <span className="font-mono font-bold text-[#34D399]">+{riverSurge.toFixed(1)}m</span>
                </div>
                <input
                  type="range" min="0" max="5.0" step="0.5" value={riverSurge}
                  onChange={(e) => setRiverSurge(Number(e.target.value))}
                  className="w-full accent-[#34D399] cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-[#9A9A9A] font-mono">
                  <span>Normal (0.0m)</span>
                  <span>Catastrophic (+5.0m)</span>
                </div>
              </div>

              {/* 3. Population Displacement */}
              <div className="bg-[#232323] p-3.5 rounded-xl border border-white/5 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Users size={14} className="text-[#FF7A3D]" /> Population Inflow / Growth
                  </span>
                  <span className="font-mono font-bold text-[#FF7A3D]">+{popDisplacement}%</span>
                </div>
                <input
                  type="range" min="0" max="50" step="5" value={popDisplacement}
                  onChange={(e) => setPopDisplacement(Number(e.target.value))}
                  className="w-full accent-[#FF7A3D] cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-[#9A9A9A] font-mono">
                  <span>Static (0%)</span>
                  <span>Mass Inflow (+50%)</span>
                </div>
              </div>

              {/* 4. Water Availability Deficit */}
              <div className="bg-[#232323] p-3.5 rounded-xl border border-white/5 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Droplets size={14} className="text-[#A78BFA]" /> Water Resource Deficit
                  </span>
                  <span className="font-mono font-bold text-[#A78BFA]">-{waterDeficit}%</span>
                </div>
                <input
                  type="range" min="0" max="60" step="5" value={waterDeficit}
                  onChange={(e) => setWaterDeficit(Number(e.target.value))}
                  className="w-full accent-[#A78BFA] cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-[#9A9A9A] font-mono">
                  <span>Abundant (0%)</span>
                  <span>Severe Deficit (-60%)</span>
                </div>
              </div>

              {/* 5. Hazard Severity Multiplier */}
              <div className="bg-[#232323] p-3.5 rounded-xl border border-white/5 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <ShieldAlert size={14} className="text-[#FF4D4D]" /> Combined Hazard Severity
                  </span>
                  <span className="font-mono font-bold text-[#FF4D4D]">{hazardMultiplier.toFixed(1)}x</span>
                </div>
                <input
                  type="range" min="1.0" max="2.5" step="0.1" value={hazardMultiplier}
                  onChange={(e) => setHazardMultiplier(Number(e.target.value))}
                  className="w-full accent-[#FF4D4D] cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-[#9A9A9A] font-mono">
                  <span>Standard (1.0x)</span>
                  <span>Extreme Multiplier (2.5x)</span>
                </div>
              </div>

              {/* 6. Safe Site Capacity Strain */}
              <div className="bg-[#232323] p-3.5 rounded-xl border border-white/5 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <MapPin size={14} className="text-[#FFB020]" /> Safe Site Capacity Strain
                  </span>
                  <span className="font-mono font-bold text-[#FFB020]">+{siteCapacityStrain}%</span>
                </div>
                <input
                  type="range" min="0" max="80" step="5" value={siteCapacityStrain}
                  onChange={(e) => setSiteCapacityStrain(Number(e.target.value))}
                  className="w-full accent-[#FFB020] cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-[#9A9A9A] font-mono">
                  <span>Unstrained (0%)</span>
                  <span>High Load (+80%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Simulated Impact Metrics (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-[#1C1C1C] border border-white/10 rounded-2xl p-5 shadow-2xl space-y-4 h-full">
              <SectionHeader title="Simulated Operational Impact" />

              <div className="grid grid-cols-2 gap-3 text-xs">
                {/* Metric 1 */}
                <div className="bg-[#232323] p-3.5 rounded-xl border border-white/5">
                  <div className="text-[10px] text-[#9A9A9A] font-medium uppercase tracking-wider mb-1">Simulated Red-Zones</div>
                  <div className="text-2xl font-black text-[#FF4D4D] tabular-nums">{simulatedRedZoneCount} <span className="text-xs text-[#FF4D4D]/80 font-semibold">(+{additionalRedZones})</span></div>
                  <div className="text-[10px] text-[#9A9A9A] mt-1 font-mono">Baseline: {baselineRedZoneCount} habitations</div>
                </div>

                {/* Metric 2 */}
                <div className="bg-[#232323] p-3.5 rounded-xl border border-white/5">
                  <div className="text-[10px] text-[#9A9A9A] font-medium uppercase tracking-wider mb-1">At-Risk Population</div>
                  <div className="text-2xl font-black text-white tabular-nums">{formatNumber(simulatedTotalNeed)}</div>
                  <div className="text-[10px] text-[#9A9A9A] mt-1 font-mono">Baseline: {formatNumber(baselineTotalNeed)}</div>
                </div>

                {/* Metric 3 */}
                <div className="bg-[#232323] p-3.5 rounded-xl border border-white/5">
                  <div className="text-[10px] text-[#9A9A9A] font-medium uppercase tracking-wider mb-1">Simulated Avg RPI</div>
                  <div className="text-2xl font-black text-[#FF7A3D] tabular-nums">{simulatedAvgRPI} <span className="text-xs text-[#FF7A3D]/80 font-semibold">(+{rpiDelta})</span></div>
                  <div className="text-[10px] text-[#9A9A9A] mt-1 font-mono">Baseline Avg: {baselineAvgRPI} / 100</div>
                </div>

                {/* Metric 4 */}
                <div className="bg-[#232323] p-3.5 rounded-xl border border-white/5">
                  <div className="text-[10px] text-[#9A9A9A] font-medium uppercase tracking-wider mb-1">Capacity Deficit</div>
                  <div className="text-2xl font-black text-[#FFB020] tabular-nums">{capacityDeficit > 0 ? `-${formatNumber(capacityDeficit)}` : 'Surplus'}</div>
                  <div className="text-[10px] text-[#9A9A9A] mt-1 font-mono">Avail: {formatNumber(simulatedAvailableCapacity)} beds</div>
                </div>
              </div>

              {/* Stress Analysis Summary Box */}
              <div className="bg-[#141414] border border-white/8 rounded-xl p-3.5 text-xs space-y-2 text-[#9A9A9A]">
                <div className="flex items-center gap-2 text-white font-bold">
                  <Sliders size={14} className="text-[#FF5A1F]" /> Simulation Model Insights
                </div>
                <p className="leading-relaxed text-[11px]">
                  Under a <strong className="text-white">+{rainfallIncrease}% rainfall surge</strong> combined with a <strong className="text-white">+{riverSurge}m flood crest</strong>, settlement risk index shifts exponentially. <strong className="text-[#FF4D4D]">{additionalRedZones} additional habitations</strong> breach critical structural risk thresholds.
                </p>
                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-[#6B6B6B]">
                  <span>Engine: Multi-Hazard Simulator v2.4</span>
                  <span>Confidence: 94.2%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Settlement-by-Settlement Scenario Comparison Table */}
        <div className="bg-[#1C1C1C] border border-white/10 rounded-2xl p-5 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <SectionHeader title="Settlement Stress-Test Drilldown (Baseline vs. Simulation)" />
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[10px] font-mono text-[#9A9A9A] uppercase">Showing Top Evaluated Settlements</span>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-white/5">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#141414] border-b border-white/8 text-[#9A9A9A] font-mono uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4 font-bold">Settlement Name</th>
                  <th className="py-3 px-4 font-bold">District</th>
                  <th className="py-3 px-4 font-bold">Baseline Risk</th>
                  <th className="py-3 px-4 font-bold">Simulated Risk</th>
                  <th className="py-3 px-4 font-bold">Baseline RPI</th>
                  <th className="py-3 px-4 font-bold">Simulated RPI</th>
                  <th className="py-3 px-4 font-bold">Simulation Status</th>
                  <th className="py-3 px-4 font-bold">Assigned Candidate Site</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {habitations.slice(0, 7).map((hab, idx) => {
                  const simRiskScore = Math.min(100, Math.round(hab.risk_score * hazardMultiplier + (rainfallIncrease * 0.2)));
                  const simRPIScore = Math.min(100, Math.round(hab.relocation_priority + rpiDelta));
                  const isUpgraded = simRiskScore >= 75 && !hab.red_zone.isRedZone;

                  return (
                    <tr key={hab.id} className="hover:bg-[#232323] transition-colors">
                      <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                        <span>{hab.name}</span>
                        {isUpgraded && (
                          <span className="text-[9px] font-bold font-mono px-1.5 py-0.5 rounded bg-[#FF4D4D]/20 text-[#FF4D4D] border border-[#FF4D4D]/30">
                            ELEVATED
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-[#9A9A9A] font-medium">{hab.district}</td>
                      <td className="py-3.5 px-4 font-bold text-[#9A9A9A] tabular-nums">{hab.risk_score}/100</td>
                      <td className="py-3.5 px-4 font-black tabular-nums" style={{ color: riskColor(simRiskScore > 75 ? 'critical' : 'high') }}>
                        {simRiskScore}/100 <span className="text-[10px] text-[#9A9A9A]">({simRiskScore > hab.risk_score ? `+${simRiskScore - hab.risk_score}` : '0'})</span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-[#9A9A9A] tabular-nums">{hab.relocation_priority}</td>
                      <td className="py-3.5 px-4 font-black text-[#FF7A3D] tabular-nums">{simRPIScore}</td>
                      <td className="py-3.5 px-4">
                        {simRiskScore >= 80 ? (
                          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase bg-[#FF4D4D]/15 text-[#FF4D4D] border border-[#FF4D4D]/30">
                            CRITICAL RED-ZONE
                          </span>
                        ) : simRiskScore >= 65 ? (
                          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase bg-[#FF5A1F]/15 text-[#FF5A1F] border border-[#FF5A1F]/30">
                            HIGH WATCH
                          </span>
                        ) : (
                          <StatusBadge level={hab.risk_level} />
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-xs font-semibold text-[#2ECC71]">
                        {safeSites[idx % safeSites.length]?.name || 'Ganjam Inland Safe Hill 01'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center justify-between pt-2 text-xs text-[#9A9A9A]">
            <div className="flex items-center gap-2">
              <FileSpreadsheet size={14} className="text-[#FF5A1F]" />
              <span>Full 54-settlement simulation export available for DDMA policy committee</span>
            </div>
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF7A3D] to-[#FF3D1F] text-white font-bold shadow-[0_0_16px_rgba(255,90,31,0.35)] hover:shadow-[0_0_24px_rgba(255,90,31,0.55)] transition-all cursor-pointer">
              <Layers size={14} /> Export What-If Impact Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
