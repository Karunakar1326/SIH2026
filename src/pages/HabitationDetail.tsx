import { useParams, useNavigate } from 'react-router-dom';
import { habitations } from '@/data/habitations';
import { relocationAssignments } from '@/data/relocation-assignments';
import { PageHeader, StatusBadge, HazardScoreBar, EmptyState } from '@/components/shared';
import { RedZoneBadge } from '@/components/shared/RedZoneBadge';
import { DataProvenancePanel } from '@/components/shared/DataProvenancePanel';
import { ExplainableDecisionCard } from '@/components/shared/ExplainableDecisionCard';
import { RiskMap } from '@/components/map/RiskMap';
import { formatNumber, urgencyLabel, urgencyColor } from '@/utils/helpers';
import { MapPin, Users, Home, Mountain, Layers, Search } from 'lucide-react';

export function HabitationDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const hab = habitations.find(h => h.id === id);

  if (!hab) {
    return (
      <div className="flex flex-col h-full bg-[#141414] text-[#F5F5F5]">
        <PageHeader title="Habitation Not Found" />
        <EmptyState title="Settlement Record Not Found" description="The habitation ID requested does not exist in the DDMA register." />
      </div>
    );
  }

  const assignment = relocationAssignments.find(a => a.habitationId === hab.id);

  return (
    <div className="flex flex-col h-full bg-[#141414] text-[#F5F5F5] overflow-hidden">
      <PageHeader
        title={`${hab.name} — 360° Intelligence Profile`}
        subtitle={`${hab.district} District, ${hab.state} State · Authoritative Settlement Profile`}
        actions={
          <div className="flex items-center gap-2">
            <RedZoneBadge redZone={hab.red_zone} size="md" />
            <StatusBadge level={hab.risk_level} />
            <button
              onClick={() => navigate('/workspace/safe-sites')}
              className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF7A3D] to-[#FF3D1F] text-white shadow-[0_0_16px_rgba(255,90,31,0.35)] hover:shadow-[0_0_24px_rgba(255,90,31,0.55)] transition-all cursor-pointer"
            >
              <Search size={13} /> Find Safe Sites
            </button>
          </div>
        }
      />

      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 px-6 py-4">
          {/* Left Column: Settlement Location & Red-Zone Status */}
          <div className="space-y-4">
            {/* Location Specs */}
            <div className="bg-[#1C1C1C] border border-white/10 rounded-2xl p-5 shadow-2xl">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Settlement Location & Attributes</h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                {[
                  { icon: <MapPin size={13} className="text-[#FF5A1F]" />, label: 'GPS Coords', value: `${hab.coordinates.lat}°, ${hab.coordinates.lng}°` },
                  { icon: <Users size={13} className="text-[#FF5A1F]" />, label: 'Population', value: formatNumber(hab.population) },
                  { icon: <Home size={13} className="text-[#FF5A1F]" />, label: 'Households', value: formatNumber(hab.households) },
                  { icon: <Layers size={13} className="text-[#FF5A1F]" />, label: 'Land Area', value: `${hab.area_sqkm} km²` },
                  { icon: <Mountain size={13} className="text-[#FF5A1F]" />, label: 'Elevation MSL', value: `${hab.elevation_m} m` },
                  { icon: <Users size={13} className="text-[#FF5A1F]" />, label: 'Pop Density', value: `${hab.population_density}/km²` },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5 bg-[#232323] p-2.5 rounded-xl border border-white/5">
                    <span className="mt-0.5">{item.icon}</span>
                    <div>
                      <div className="text-[9px] text-[#9A9A9A] font-medium">{item.label}</div>
                      <div className="text-xs font-bold text-white tabular-nums">{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Red Zone Trigger Analysis */}
            <div className="bg-[#1C1C1C] border border-white/10 rounded-2xl p-5 shadow-2xl">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Red-Zone Classification Analysis</h3>
              <RedZoneBadge redZone={hab.red_zone} size="lg" />
              <p className="text-xs text-[#F5F5F5] font-medium mt-3 leading-relaxed bg-[#232323] p-3 rounded-xl border border-white/5">
                {hab.red_zone.primaryTrigger}
              </p>
            </div>

            {/* Relocation Priority Breakdown */}
            <div className="bg-[#1C1C1C] border border-white/10 rounded-2xl p-5 shadow-2xl">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Relocation Priority Index (RPI)</h3>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${urgencyColor(hab.relocation_urgency)} uppercase`}>
                  {urgencyLabel(hab.relocation_urgency)}
                </span>
              </div>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-3xl font-black text-white tabular-nums">{hab.relocation_priority}</span>
                <span className="text-xs text-[#9A9A9A] font-bold">/100 RPI Score</span>
              </div>
              <div className="space-y-2.5 text-xs">
                {[
                  { label: 'Hazard Severity (30%)', score: Math.round(hab.risk_score * 0.3), max: 30 },
                  { label: 'Population Exposure (25%)', score: Math.round(hab.vulnerability_factors.population_exposure * 0.25), max: 25 },
                  { label: 'Vulnerability Index (20%)', score: Math.round(hab.vulnerability_score * 0.2), max: 20 },
                  { label: 'Historical Recurrence (15%)', score: Math.min(Math.round(hab.historical_event_count * 1.5), 15), max: 15 },
                  { label: 'Infrastructure Deficit (10%)', score: Math.round((100 - hab.vulnerability_factors.infrastructure_resilience) * 0.1), max: 10 },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-[#9A9A9A] font-medium">{item.label}</span>
                      <span className="font-bold text-white tabular-nums">{item.score}/{item.max}</span>
                    </div>
                    <div className="h-1.5 bg-[#232323] rounded-full overflow-hidden border border-white/5">
                      <div className="h-full bg-gradient-to-r from-[#FF7A3D] to-[#FF3D1F] rounded-full" style={{ width: `${(item.score / item.max) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Middle Column: Hazard Profile & Data Provenance */}
          <div className="space-y-4">
            {/* Multi Hazard Profile */}
            <div className="bg-[#1C1C1C] border border-white/10 rounded-2xl p-5 shadow-2xl">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Multi-Hazard Score Profile</h3>
              <div className="space-y-2.5">
                <HazardScoreBar label="🌊 Flood (CWC)" score={hab.hazard_scores.flood} />
                <HazardScoreBar label="🌀 Cyclone (IMD)" score={hab.hazard_scores.cyclone} />
                <HazardScoreBar label="⛰️ Landslide (GSI)" score={hab.hazard_scores.landslide} />
                <HazardScoreBar label="⛈️ Extreme Rainfall (IMD)" score={hab.hazard_scores.extreme_rainfall} />
                <HazardScoreBar label="🏖️ Coastal Erosion (NCSCM)" score={hab.hazard_scores.coastal_erosion} />
              </div>
            </div>

            {/* Vulnerability Index */}
            <div className="bg-[#1C1C1C] border border-white/10 rounded-2xl p-5 shadow-2xl">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Vulnerability Sub-Indicators</h3>
              <div className="space-y-2.5">
                {Object.entries(hab.vulnerability_factors).map(([key, val]) => (
                  <HazardScoreBar key={key} label={key.replace(/_/g, ' ').toUpperCase()} score={val} />
                ))}
              </div>
            </div>

            {/* Complete Data Provenance Drilldown */}
            <DataProvenancePanel
              scoreTitle={`${hab.name} Multi-Hazard Risk`}
              scoreValue={hab.risk_score}
              factors={hab.red_zone.triggerFactors}
              provenanceMap={hab.provenance}
            />
          </div>

          {/* Right Column: GIS Map & Recommendation Card */}
          <div className="space-y-4">
            {/* GIS Map Location */}
            <div className="bg-[#1C1C1C] border border-white/10 rounded-2xl overflow-hidden h-64 shadow-2xl border-white/10">
              <RiskMap
                center={[hab.coordinates.lng, hab.coordinates.lat]}
                zoom={11}
                height="100%"
                showControls={false}
                showLegend={false}
                showLayerPanel={false}
                highlightHabitationId={hab.id}
              />
            </div>

            {/* Explainable Relocation Recommendation Card */}
            {assignment ? (
              <ExplainableDecisionCard assignment={assignment} />
            ) : (
              <div className="bg-[#1C1C1C] border border-white/10 rounded-2xl p-5 text-xs text-[#9A9A9A]">
                No formal relocation assignment generated yet. Click "Find Safe Sites" to run optimization.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
