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
      className="text-left text-[10px] font-bold text-neutral-600 uppercase tracking-wider py-2.5 px-3 cursor-pointer hover:text-neutral-900 select-none"
    >
      <span className="inline-flex items-center gap-1">
        {label}
        <ArrowUpDown size={10} className={sortField === field ? 'text-accent' : 'text-neutral-300'} />
      </span>
    </th>
  );

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <PageHeader title="Habitations Register" subtitle={`${habitations.length} settlements evaluated across all coastal districts`} />

      {/* Filters Toolbar */}
      <div className="px-6 py-3 bg-white border-b border-neutral-200 flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search settlement name or district..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-neutral-300 rounded bg-neutral-50 focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>

        <label className="flex items-center gap-1.5 text-xs font-bold text-red-900 bg-red-50 border border-red-200 px-2.5 py-1 rounded cursor-pointer">
          <ShieldAlert size={14} className="text-red-600" />
          <span>Red-Zones Only</span>
          <input
            type="checkbox"
            checked={redZoneOnly}
            onChange={(e) => setRedZoneOnly(e.target.checked)}
            className="rounded border-red-300 text-red-600 focus:ring-red-500 w-3.5 h-3.5 ml-1"
          />
        </label>

        <select value={riskFilter} onChange={(e) => setRiskFilter(e.target.value as RiskLevel | 'all')} className="text-xs border border-neutral-300 rounded px-2.5 py-1.5 bg-neutral-50 focus:outline-none focus:ring-1 focus:ring-accent font-medium">
          <option value="all">All Risk Severity</option>
          <option value="critical">Critical Risk</option>
          <option value="high">High Risk</option>
          <option value="moderate">Moderate Risk</option>
          <option value="low">Low Risk</option>
        </select>

        <select value={hazardFilter} onChange={(e) => setHazardFilter(e.target.value as HazardType | 'all')} className="text-xs border border-neutral-300 rounded px-2.5 py-1.5 bg-neutral-50 focus:outline-none focus:ring-1 focus:ring-accent font-medium">
          <option value="all">All Hazard Categories</option>
          <option value="cyclone">Cyclone</option>
          <option value="flood">Flood</option>
          <option value="landslide">Landslide</option>
          <option value="extreme_rainfall">Extreme Rainfall</option>
          <option value="coastal_erosion">Coastal Erosion</option>
        </select>

        <span className="text-xs text-neutral-500 font-mono ml-auto">Showing {filtered.length} settlements</span>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto px-6 py-4">
        <div className="bg-white border border-neutral-300 rounded-lg overflow-hidden shadow-2xs">
          <table className="w-full text-xs text-left">
            <thead className="bg-neutral-100 border-b border-neutral-200">
              <tr>
                <th className="py-2.5 px-3 font-bold text-neutral-600 uppercase text-[10px]">Settlement</th>
                <th className="py-2.5 px-3 font-bold text-neutral-600 uppercase text-[10px]">District</th>
                <th className="py-2.5 px-3 font-bold text-neutral-600 uppercase text-[10px]">Red-Zone Classification</th>
                <SortHeader field="population" label="Population" />
                <SortHeader field="risk_score" label="Risk Score" />
                <SortHeader field="vulnerability_score" label="Vulnerability" />
                <th className="py-2.5 px-3 font-bold text-neutral-600 uppercase text-[10px]">Primary Hazard</th>
                <SortHeader field="relocation_priority" label="RPI Score" />
                <th className="py-2.5 px-3 font-bold text-neutral-600 uppercase text-[10px]">Urgency</th>
                <th className="w-8"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-150">
              {filtered.map((hab) => (
                <tr
                  key={hab.id}
                  onClick={() => navigate(`/workspace/communities/${hab.id}`)}
                  className="hover:bg-neutral-25 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <Building2 size={14} className={hab.red_zone.isRedZone ? 'text-red-600' : 'text-neutral-500'} />
                      <span className="font-bold text-neutral-900">{hab.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-neutral-600 font-medium">{hab.district}</td>
                  <td className="py-3 px-3">
                    <RedZoneBadge redZone={hab.red_zone} size="sm" showDetailsButton={false} />
                  </td>
                  <td className="py-3 px-3 font-semibold text-neutral-800">{formatNumber(hab.population)}</td>
                  <td className="py-3 px-3 font-bold" style={{ color: riskColor(hab.risk_level) }}>
                    {hab.risk_score}/100
                  </td>
                  <td className="py-3 px-3 text-neutral-700 font-medium">{hab.vulnerability_score}</td>
                  <td className="py-3 px-3 text-neutral-600">{hazardLabel(hab.most_frequent_hazard)}</td>
                  <td className="py-3 px-3 font-extrabold text-neutral-900">{hab.relocation_priority}</td>
                  <td className="py-3 px-3">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${urgencyColor(hab.relocation_urgency)}`}>
                      {urgencyLabel(hab.relocation_urgency)}
                    </span>
                  </td>
                  <td className="py-3 px-1 text-right">
                    <ChevronRight size={14} className="text-neutral-400" />
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
