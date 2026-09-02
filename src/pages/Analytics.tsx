import { PageHeader, SectionHeader } from '@/components/shared';
import { habitations } from '@/data/habitations';
import { historicalEvents } from '@/data/historical-events';
import { safeSites } from '@/data/safe-sites';
import { hazardLabel, formatCompactNumber } from '@/utils/helpers';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid, Legend, AreaChart, Area } from 'recharts';

const RISK_COLORS = { critical: '#ef4444', high: '#f97316', moderate: '#eab308', low: '#22c55e' };

export function Analytics() {
  // Risk Distribution
  const riskDist = [
    { name: 'Critical', value: habitations.filter(h => h.risk_level === 'critical').length, fill: RISK_COLORS.critical },
    { name: 'High', value: habitations.filter(h => h.risk_level === 'high').length, fill: RISK_COLORS.high },
    { name: 'Moderate', value: habitations.filter(h => h.risk_level === 'moderate').length, fill: RISK_COLORS.moderate },
    { name: 'Low', value: habitations.filter(h => h.risk_level === 'low').length, fill: RISK_COLORS.low },
  ];

  // Hazard Distribution
  const hazardTypes = ['cyclone', 'flood', 'landslide', 'extreme_rainfall', 'coastal_erosion'] as const;
  const hazardDist = hazardTypes.map(h => ({
    name: hazardLabel(h),
    events: historicalEvents.filter(e => e.hazard_type === h).length,
    habitations: habitations.filter(hab => hab.most_frequent_hazard === h).length,
  }));

  // Population by Risk
  const popByRisk = [
    { name: 'Critical', population: habitations.filter(h => h.risk_level === 'critical').reduce((s, h) => s + h.population, 0), fill: RISK_COLORS.critical },
    { name: 'High', population: habitations.filter(h => h.risk_level === 'high').reduce((s, h) => s + h.population, 0), fill: RISK_COLORS.high },
    { name: 'Moderate', population: habitations.filter(h => h.risk_level === 'moderate').reduce((s, h) => s + h.population, 0), fill: RISK_COLORS.moderate },
    { name: 'Low', population: habitations.filter(h => h.risk_level === 'low').reduce((s, h) => s + h.population, 0), fill: RISK_COLORS.low },
  ];

  // Event Timeline
  const yearCounts = historicalEvents.reduce<Record<number, number>>((acc, e) => {
    const year = new Date(e.date).getFullYear();
    acc[year] = (acc[year] || 0) + 1;
    return acc;
  }, {});
  const timelineData = Object.entries(yearCounts).sort(([a], [b]) => Number(a) - Number(b)).map(([year, count]) => ({ year: Number(year), events: count }));

  // Capacity Overview
  const capacityData = [
    { name: 'Need', value: habitations.filter(h => h.relocation_urgency === 'immediate' || h.relocation_urgency === 'short-term').reduce((s, h) => s + h.population, 0) },
    { name: 'Available', value: safeSites.filter(s => s.status === 'suitable').reduce((s, site) => s + site.carrying_capacity.estimated_sustainable_capacity, 0) },
  ];

  // District Comparison
  const districts = [...new Set(habitations.map(h => h.district))];
  const districtData = districts.map(d => {
    const dHabs = habitations.filter(h => h.district === d);
    return {
      district: d,
      avgRisk: Math.round(dHabs.reduce((s, h) => s + h.risk_score, 0) / dHabs.length),
      population: dHabs.reduce((s, h) => s + h.population, 0),
      habitations: dHabs.length,
    };
  });

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <PageHeader title="Analytics" subtitle="Comprehensive risk, hazard, and capacity analytics" />

      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {/* Risk Distribution Pie */}
          <div className="bg-white border border-neutral-200 rounded-lg p-4">
            <SectionHeader title="Risk Distribution" subtitle="Habitations by risk level" />
            <div className="h-48 mt-3">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={riskDist} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} innerRadius={40} paddingAngle={2}>
                    {riskDist.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #dde1e6' }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Hazard Distribution */}
          <div className="bg-white border border-neutral-200 rounded-lg p-4">
            <SectionHeader title="Hazard Distribution" subtitle="Events and affected habitations by type" />
            <div className="h-48 mt-3">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hazardDist} barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e8ebee" />
                  <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#697077' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#697077' }} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #dde1e6' }} />
                  <Bar dataKey="events" name="Historical Events" fill="#8b5cf6" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="habitations" name="Habitations" fill="#3b82f6" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Population Exposure */}
          <div className="bg-white border border-neutral-200 rounded-lg p-4">
            <SectionHeader title="Population Exposure" subtitle="Population at each risk level" />
            <div className="h-48 mt-3">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={popByRisk} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e8ebee" />
                  <XAxis type="number" tick={{ fontSize: 10, fill: '#697077' }} tickFormatter={(v) => formatCompactNumber(v)} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#697077' }} width={70} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #dde1e6' }} formatter={(v: any) => formatCompactNumber(v)} />
                  <Bar dataKey="population" radius={[0, 3, 3, 0]}>
                    {popByRisk.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Historical Event Frequency */}
          <div className="bg-white border border-neutral-200 rounded-lg p-4">
            <SectionHeader title="Event Frequency" subtitle="Historical events by year" />
            <div className="h-48 mt-3">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timelineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e8ebee" />
                  <XAxis dataKey="year" tick={{ fontSize: 10, fill: '#697077' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#697077' }} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #dde1e6' }} />
                  <Area type="monotone" dataKey="events" stroke="#3b82f6" fill="#3b82f620" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Capacity Overview */}
          <div className="bg-white border border-neutral-200 rounded-lg p-4">
            <SectionHeader title="Capacity vs Need" subtitle="Relocation capacity assessment" />
            <div className="h-48 mt-3">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={capacityData} barGap={8}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e8ebee" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#697077' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#697077' }} tickFormatter={(v) => formatCompactNumber(v)} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #dde1e6' }} formatter={(v: any) => formatCompactNumber(v)} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    <Cell fill="#ef4444" />
                    <Cell fill="#22c55e" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* District Comparison */}
          <div className="bg-white border border-neutral-200 rounded-lg p-4">
            <SectionHeader title="District Comparison" subtitle="Average risk by district" />
            <div className="h-48 mt-3">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={districtData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e8ebee" />
                  <XAxis dataKey="district" tick={{ fontSize: 10, fill: '#697077' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#697077' }} domain={[0, 100]} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #dde1e6' }} />
                  <Bar dataKey="avgRisk" name="Avg Risk Score" fill="#f97316" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
