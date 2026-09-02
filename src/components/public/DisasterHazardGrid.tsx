import { useNavigate } from 'react-router-dom';
import { ArrowRight, Waves, Wind, Mountain, Sun, Activity, AlertTriangle } from 'lucide-react';

export interface DisasterCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  status: 'implemented' | 'planned';
  description: string;
  measuredInputs: string[];
  nexusAssessment: string[];
  accentColor: string;
  borderColor: string;
}

export const disasterCategories: DisasterCategory[] = [
  {
    id: 'cyclone',
    name: 'CYCLONE & STORM SURGE',
    icon: <Wind size={22} />,
    status: 'implemented',
    description: 'Cat-4/5 cyclonic wind shear, barometric pressure drop, storm surge inundation corridors, and landfall impact modeling.',
    measuredInputs: ['Max Sustained Wind (km/h)', 'Min Central Pressure (hPa)', 'Accumulated Rainfall (mm)', 'Storm Surge Height (m)', 'IMD Doppler Track Data'],
    nexusAssessment: ['Wind Exposure Rating', 'Surge Inundation Zone', 'Red-Zone Classification', 'Relocation Priority (RPI)'],
    accentColor: 'text-blue-400',
    borderColor: 'border-blue-500/30 hover:border-blue-500',
  },
  {
    id: 'flood',
    name: 'RIVER & DELTA FLOOD',
    icon: <Waves size={22} />,
    status: 'implemented',
    description: 'Catchment rainfall volume, river gauge peak discharge, embankment backwater overspill, and 100-year flood inundation.',
    measuredInputs: ['Peak River Discharge (m³/s)', 'Gauge Water Level (m MSL)', 'Flood Water Depth (m)', 'Catchment Rainfall (mm)', 'ISRO CartoDEM Elevation'],
    nexusAssessment: ['Inundation Depth Map', 'Household Submergence', 'Vulnerability Index', 'Safe Site Distance'],
    accentColor: 'text-cyan-400',
    borderColor: 'border-cyan-500/30 hover:border-cyan-500',
  },
  {
    id: 'landslide',
    name: 'LANDSLIDE & DEBRIS FLOW',
    icon: <Mountain size={22} />,
    status: 'implemented',
    description: 'Hill slope gradient, 72-hour antecedent trigger rainfall, rock stability, runout distance, and slope failure hazard.',
    measuredInputs: ['Slope Gradient (°)', 'Trigger Rainfall (mm)', 'Soil Saturation Index', 'Displaced Earth Volume (m³)', 'GSI Landslide Inventory'],
    nexusAssessment: ['Slope Failure Susceptibility', 'Debris Flow Path', 'Community Evacuation Urgency', 'Relocation Priority'],
    accentColor: 'text-emerald-400',
    borderColor: 'border-emerald-500/30 hover:border-emerald-500',
  },
  {
    id: 'coastal-erosion',
    name: 'COASTAL EROSION & SUBMERGENCE',
    icon: <Activity size={22} />,
    status: 'implemented',
    description: 'Long-term shoreline retreat rates, sea level rise, wave scour depth, and total land loss along low-lying coastlines.',
    measuredInputs: ['Annual Erosion Rate (m/yr)', 'Total Shoreline Retreat (m)', 'Significant Wave Height (m)', 'Tidal Surge Elevation', 'NCSCM Shoreline Atlas'],
    nexusAssessment: ['Permanent Land Loss Rate', 'Structure Collapse Risk', 'Relocation Urgency (Phase-1)', 'Safe Site Eligibility'],
    accentColor: 'text-purple-400',
    borderColor: 'border-purple-500/30 hover:border-purple-500',
  },
  {
    id: 'drought',
    name: 'AGRICULTURAL & WATER DROUGHT',
    icon: <Sun size={22} />,
    status: 'planned',
    description: 'Monsoon rainfall deficit, reservoir storage depletion, groundwater drawdown, and agricultural crop distress.',
    measuredInputs: ['Precipitation Deficit (%)', 'Reservoir Storage Level', 'NDVI Vegetation Index', 'Soil Moisture Index', 'CWC Reservoir Bulletin'],
    nexusAssessment: ['Water Stress Index', 'Agricultural Vulnerability', 'Livelihood Displacement', 'Long-term Water Security'],
    accentColor: 'text-amber-400',
    borderColor: 'border-amber-500/30 hover:border-amber-500',
  },
  {
    id: 'earthquake',
    name: 'SEISMIC & STRUCTURAL RISK',
    icon: <AlertTriangle size={22} />,
    status: 'planned',
    description: 'Seismic zonation, peak ground acceleration (PGA), building structural integrity, and post-seismic landslide triggers.',
    measuredInputs: ['Seismic Hazard Zone (II-V)', 'Peak Ground Acceleration (g)', 'Building Type (Kutcha/Pucca)', 'Fault Line Proximity', 'NCS Seismic Network'],
    nexusAssessment: ['Structural Collapse Risk', 'Casualty Susceptibility', 'Emergency Shelter Demand', 'Relocation Site Safety'],
    accentColor: 'text-red-400',
    borderColor: 'border-red-500/30 hover:border-red-500',
  },
];

export function DisasterHazardGrid() {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {disasterCategories.map((cat) => (
        <div
          key={cat.id}
          className={`bg-neutral-900 border rounded-lg p-5 flex flex-col justify-between transition-all duration-200 ${cat.borderColor} shadow-sm group hover:shadow-lg`}
        >
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <span className={cat.accentColor}>{cat.icon}</span>
                <h3 className="text-sm font-extrabold tracking-wide text-white">{cat.name}</h3>
              </div>
              <span className={`text-[9.5px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${
                cat.status === 'implemented' ? 'bg-emerald-950 text-emerald-400 border-emerald-800' : 'bg-neutral-800 text-neutral-400 border-neutral-700'
              }`}>
                {cat.status === 'implemented' ? 'MODEL IMPLEMENTED' : 'CAPABILITY PLANNED'}
              </span>
            </div>

            <p className="text-xs text-neutral-300 mb-4 leading-relaxed">{cat.description}</p>

            {/* Measured Inputs */}
            <div className="mb-3">
              <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5 font-mono">
                Measured Inputs & Authoritative Datasets:
              </div>
              <ul className="text-[11px] text-neutral-300 space-y-1 pl-3 list-disc">
                {cat.measuredInputs.slice(0, 3).map((inp, idx) => (
                  <li key={idx}>{inp}</li>
                ))}
              </ul>
            </div>

            {/* NEXUS Assessment */}
            <div className="mb-4 bg-neutral-950 p-2.5 rounded border border-neutral-800">
              <div className="text-[10px] font-bold text-accent uppercase tracking-wider mb-1 font-mono">
                NEXUS Derived Assessment:
              </div>
              <div className="flex flex-wrap gap-1 text-[10px]">
                {cat.nexusAssessment.map((ass, idx) => (
                  <span key={idx} className="bg-neutral-850 text-neutral-300 px-2 py-0.5 rounded border border-neutral-750 font-medium">
                    {ass}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action CTA */}
          <button
            onClick={() => navigate(`/explore/${cat.id}`)}
            className="w-full py-2 bg-neutral-800 hover:bg-neutral-750 text-white rounded text-xs font-bold transition-colors flex items-center justify-center gap-1.5 border border-neutral-700 cursor-pointer"
          >
            <span>Explore {cat.name.split(' ')[0]} Analysis</span>
            <ArrowRight size={13} className="text-neutral-400 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      ))}
    </div>
  );
}
