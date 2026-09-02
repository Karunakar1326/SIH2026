import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/shared';
import { RedZoneBadge } from '@/components/shared/RedZoneBadge';
import { habitations } from '@/data/habitations';
import { hazardLabel, riskColor, formatNumber, urgencyLabel, urgencyColor } from '@/utils/helpers';
import type { RiskLevel, HazardType } from '@/data/types';
import { Search, ArrowUpDown, ChevronRight, ShieldAlert, Building2 } from 'lucide-react';

type SortField = 'risk_score' | 'vulnerability_score' | 'population' | 'relocation_priority';

export function Habitations() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState<RiskLevel | 'all'>('all');
  const [hazardFilter, setHazardFilter] = useState<HazardType | 'all'>('all');
  const [redZoneOnly, setRedZoneOnly] = useState(false);
  const [sortField, setSortField] = useState<SortField>('risk_score');
  const [sortAsc, setSortAsc] = useState(false);

  const filtered = useMemo(() => {
    let result = habitations;
    if (search) result = result.filter(h => h.name.toLowerCase().includes(search.toLowerCase()) || h.district.toLowerCase().includes(search.toLowerCase()));
    if (riskFilter !== 'all') result = result.filter(h => h.risk_level === riskFilter);
    if (hazardFilter !== 'all') result = result.filter(h => h.most_frequent_hazard === hazardFilter);
    if (redZoneOnly) result = result.filter(h => h.red_zone.isRedZone);
    result = [...result].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      return sortAsc ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });
    return result;
  }, [search, riskFilter, hazardFilter, redZoneOnly, sortField, sortAsc]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortAsc(!sortAsc);
    else { setSortField(field); setSortAsc(false); }
  };

  const SortHeader = ({ field, label }: { field: SortField; label: string }) => (
    <th
      onClick={() => toggleSort(field)}
      className="text-left text-[10px] font-bold text-[#9A9A9A] uppercase tracking-wider py-3 px-3 cursor-pointer hover:text-white select-none transition-colors"
    >
      <span className="inline-flex items-center gap-1">
        {label}
        <ArrowUpDown size={10} className={sortField === field ? 'text-[#FF5A1F]' : 'text-[#6B6B6B]'} />
      </span>
    </th>
  );

  return (
    <div className="flex flex-col h-full bg-[#141414] text-[#F5F5F5] overflow-hidden">
      <PageHeader title="Habitations Register" subtitle={`${habitations.length} settlements evaluated across all coastal districts`} />

      {/* Filters Toolbar */}
      <div className="px-6 py-3 bg-[#141414] border-b border-white/8 flex items-center gap-4 flex-wrap text-[#F5F5F5]">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9A9A9A]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search settlement name or district..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-white/10 rounded-xl bg-[#232323] text-white focus:outline-none focus:ring-1 focus:ring-[#FF5A1F]"
          />
        </div>

        <label className="flex items-center gap-1.5 text-xs font-bold text-[#FF4D4D] bg-[#FF4D4D]/10 border border-[#FF4D4D]/30 px-3 py-1.5 rounded-xl cursor-pointer">
          <ShieldAlert size={14} className="text-[#FF4D4D]" />
          <span>Red-Zones Only</span>
          <input
            type="checkbox"
            checked={redZoneOnly}
            onChange={(e) => setRedZoneOnly(e.target.checked)}
            className="rounded border-white/20 text-[#FF4D4D] focus:ring-[#FF4D4D] w-3.5 h-3.5 ml-1 bg-[#232323]"
          />
        </label>

        <select value={riskFilter} onChange={(e) => setRiskFilter(e.target.value as RiskLevel | 'all')} className="text-xs border border-white/10 rounded-xl px-3 py-1.5 bg-[#232323] text-white focus:outline-none focus:ring-1 focus:ring-[#FF5A1F] font-semibold">
          <option value="all" className="bg-[#1C1C1C]">All Risk Severity</option>
          <option value="critical" className="bg-[#1C1C1C]">Critical Risk</option>
          <option value="high" className="bg-[#1C1C1C]">High Risk</option>
          <option value="moderate" className="bg-[#1C1C1C]">Moderate Risk</option>
          <option value="low" className="bg-[#1C1C1C]">Low Risk</option>
        </select>

        <select value={hazardFilter} onChange={(e) => setHazardFilter(e.target.value as HazardType | 'all')} className="text-xs border border-white/10 rounded-xl px-3 py-1.5 bg-[#232323] text-white focus:outline-none focus:ring-1 focus:ring-[#FF5A1F] font-semibold">
          <option value="all" className="bg-[#1C1C1C]">All Hazard Categories</option>
          <option value="cyclone" className="bg-[#1C1C1C]">Cyclone</option>
          <option value="flood" className="bg-[#1C1C1C]">Flood</option>
          <option value="landslide" className="bg-[#1C1C1C]">Landslide</option>
          <option value="extreme_rainfall" className="bg-[#1C1C1C]">Extreme Rainfall</option>
          <option value="coastal_erosion" className="bg-[#1C1C1C]">Coastal Erosion</option>
        </select>

        <span className="text-xs text-[#9A9A9A] font-mono ml-auto">Showing {filtered.length} settlements</span>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto px-6 py-4">
        <div className="bg-[#1C1C1C] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#141414] border-b border-white/8">
              <tr>
                <th className="py-3 px-3 font-bold text-[#9A9A9A] uppercase text-[10px]">Settlement</th>
                <th className="py-3 px-3 font-bold text-[#9A9A9A] uppercase text-[10px]">District</th>
                <th className="py-3 px-3 font-bold text-[#9A9A9A] uppercase text-[10px]">Red-Zone Classification</th>
                <SortHeader field="population" label="Population" />
                <SortHeader field="risk_score" label="Risk Score" />
                <SortHeader field="vulnerability_score" label="Vulnerability" />
                <th className="py-3 px-3 font-bold text-[#9A9A9A] uppercase text-[10px]">Primary Hazard</th>
                <SortHeader field="relocation_priority" label="RPI Score" />
                <th className="py-3 px-3 font-bold text-[#9A9A9A] uppercase text-[10px]">Urgency</th>
                <th className="w-8"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((hab) => (
                <tr
                  key={hab.id}
                  onClick={() => navigate(`/workspace/communities/${hab.id}`)}
                  className="hover:bg-[#232323] cursor-pointer transition-colors"
                >
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <Building2 size={14} className={hab.red_zone.isRedZone ? 'text-[#FF4D4D]' : 'text-[#9A9A9A]'} />
                      <span className="font-bold text-white">{hab.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-[#9A9A9A] font-medium">{hab.district}</td>
                  <td className="py-3 px-3">
                    <RedZoneBadge redZone={hab.red_zone} size="sm" showDetailsButton={false} />
                  </td>
                  <td className="py-3 px-3 font-semibold text-[#F5F5F5] tabular-nums">{formatNumber(hab.population)}</td>
                  <td className="py-3 px-3 font-black tabular-nums" style={{ color: riskColor(hab.risk_level) }}>
                    {hab.risk_score}/100
                  </td>
                  <td className="py-3 px-3 text-[#F5F5F5] font-semibold tabular-nums">{hab.vulnerability_score}</td>
                  <td className="py-3 px-3 text-[#9A9A9A]">{hazardLabel(hab.most_frequent_hazard)}</td>
                  <td className="py-3 px-3 font-black text-white tabular-nums">{hab.relocation_priority}</td>
                  <td className="py-3 px-3">
                    <span className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase ${urgencyColor(hab.relocation_urgency)}`}>
                      {urgencyLabel(hab.relocation_urgency)}
                    </span>
                  </td>
                  <td className="py-3 px-1 text-right">
                    <ChevronRight size={14} className="text-[#6B6B6B]" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
