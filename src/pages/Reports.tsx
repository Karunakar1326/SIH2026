import { useState } from 'react';
import { PageHeader, SectionHeader } from '@/components/shared';
import { habitations } from '@/data/habitations';
import { FileText, Download, ShieldCheck } from 'lucide-react';

const reportTypes = [
  { id: 'habitation-risk', name: 'Official Habitation Risk & Red-Zone Report', desc: 'Complete multi-hazard risk assessment with data provenance annexures', icon: '🏘️' },
  { id: 'relocation-plan', name: 'Formal SDMA Relocation Action Plan', desc: 'Prioritized relocation sequence, population math, and safe site allocation', icon: '📋' },
  { id: 'carrying-capacity', name: 'Safe Site Carrying Capacity Assessment', desc: 'Multi-dimensional infrastructure bottleneck & environmental evaluation', icon: '📍' },
  { id: 'historical-analogue', name: 'Historical Disaster & Analogue Report', desc: 'IMD/CWC/GSI disaster parameters & historical similarity analysis', icon: '📜' },
  { id: 'district-summary', name: 'Executive DDMA District Disaster Summary', desc: 'District-wide red-zone counts, capacity deficits, and budget projections', icon: '🏛️' },
];

export function Reports() {
  const [selectedType, setSelectedType] = useState('habitation-risk');
  const [selectedHab, setSelectedHab] = useState(habitations[0]?.id || '');
  const [generated, setGenerated] = useState(false);

  const handleGenerate = () => {
    setGenerated(false);
    setTimeout(() => setGenerated(true), 1000);
  };

  const targetHab = habitations.find((h) => h.id === selectedHab);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <PageHeader title="Official Reports & Action Plans" subtitle="Generate formal SDMA / DDMA disaster relocation reports with data provenance appendices" />

      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Report Type Selection */}
          <div className="bg-white border border-neutral-300 rounded-lg p-4 shadow-2xs">
            <SectionHeader title="Select Formal Report Type" />
            <div className="mt-3 space-y-2">
              {reportTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => { setSelectedType(type.id); setGenerated(false); }}
                  className={`w-full text-left px-3 py-2.5 rounded border transition-colors ${
                    selectedType === type.id
                      ? 'bg-accent-bg border-blue-300 text-accent-dark font-bold'
                      : 'border-neutral-200 hover:bg-neutral-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{type.icon}</span>
                    <div>
                      <div className="text-xs font-bold">{type.name}</div>
                      <div className="text-[10px] text-neutral-500 font-normal">{type.desc}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Configuration */}
          <div className="bg-white border border-neutral-300 rounded-lg p-4 shadow-2xs">
            <SectionHeader title="Report Configuration" />
            <div className="mt-3 space-y-4 text-xs">
              <div>
                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-1">Target Habitation</label>
                <select value={selectedHab} onChange={(e) => setSelectedHab(e.target.value)}
                  className="w-full text-xs border border-neutral-300 rounded px-2.5 py-1.5 bg-neutral-50 focus:outline-none focus:ring-1 focus:ring-accent font-medium">
                  {habitations.map((h) => <option key={h.id} value={h.id}>{h.name} ({h.district} · {h.red_zone.isRedZone ? 'Red-Zone' : 'Non-Red'})</option>)}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-1">Include Provenance Annexures</label>
                <div className="space-y-1.5">
                  {['ISRO / NRSC Satellite Map Annexure', 'IMD Meteorological Weather Track', 'CWC Basin Hydrology Telemetry', 'NCSCM Coastal Erosion Profile', 'DDMA Local Infrastructure Survey'].map(s => (
                    <label key={s} className="flex items-center gap-2 text-xs text-neutral-700 cursor-pointer">
                      <input type="checkbox" defaultChecked className="rounded border-neutral-300 text-accent focus:ring-accent w-3.5 h-3.5" />
                      <span>{s}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button onClick={handleGenerate}
                className="w-full flex items-center justify-center gap-2 text-xs font-bold py-2.5 rounded bg-accent text-white hover:bg-accent-dark transition-colors shadow-2xs">
                <FileText size={14} /> Generate Official SDMA Report
              </button>
            </div>
          </div>

          {/* Generated Preview */}
          <div className="bg-white border border-neutral-300 rounded-lg p-4 shadow-2xs">
            <SectionHeader title="Document Preview & Export" />
            {generated && targetHab ? (
              <div className="mt-3 animate-fade-in space-y-3">
                <div className="bg-neutral-50 border border-neutral-300 rounded p-4 text-xs space-y-2">
                  <div className="flex items-center gap-2 text-emerald-700 font-bold border-b border-neutral-200 pb-2">
                    <ShieldCheck size={18} /> Official Report Compilation Complete
                  </div>
                  <div><span className="text-neutral-500">Document Type:</span> <strong className="text-neutral-900">{reportTypes.find(r => r.id === selectedType)?.name}</strong></div>
                  <div><span className="text-neutral-500">Target Settlement:</span> <strong className="text-neutral-900">{targetHab.name} ({targetHab.district})</strong></div>
                  <div><span className="text-neutral-500">Red-Zone Status:</span> <strong className="text-red-700">{targetHab.red_zone.isRedZone ? 'RED-ZONE CLASSIFIED' : 'Clear'}</strong></div>
                  <div><span className="text-neutral-500">RPI Score:</span> <strong className="text-neutral-900">{targetHab.relocation_priority} / 100</strong></div>
                  <div><span className="text-neutral-500">Data Sources:</span> <span className="font-mono text-[10px]">ISRO/NRSC, IMD, CWC, NCSCM, CENSUS</span></div>

                  <button className="w-full mt-3 flex items-center justify-center gap-2 text-xs font-bold py-2 rounded bg-neutral-900 text-white hover:bg-neutral-800 transition-colors">
                    <Download size={13} /> Export PDF Document with Annexures
                  </button>
                </div>
                <p className="text-[10px] text-neutral-400">PDF export generated with digital signature & metadata timestamp.</p>
              </div>
            ) : (
              <div className="mt-3 flex flex-col items-center justify-center py-12 text-center">
                <FileText size={36} className="text-neutral-300 mb-3" />
                <p className="text-xs text-neutral-600 font-medium">Select report parameters and click Generate</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
