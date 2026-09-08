import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, SectionHeader } from '@/components/shared';
import { safeSites } from '@/data/safe-sites';
import { habitations } from '@/data/habitations';
import { formatNumber } from '@/utils/helpers';
import {
  ArrowRight, Building2, MapPin, Users,
  CheckCircle, XCircle, AlertTriangle, Route
} from 'lucide-react';

export function CapacityAccessibility() {
  const navigate = useNavigate();
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null);

  const suitableSites = safeSites.filter(s => s.status === 'suitable');
  const totalCapacity = suitableSites.reduce((s, site) => s + site.carrying_capacity.estimated_sustainable_capacity, 0);
  const totalNeed = habitations.filter(h => h.relocation_urgency === 'immediate' || h.relocation_urgency === 'short-term').reduce((s, h) => s + h.population, 0);
  const remainingCapacity = Math.max(0, totalCapacity - totalNeed);

  const selectedSite = selectedSiteId ? safeSites.find(s => s.id === selectedSiteId) : null;
  const targetHab = selectedSite ? habitations.find(h => h.id === selectedSite.target_habitation_id) : null;

  return (
    <div className="flex flex-col h-full bg-[#141414] text-[#F5F5F5] overflow-hidden">
      <PageHeader
        title="Shelter Capacity & Accessibility"
        subtitle="Can the identified safe locations actually handle the affected population?"
        actions={
          <button
            onClick={() => navigate('/workspace/planner')}
            className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF7A3D] to-[#FF3D1F] text-white shadow-[0_0_20px_rgba(255,90,31,0.4)] hover:shadow-[0_0_28px_rgba(255,90,31,0.55)] transition-all cursor-pointer"
          >
            Relocation Planner <ArrowRight size={13} />
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
        {/* Capacity Summary KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-[#1C1C1C] border border-white/8 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-semibold text-[#9A9A9A] uppercase tracking-wider">Total Capacity</span>
              <span className="p-1.5 rounded-xl bg-[#232323] text-[#2ECC71] border border-white/5"><Building2 size={14} /></span>
            </div>
            <span className="text-2xl font-black text-[#2ECC71] tabular-nums">{formatNumber(totalCapacity)}</span>
          </div>
          <div className="bg-[#1C1C1C] border border-white/8 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-semibold text-[#9A9A9A] uppercase tracking-wider">Total Need</span>
              <span className="p-1.5 rounded-xl bg-[#232323] text-[#FF4D4D] border border-white/5"><Users size={14} /></span>
            </div>
            <span className="text-2xl font-black text-[#FF4D4D] tabular-nums">{formatNumber(totalNeed)}</span>
          </div>
          <div className="bg-[#1C1C1C] border border-white/8 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-semibold text-[#9A9A9A] uppercase tracking-wider">Remaining Capacity</span>
              <span className="p-1.5 rounded-xl bg-[#232323] text-[#FFB020] border border-white/5"><MapPin size={14} /></span>
            </div>
            <span className="text-2xl font-black text-[#FFB020] tabular-nums">{formatNumber(remainingCapacity)}</span>
          </div>
          <div className="bg-[#1C1C1C] border border-white/8 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-semibold text-[#9A9A9A] uppercase tracking-wider">Suitable Sites</span>
              <span className="p-1.5 rounded-xl bg-[#232323] text-[#2ECC71] border border-white/5"><CheckCircle size={14} /></span>
            </div>
            <span className="text-2xl font-black text-white tabular-nums">{suitableSites.length}</span>
          </div>
        </div>

        {/* Shelter Capacity Table */}
        <div className="bg-[#1C1C1C] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-white/8">
            <SectionHeader
              title="Shelter & Safe Location Register"
              subtitle="Capacity, accessibility, and essential facilities for each candidate location"
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#141414] border-b border-white/8">
                <tr>
                  <th className="py-3 px-4 font-bold text-[#9A9A9A] uppercase text-[10px]">Location</th>
                  <th className="py-3 px-4 font-bold text-[#9A9A9A] uppercase text-[10px]">Status</th>
                  <th className="py-3 px-4 font-bold text-[#9A9A9A] uppercase text-[10px]">Total Capacity</th>
                  <th className="py-3 px-4 font-bold text-[#9A9A9A] uppercase text-[10px]">Assigned Pop.</th>
                  <th className="py-3 px-4 font-bold text-[#9A9A9A] uppercase text-[10px]">Remaining</th>
                  <th className="py-3 px-4 font-bold text-[#9A9A9A] uppercase text-[10px]">Distance</th>
                  <th className="py-3 px-4 font-bold text-[#9A9A9A] uppercase text-[10px]">Road Access</th>
                  <th className="py-3 px-4 font-bold text-[#9A9A9A] uppercase text-[10px]">Facilities</th>
                  <th className="py-3 px-4 font-bold text-[#9A9A9A] uppercase text-[10px]">Safety Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {safeSites.map(site => {
                  const hab = habitations.find(h => h.id === site.target_habitation_id);
                  const isSuitable = site.status === 'suitable';
                  const assignedPop = hab?.population ?? 0;
                  const remaining = Math.max(0, site.carrying_capacity.estimated_sustainable_capacity - assignedPop);
                  const facilityCount = Object.values(site.infrastructure).filter(Boolean).length;
                  const totalFacilities = Object.keys(site.infrastructure).length;

                  return (
                    <tr
                      key={site.id}
                      onClick={() => setSelectedSiteId(site.id === selectedSiteId ? null : site.id)}
                      className={`hover:bg-[#232323] cursor-pointer transition-colors ${
                        selectedSiteId === site.id ? 'bg-[#FF5A1F]/10' : ''
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div className="font-bold text-white">{site.name}</div>
                        <div className="text-[10px] text-[#6B6B6B] font-mono mt-0.5">
                        Elev: {site.elevation_m}m
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {isSuitable ? (
                          <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#2ECC71]/15 text-[#2ECC71] border border-[#2ECC71]/30">
                            <CheckCircle size={10} /> SUITABLE
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FF4D4D]/15 text-[#FF4D4D] border border-[#FF4D4D]/30">
                            <XCircle size={10} /> REJECTED
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-bold text-white tabular-nums">
                        {formatNumber(site.carrying_capacity.estimated_sustainable_capacity)}
                      </td>
                      <td className="py-3 px-4 text-[#9A9A9A] tabular-nums">
                        {hab ? formatNumber(assignedPop) : '—'}
                      </td>
                      <td className="py-3 px-4 font-bold tabular-nums" style={{ color: remaining > 0 ? '#2ECC71' : '#FF4D4D' }}>
                        {isSuitable ? formatNumber(remaining) : '—'}
                      </td>
                      <td className="py-3 px-4 text-[#9A9A9A] tabular-nums">
                        {site.distance_from_habitation_km} km
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          site.infrastructure.road
                            ? 'bg-[#2ECC71]/15 text-[#2ECC71] border border-[#2ECC71]/30'
                            : 'bg-[#FF4D4D]/15 text-[#FF4D4D] border border-[#FF4D4D]/30'
                        }`}>
                          {site.infrastructure.road ? '✓ Accessible' : '✗ Limited'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[#9A9A9A] font-mono text-[10px]">
                        {facilityCount}/{totalFacilities}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-black text-white tabular-nums">{site.safety_score}</span>
                        <span className="text-[#6B6B6B]">/100</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Site Detail */}
        {selectedSite && selectedSite.status === 'suitable' && (
          <div className="bg-[#1C1C1C] border border-white/10 rounded-2xl p-5 shadow-2xl animate-fade-in">
            <SectionHeader
              title={`${selectedSite.name} — Detailed Capacity Breakdown`}
              subtitle="Infrastructure dimension analysis and bottleneck identification"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                {[
                  { label: 'Buildable Land', val: `${selectedSite.carrying_capacity.buildable_land_sqkm} sqkm` },
                  { label: 'Housing Capacity', val: `${formatNumber(selectedSite.carrying_capacity.housing_capacity)} units` },
                  { label: 'Water Supply', val: `${formatNumber(selectedSite.carrying_capacity.water_capacity_people)} people` },
                  { label: 'Sanitation', val: `${formatNumber(selectedSite.carrying_capacity.sanitation_capacity_people)} people` },
                  { label: 'Electricity Grid', val: `${formatNumber(selectedSite.carrying_capacity.electricity_capacity_people)} people` },
                  { label: 'Healthcare', val: `${formatNumber(selectedSite.carrying_capacity.healthcare_capacity_people)} people` },
                  { label: 'Education', val: `${formatNumber(selectedSite.carrying_capacity.education_capacity_students)} students` },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between py-2 px-3 rounded-xl bg-[#232323] border border-white/5 text-xs">
                    <span className="text-[#9A9A9A]">{item.label}</span>
                    <span className="font-bold text-white tabular-nums">{item.val}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                <div className="bg-[#FFB020]/10 border border-[#FFB020]/30 rounded-xl p-4 text-xs">
                  <div className="font-bold text-[#FFB020] mb-1 flex items-center gap-1.5">
                    <AlertTriangle size={14} />
                    Bottleneck Dimension
                  </div>
                  <span className="text-sm font-black text-white">{selectedSite.carrying_capacity.bottleneck_dimension}</span>
                </div>

                {selectedSite.carrying_capacity.environmental_constraints.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-[11px] font-bold text-[#9A9A9A] uppercase tracking-wider">Environmental Constraints</div>
                    {selectedSite.carrying_capacity.environmental_constraints.map((c, i) => (
                      <div key={i} className="p-2.5 bg-[#FFB020]/10 border border-[#FFB020]/30 rounded-xl text-[11px] text-[#FFB020] flex items-start gap-2">
                        <AlertTriangle size={12} className="shrink-0 mt-0.5" />
                        <span>{c}</span>
                      </div>
                    ))}
                  </div>
                )}

                {targetHab && (
                  <div className="bg-[#232323] border border-white/8 rounded-xl p-3.5 text-xs space-y-1.5">
                    <div className="font-bold text-white">Assigned Target Population</div>
                    <div className="flex justify-between text-[#9A9A9A]">
                      <span>Settlement:</span>
                      <span className="font-bold text-white">{targetHab.name}</span>
                    </div>
                    <div className="flex justify-between text-[#9A9A9A]">
                      <span>Population:</span>
                      <span className="font-bold text-white tabular-nums">{formatNumber(targetHab.population)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Workflow Prompt */}
        <div className="bg-[#1C1C1C] border border-white/10 rounded-2xl p-5 shadow-2xl flex items-center justify-between">
          <div>
            <div className="text-sm font-bold text-white">Ready to plan the relocation?</div>
            <div className="text-xs text-[#9A9A9A] mt-1">Generate the final relocation plan with population-to-site matching</div>
          </div>
          <button
            onClick={() => navigate('/workspace/planner')}
            className="flex items-center gap-2 text-xs font-bold px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF7A3D] to-[#FF3D1F] text-white shadow-[0_0_20px_rgba(255,90,31,0.35)] hover:shadow-[0_0_28px_rgba(255,90,31,0.55)] transition-all cursor-pointer shrink-0"
          >
            <Route size={14} /> Relocation Planner <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
