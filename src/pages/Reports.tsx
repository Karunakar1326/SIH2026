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
    <div className="flex flex-col h-full bg-[#141414] text-[#F5F5F5] overflow-hidden">
      <PageHeader title="Official Reports & Action Plans" subtitle="Generate formal SDMA / DDMA disaster relocation reports with data provenance appendices" />

      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Report Type Selection */}
          <div className="bg-[#1C1C1C] border border-white/10 rounded-2xl p-5 shadow-2xl">
            <SectionHeader title="Select Formal Report Type" />
            <div className="mt-4 space-y-2">
              {reportTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => { setSelectedType(type.id); setGenerated(false); }}
                  className={`w-full text-left px-3.5 py-3 rounded-xl border transition-all cursor-pointer ${
                    selectedType === type.id
                      ? 'bg-[#FF5A1F]/15 border-[#FF5A1F] text-white font-bold shadow-[0_0_12px_rgba(255,90,31,0.2)]'
                      : 'border-white/5 bg-[#232323] text-[#9A9A9A] hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{type.icon}</span>
                    <div>
                      <div className="text-xs font-bold text-white">{type.name}</div>
                      <div className="text-[10px] text-[#9A9A9A] font-medium">{type.desc}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Configuration */}
          <div className="bg-[#1C1C1C] border border-white/10 rounded-2xl p-5 shadow-2xl text-[#F5F5F5]">
            <SectionHeader title="Report Configuration" />
            <div className="mt-4 space-y-4 text-xs">
              <div>
                <label className="text-[10px] font-bold text-[#9A9A9A] uppercase tracking-wider block mb-1">Target Habitation</label>
                <select value={selectedHab} onChange={(e) => setSelectedHab(e.target.value)}
                  className="w-full text-xs border border-white/10 rounded-xl px-3 py-2 bg-[#232323] text-white focus:outline-none focus:ring-1 focus:ring-[#FF5A1F] font-semibold">
                  {habitations.map((h) => <option key={h.id} value={h.id} className="bg-[#1C1C1C]">{h.name} ({h.district} · {h.red_zone.isRedZone ? 'Red-Zone' : 'Non-Red'})</option>)}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-[#9A9A9A] uppercase tracking-wider block mb-1.5">Include Provenance Annexures</label>
                <div className="space-y-2">
                  {['ISRO / NRSC Satellite Map Annexure', 'IMD Meteorological Weather Track', 'CWC Basin Hydrology Telemetry', 'NCSCM Coastal Erosion Profile', 'DDMA Local Infrastructure Survey'].map(s => (
                    <label key={s} className="flex items-center gap-2 text-xs text-[#9A9A9A] cursor-pointer hover:text-white transition-colors">
                      <input type="checkbox" defaultChecked className="rounded border-white/20 text-[#FF5A1F] focus:ring-[#FF5A1F] w-3.5 h-3.5 bg-[#232323]" />
                      <span>{s}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button onClick={handleGenerate}
                className="w-full flex items-center justify-center gap-2 text-xs font-bold py-3 rounded-xl bg-gradient-to-r from-[#FF7A3D] to-[#FF3D1F] text-white shadow-[0_0_24px_rgba(255,90,31,0.35)] hover:shadow-[0_0_36px_rgba(255,90,31,0.55)] transition-all cursor-pointer">
                <FileText size={15} /> Generate Official SDMA Report
              </button>
            </div>
          </div>

          {/* Generated Preview */}
          <div className="bg-[#1C1C1C] border border-white/10 rounded-2xl p-5 shadow-2xl text-[#F5F5F5]">
            <SectionHeader title="Document Preview & Export" />
            {generated && targetHab ? (
              <div className="mt-4 animate-fade-in space-y-3">
                <div className="bg-[#232323] border border-white/8 rounded-2xl p-4 text-xs space-y-2.5">
                  <div className="flex items-center gap-2 text-[#2ECC71] font-bold border-b border-white/5 pb-2.5">
                    <ShieldCheck size={18} /> Official Report Compilation Complete
                  </div>
                  <div><span className="text-[#9A9A9A]">Document Type:</span> <strong className="text-white ml-1">{reportTypes.find(r => r.id === selectedType)?.name}</strong></div>
                  <div><span className="text-[#9A9A9A]">Target Settlement:</span> <strong className="text-white ml-1">{targetHab.name} ({targetHab.district})</strong></div>
                  <div><span className="text-[#9A9A9A]">Red-Zone Status:</span> <strong className="text-[#FF4D4D] ml-1">{targetHab.red_zone.isRedZone ? 'RED-ZONE CLASSIFIED' : 'Clear'}</strong></div>
                  <div><span className="text-[#9A9A9A]">RPI Score:</span> <strong className="text-[#FF5A1F] ml-1">{targetHab.relocation_priority} / 100</strong></div>
                  <div><span className="text-[#9A9A9A]">Data Sources:</span> <span className="font-mono text-[10px] text-[#6B6B6B] ml-1">ISRO/NRSC, IMD, CWC, NCSCM, CENSUS</span></div>

                  <button className="w-full mt-3 flex items-center justify-center gap-2 text-xs font-bold py-3 rounded-xl bg-[#141414] border border-white/10 text-white hover:bg-white/10 transition-colors cursor-pointer">
                    <Download size={14} className="text-[#FF5A1F]" /> Export PDF Document with Annexures
                  </button>
                </div>
                <p className="text-[10px] text-[#6B6B6B] font-mono">PDF export generated with digital signature & metadata timestamp.</p>
              </div>
            ) : (
              <div className="mt-4 flex flex-col items-center justify-center py-16 text-center">
                <FileText size={40} className="text-[#6B6B6B] mb-3" />
                <p className="text-xs text-[#9A9A9A] font-medium">Select report parameters and click Generate</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
