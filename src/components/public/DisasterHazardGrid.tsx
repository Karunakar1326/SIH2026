import { useNavigate } from 'react-router-dom';
import { ArrowRight, Waves, Wind, Mountain, Sun, Activity, AlertTriangle } from 'lucide-react';
import type { ReactNode } from 'react';

export interface DisasterCategory {
  id: string;
  name: string;
  shortName: string;
  icon: ReactNode;
  smallIcon: ReactNode;
  status: 'implemented' | 'planned';
  description: string;
  measuredInputs: string[];
  nexusAssessment: string[];
  accentColor: string;
  borderColor: string;
  caption: string;
  cardGradient: string;
  glowColor: string;
  riskLevel: number;   // 0–1
  accentHex: string;
}

export const disasterCategories: DisasterCategory[] = [
  {
    id: 'cyclone', name: 'Cyclone & Storm Surge', shortName: 'CYCLONE',
    icon: <Wind size={56} />, smallIcon: <Wind size={16} />,
    status: 'implemented',
    description: 'Cat-4/5 cyclonic wind shear, barometric pressure drop, storm surge inundation corridors, and landfall impact modeling.',
    measuredInputs: ['Max Sustained Wind (km/h)', 'Min Central Pressure (hPa)', 'Accumulated Rainfall (mm)', 'Storm Surge Height (m)', 'IMD Doppler Track Data'],
    nexusAssessment: ['Wind Exposure Rating', 'Surge Inundation Zone', 'Red-Zone Classification', 'Relocation Priority (RPI)'],
    accentColor: 'text-blue-400', borderColor: 'border-blue-500/30 hover:border-blue-500',
    caption: 'Cyclonic winds and storm surges threaten millions along India\'s eastern coast.',
    cardGradient: 'from-blue-950/90 via-slate-950/95 to-neutral-950',
    glowColor: 'bg-blue-600/20', riskLevel: 0.92, accentHex: '#4fd1ff',
  },
  {
    id: 'flood', name: 'River & Delta Flood', shortName: 'FLOOD',
    icon: <Waves size={56} />, smallIcon: <Waves size={16} />,
    status: 'implemented',
    description: 'Catchment rainfall volume, river gauge peak discharge, embankment backwater overspill, and 100-year flood inundation.',
    measuredInputs: ['Peak River Discharge (m³/s)', 'Gauge Water Level (m MSL)', 'Flood Water Depth (m)', 'Catchment Rainfall (mm)', 'ISRO CartoDEM Elevation'],
    nexusAssessment: ['Inundation Depth Map', 'Household Submergence', 'Vulnerability Index', 'Safe Site Distance'],
    accentColor: 'text-cyan-400', borderColor: 'border-cyan-500/30 hover:border-cyan-500',
    caption: 'Seasonal monsoon floods submerge delta settlements year after year.',
    cardGradient: 'from-cyan-950/90 via-blue-950/95 to-neutral-950',
    glowColor: 'bg-cyan-600/20', riskLevel: 0.88, accentHex: '#22d3ee',
  },
  {
    id: 'landslide', name: 'Landslide & Debris Flow', shortName: 'LANDSLIDE',
    icon: <Mountain size={56} />, smallIcon: <Mountain size={16} />,
    status: 'implemented',
    description: 'Hill slope gradient, 72-hour antecedent trigger rainfall, rock stability, runout distance, and slope failure hazard.',
    measuredInputs: ['Slope Gradient (°)', 'Trigger Rainfall (mm)', 'Soil Saturation Index', 'Displaced Earth Volume (m³)', 'GSI Landslide Inventory'],
    nexusAssessment: ['Slope Failure Susceptibility', 'Debris Flow Path', 'Community Evacuation Urgency', 'Relocation Priority'],
    accentColor: 'text-emerald-400', borderColor: 'border-emerald-500/30 hover:border-emerald-500',
    caption: 'Saturated slopes collapse without warning, burying roads and homes.',
    cardGradient: 'from-emerald-950/90 via-stone-950/95 to-neutral-950',
    glowColor: 'bg-emerald-600/20', riskLevel: 0.75, accentHex: '#22c55e',
  },
  {
    id: 'coastal-erosion', name: 'Coastal Erosion', shortName: 'EROSION',
    icon: <Activity size={56} />, smallIcon: <Activity size={16} />,
    status: 'implemented',
    description: 'Long-term shoreline retreat rates, sea level rise, wave scour depth, and total land loss along low-lying coastlines.',
    measuredInputs: ['Annual Erosion Rate (m/yr)', 'Total Shoreline Retreat (m)', 'Significant Wave Height (m)', 'Tidal Surge Elevation', 'NCSCM Shoreline Atlas'],
    nexusAssessment: ['Permanent Land Loss Rate', 'Structure Collapse Risk', 'Relocation Urgency (Phase-1)', 'Safe Site Eligibility'],
    accentColor: 'text-purple-400', borderColor: 'border-purple-500/30 hover:border-purple-500',
    caption: 'Rising seas and wave erosion slowly consume coastlines and homes.',
    cardGradient: 'from-purple-950/90 via-slate-950/95 to-neutral-950',
    glowColor: 'bg-purple-600/20', riskLevel: 0.82, accentHex: '#a78bfa',
  },
  {
    id: 'drought', name: 'Agricultural Drought', shortName: 'DROUGHT',
    icon: <Sun size={56} />, smallIcon: <Sun size={16} />,
    status: 'planned',
    description: 'Monsoon rainfall deficit, reservoir storage depletion, groundwater drawdown, and agricultural crop distress.',
    measuredInputs: ['Precipitation Deficit (%)', 'Reservoir Storage Level', 'NDVI Vegetation Index', 'Soil Moisture Index', 'CWC Reservoir Bulletin'],
    nexusAssessment: ['Water Stress Index', 'Agricultural Vulnerability', 'Livelihood Displacement', 'Long-term Water Security'],
    accentColor: 'text-amber-400', borderColor: 'border-amber-500/30 hover:border-amber-500',
    caption: 'Prolonged rainfall deficits destroy livelihoods and drive mass displacement.',
    cardGradient: 'from-amber-950/90 via-orange-950/95 to-neutral-950',
    glowColor: 'bg-amber-600/20', riskLevel: 0.60, accentHex: '#f59e0b',
  },
  {
    id: 'earthquake', name: 'Seismic Risk', shortName: 'SEISMIC',
    icon: <AlertTriangle size={56} />, smallIcon: <AlertTriangle size={16} />,
    status: 'planned',
    description: 'Seismic zonation, peak ground acceleration (PGA), building structural integrity, and post-seismic landslide triggers.',
    measuredInputs: ['Seismic Hazard Zone (II-V)', 'Peak Ground Acceleration (g)', 'Building Type (Kutcha/Pucca)', 'Fault Line Proximity', 'NCS Seismic Network'],
    nexusAssessment: ['Structural Collapse Risk', 'Casualty Susceptibility', 'Emergency Shelter Demand', 'Relocation Site Safety'],
    accentColor: 'text-red-400', borderColor: 'border-red-500/30 hover:border-red-500',
    caption: 'Seismic events compromise structures and trigger cascading secondary disasters.',
    cardGradient: 'from-red-950/90 via-neutral-950/95 to-neutral-950',
    glowColor: 'bg-red-600/20', riskLevel: 0.55, accentHex: '#f87171',
  },
];

// Sparkline for risk level
function RiskBar({ level, color }: { level: number; color: string }) {
  const pct = Math.round(level * 100);
  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 8, color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>RISK INDEX</span>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 8, color, letterSpacing: '0.06em' }}>{pct}%</span>
      </div>
      <div className="hud-risk-bar">
        <div className="hud-risk-fill" style={{ width: `${pct}%`, background: `linear-gradient(to right, ${color}88, ${color})` }} />
      </div>
    </div>
  );
}

export function DisasterHazardGrid() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: '1px',
        border: '1px solid rgba(255,255,255,0.08)',
        background: 'rgba(255,255,255,0.06)',
      }}
    >
      {disasterCategories.map((cat) => (
        <div
          key={cat.id}
          onClick={() => navigate(`/explore/${cat.id}`)}
          className="hud-panel hud-scanline hud-card-hover"
          style={{
            padding: '16px',
            cursor: 'pointer',
            background: '#0a0a0a',
            transition: 'background 0.18s',
            minHeight: '180px',
            display: 'flex',
            flexDirection: 'column',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#0f0f0f'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#0a0a0a'; }}
        >
          {/* Shimmer overlay */}
          <div className="hud-shimmer" />
          {/* HUD corner brackets */}
          <span className="hud-corner-tl" style={{ borderColor: cat.accentHex + '66' }} />
          <span className="hud-corner-tr" style={{ borderColor: cat.accentHex + '66' }} />
          <span className="hud-corner-bl" style={{ borderColor: cat.accentHex + '33' }} />
          <span className="hud-corner-br" style={{ borderColor: cat.accentHex + '33' }} />

          {/* Header row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <span style={{ color: cat.accentHex, display: 'flex' }}>{cat.smallIcon}</span>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fontWeight: 700, color: '#fff', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                {cat.shortName}
              </span>
            </div>
            <span style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 8, textTransform: 'uppercase',
              letterSpacing: '0.08em', padding: '2px 6px',
              border: `1px solid ${cat.status === 'implemented' ? 'rgba(34,197,94,0.35)' : 'rgba(255,255,255,0.12)'}`,
              color: cat.status === 'implemented' ? '#22c55e' : 'rgba(255,255,255,0.3)',
            }}>
              {cat.status === 'implemented' ? '● ACTIVE' : '○ PLANNED'}
            </span>
          </div>

          {/* Label */}
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 8, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.08em', marginBottom: 6, textTransform: 'uppercase' }}>
            // {cat.name}
          </div>

          {/* Caption */}
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.5)', lineHeight: 1.55, flex: 1, margin: 0 }}>
            {cat.caption}
          </p>

          {/* Risk bar */}
          <RiskBar level={cat.riskLevel} color={cat.accentHex} />

          {/* Footer */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginTop: 10 }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: cat.accentHex, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: 4 }}>
              EXPLORE <ArrowRight size={11} />
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
