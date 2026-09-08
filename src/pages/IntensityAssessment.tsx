import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, SectionHeader } from '@/components/shared';
import { currentConditions } from '@/data/alerts';
import { historicalEvents } from '@/data/historical-events';
import { hazardLabel, hazardIcon } from '@/utils/helpers';
import { ArrowRight } from 'lucide-react';

type IntensityHazard = 'cyclone' | 'flood' | 'landslide' | 'extreme_rainfall';

const hazardOptions: { id: IntensityHazard; label: string; icon: string }[] = [
  { id: 'cyclone', label: 'Cyclone', icon: '🌀' },
  { id: 'flood', label: 'Flood', icon: '🌊' },
  { id: 'landslide', label: 'Landslide', icon: '⛰️' },
  { id: 'extreme_rainfall', label: 'Extreme Rainfall', icon: '⛈️' },
];

// Intensity indicators per hazard type
const intensityData: Record<IntensityHazard, { label: string; value: string | number; unit: string; tooltip: string; severity: 'low' | 'moderate' | 'high' | 'critical' }[]> = {
  cyclone: [
    { label: 'Sustained Wind Speed', value: currentConditions.wind_kmh, unit: 'km/h', tooltip: 'IMD maximum 3-minute sustained wind speed', severity: 'critical' },
    { label: 'Central Pressure', value: currentConditions.pressure_hpa, unit: 'hPa', tooltip: 'IMD barometric minimum central pressure', severity: 'high' },
    { label: 'Accumulated Rainfall', value: currentConditions.rainfall_mm, unit: 'mm', tooltip: 'IMD 24-hour rainfall accumulation', severity: 'critical' },
    { label: 'Expected Storm Surge', value: '3.5-4.5', unit: 'm', tooltip: 'INCOIS storm surge model estimate above astronomical tide', severity: 'critical' },
    { label: 'Translation Speed', value: 18, unit: 'km/h', tooltip: 'Cyclone center movement speed', severity: 'moderate' },
    { label: 'IMD Classification', value: 'Very Severe', unit: '', tooltip: 'IMD tropical cyclone category', severity: 'critical' },
  ],
  flood: [
    { label: 'Catchment Rainfall', value: 185, unit: 'mm', tooltip: 'CWC cumulative upstream catchment rainfall', severity: 'high' },
    { label: 'River Level (Naraj)', value: 25.95, unit: 'm MSL', tooltip: 'CWC gauge level at Naraj station', severity: 'high' },
    { label: 'Danger Level', value: 26.41, unit: 'm MSL', tooltip: 'CWC official danger mark', severity: 'critical' },
    { label: 'Peak Discharge', value: '42,300', unit: 'm³/s', tooltip: 'CWC maximum river flow volume', severity: 'high' },
    { label: 'Expected Inundation', value: '1.5-2.0', unit: 'm', tooltip: 'Expected flood water depth in low-lying areas', severity: 'high' },
    { label: 'Flood Duration Est.', value: '48-72', unit: 'hours', tooltip: 'Expected flood duration from onset to recession', severity: 'moderate' },
  ],
  landslide: [
    { label: 'Antecedent Rainfall (72hr)', value: 185, unit: 'mm', tooltip: 'GSI cumulative 72-hour antecedent rainfall', severity: 'high' },
    { label: 'Soil Saturation', value: 92, unit: '%', tooltip: 'GSI soil moisture saturation level', severity: 'critical' },
    { label: 'Slope Gradient', value: 28, unit: '°', tooltip: 'ISRO CartoDEM average slope gradient', severity: 'moderate' },
    { label: 'Terrain Condition', value: 'Saturated', unit: '', tooltip: 'GSI terrain stability classification', severity: 'high' },
    { label: 'Landslide Susceptibility', value: 'High', unit: '', tooltip: 'GSI susceptibility zone classification', severity: 'high' },
  ],
  extreme_rainfall: [
    { label: '1-hour Peak Rainfall', value: 85, unit: 'mm', tooltip: 'IMD peak 1-hour rainfall intensity', severity: 'critical' },
    { label: '3-hour Rainfall', value: 145, unit: 'mm', tooltip: 'IMD 3-hour cumulative rainfall', severity: 'high' },
    { label: '24-hour Rainfall', value: currentConditions.rainfall_mm, unit: 'mm', tooltip: 'IMD 24-hour rainfall (>204.5mm = Extremely Heavy)', severity: 'critical' },
    { label: 'Peak Intensity Rate', value: 92, unit: 'mm/hr', tooltip: 'Instantaneous rain rate', severity: 'critical' },
    { label: 'IMD Category', value: 'Extremely Heavy', unit: '', tooltip: 'IMD rainfall classification (>204.5mm/24hr)', severity: 'critical' },
  ],
};

function severityColor(s: string) {
  if (s === 'critical') return '#FF4D4D';
  if (s === 'high') return '#FF5A1F';
  if (s === 'moderate') return '#FFB020';
  return '#2ECC71';
}

export function IntensityAssessment() {
  const navigate = useNavigate();
  const [selectedHazard, setSelectedHazard] = useState<IntensityHazard>('cyclone');

  const metrics = intensityData[selectedHazard];

  // Find a relevant historical event for comparison
  const historicalComparison = historicalEvents.find(e => e.hazard_type === selectedHazard);

  return (
    <div className="flex flex-col h-full bg-[#141414] text-[#F5F5F5] overflow-hidden">
      <PageHeader
        title="Hazard Intensity Assessment"
        subtitle="How intense could this event become? — Hazard-specific severity analysis"
        actions={
          <button
            onClick={() => navigate('/workspace/risk-map')}
            className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF7A3D] to-[#FF3D1F] text-white shadow-[0_0_20px_rgba(255,90,31,0.4)] hover:shadow-[0_0_28px_rgba(255,90,31,0.55)] transition-all cursor-pointer"
          >
            Dynamic Risk Map <ArrowRight size={13} />
          </button>
        }
      />

      {/* Hazard Type Selector */}
      <div className="px-6 py-3 bg-[#141414] border-b border-white/8 flex items-center gap-3 shrink-0">
        <label className="text-[10px] font-bold text-[#9A9A9A] uppercase tracking-wider">Hazard Type:</label>
        <div className="flex items-center gap-2">
          {hazardOptions.map(opt => (
            <button
              key={opt.id}
              onClick={() => setSelectedHazard(opt.id)}
              className={`flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl border transition-all cursor-pointer ${
                selectedHazard === opt.id
                  ? 'bg-[#FF5A1F]/15 border-[#FF5A1F] text-white shadow-[0_0_12px_rgba(255,90,31,0.2)]'
                  : 'border-white/8 bg-[#1C1C1C] text-[#9A9A9A] hover:text-white hover:bg-[#232323]'
              }`}
            >
              <span>{opt.icon}</span>
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
        {/* Intensity Indicators */}
        <div className="bg-[#1C1C1C] border border-white/10 rounded-2xl p-5 shadow-2xl">
          <SectionHeader
            title={`${hazardLabel(selectedHazard)} Intensity Parameters`}
            subtitle="Current observed and forecast values from authoritative agencies"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 mt-4">
            {metrics.map((metric, i) => (
              <div key={i} className="bg-[#232323] border border-white/8 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] text-[#9A9A9A] font-medium">{metric.label}</span>
                  <span
                    className="text-[9px] font-bold px-2 py-0.5 rounded-full border"
                    style={{
                      color: severityColor(metric.severity),
                      backgroundColor: `${severityColor(metric.severity)}15`,
                      borderColor: `${severityColor(metric.severity)}40`,
                    }}
                  >
                    {metric.severity.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-black text-white tabular-nums">{metric.value}</span>
                  {metric.unit && <span className="text-xs text-[#9A9A9A]">{metric.unit}</span>}
                </div>
                <div className="text-[10px] text-[#6B6B6B] mt-1.5 leading-tight">{metric.tooltip}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Severity Classification */}
        <div className="bg-[#1C1C1C] border border-white/10 rounded-2xl p-5 shadow-2xl">
          <SectionHeader
            title="Severity Classification"
            subtitle="Overall hazard intensity assessment"
          />
          <div className="grid grid-cols-4 gap-3 mt-4">
            {[
              { level: 'Low', color: '#2ECC71', active: false },
              { level: 'Moderate', color: '#FFB020', active: false },
              { level: 'High', color: '#FF5A1F', active: selectedHazard !== 'cyclone' },
              { level: 'Severe / Critical', color: '#FF4D4D', active: selectedHazard === 'cyclone' },
            ].map((item, i) => (
              <div
                key={i}
                className={`rounded-xl p-4 text-center border-2 transition-all ${
                  item.active
                    ? `border-[${item.color}] shadow-[0_0_20px_${item.color}40]`
                    : 'border-white/5 opacity-40'
                }`}
                style={item.active ? { borderColor: item.color, boxShadow: `0 0 20px ${item.color}40` } : {}}
              >
                <div
                  className="w-4 h-4 rounded-full mx-auto mb-2"
                  style={{ backgroundColor: item.color }}
                />
                <div className="text-xs font-bold text-white">{item.level}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Historical Comparison */}
        {historicalComparison && (
          <div className="bg-[#1C1C1C] border border-white/10 rounded-2xl p-5 shadow-2xl">
            <SectionHeader
              title="Historical Comparison"
              subtitle={`Current parameters vs. ${historicalComparison.name} (${new Date(historicalComparison.date).getFullYear()})`}
            />
            <div className="mt-4 bg-[#232323] border border-white/8 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{hazardIcon(historicalComparison.hazard_type)}</span>
                <div>
                  <div className="text-sm font-bold text-white">{historicalComparison.name}</div>
                  <div className="text-[10px] text-[#9A9A9A] font-mono">
                    {historicalComparison.location} · {new Date(historicalComparison.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                </div>
              </div>
              <p className="text-xs text-[#9A9A9A] leading-relaxed">{historicalComparison.description}</p>
              <div className="mt-3 text-[10px] text-[#6B6B6B] font-mono">
                Similarity to current conditions: <strong className="text-[#FF5A1F]">{currentConditions.similarity_to_historical}% match</strong>
              </div>
            </div>
          </div>
        )}

        {/* Workflow Prompt */}
        <div className="bg-[#1C1C1C] border border-white/10 rounded-2xl p-5 shadow-2xl flex items-center justify-between">
          <div>
            <div className="text-sm font-bold text-white">See where this creates risk</div>
            <div className="text-xs text-[#9A9A9A] mt-1">View the Dynamic Risk Map to identify impacted areas and risk levels</div>
          </div>
          <button
            onClick={() => navigate('/workspace/risk-map')}
            className="flex items-center gap-2 text-xs font-bold px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF7A3D] to-[#FF3D1F] text-white shadow-[0_0_20px_rgba(255,90,31,0.35)] hover:shadow-[0_0_28px_rgba(255,90,31,0.55)] transition-all cursor-pointer shrink-0"
          >
            Dynamic Risk Map <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
