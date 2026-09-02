import { PageHeader, SectionHeader } from '@/components/shared';
import { Save, RotateCcw } from 'lucide-react';

export function SettingsPage() {
  return (
    <div className="flex flex-col h-full bg-[#141414] text-[#F5F5F5] overflow-hidden">
      <PageHeader title="Settings" subtitle="Configure platform parameters and preferences" />

      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="max-w-2xl mx-auto space-y-4">
          {/* Risk Weights */}
          <div className="bg-[#1C1C1C] border border-white/10 rounded-2xl p-6 shadow-2xl">
            <SectionHeader title="Risk Model Weights" subtitle="Adjust the contribution of each factor to the composite risk score" />
            <div className="mt-4 space-y-4">
              {[
                { label: 'Hazard Severity', default: 30 },
                { label: 'Population Exposure', default: 25 },
                { label: 'Vulnerability', default: 20 },
                { label: 'Historical Recurrence', default: 15 },
                { label: 'Infrastructure Deficiency', default: 10 },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-[#9A9A9A] font-semibold">{item.label}</span>
                    <span className="text-[#FF5A1F] font-black font-mono">{item.default}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    defaultValue={item.default}
                    className="w-full h-1.5 bg-[#232323] rounded-full appearance-none cursor-pointer accent-[#FF5A1F]"
                  />
                </div>
              ))}
              <p className="text-[10px] text-[#6B6B6B] border-t border-white/5 pt-3 font-medium">
                Weights must sum to 100%. Changes will recalculate all risk scores.
              </p>
            </div>
          </div>

          {/* Display Preferences */}
          <div className="bg-[#1C1C1C] border border-white/10 rounded-2xl p-6 shadow-2xl">
            <SectionHeader title="Display Preferences" />
            <div className="mt-4 space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs text-[#9A9A9A] font-medium">Show confidence indicators</span>
                <input type="checkbox" defaultChecked className="rounded border-white/20 text-[#FF5A1F] focus:ring-[#FF5A1F] w-4 h-4 bg-[#232323]" />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs text-[#9A9A9A] font-medium">Show data freshness badges</span>
                <input type="checkbox" defaultChecked className="rounded border-white/20 text-[#FF5A1F] focus:ring-[#FF5A1F] w-4 h-4 bg-[#232323]" />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs text-[#9A9A9A] font-medium">Show methodology disclaimers</span>
                <input type="checkbox" defaultChecked className="rounded border-white/20 text-[#FF5A1F] focus:ring-[#FF5A1F] w-4 h-4 bg-[#232323]" />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs text-[#9A9A9A] font-medium">Enable animations</span>
                <input type="checkbox" defaultChecked className="rounded border-white/20 text-[#FF5A1F] focus:ring-[#FF5A1F] w-4 h-4 bg-[#232323]" />
              </label>
              <div>
                <label className="text-xs text-[#9A9A9A] block mb-1 font-medium">Default map basemap</label>
                <select className="text-sm border border-white/10 rounded-xl px-3 py-2 bg-[#232323] text-white focus:outline-none focus:ring-1 focus:ring-[#FF5A1F] w-full font-semibold">
                  <option className="bg-[#1C1C1C]">Dark Matter (CartoDB)</option>
                  <option className="bg-[#1C1C1C]">Streets</option>
                  <option className="bg-[#1C1C1C]">Satellite</option>
                  <option className="bg-[#1C1C1C]">Terrain</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-[#9A9A9A] block mb-1 font-medium">Historical event radius (default)</label>
                <select className="text-sm border border-white/10 rounded-xl px-3 py-2 bg-[#232323] text-white focus:outline-none focus:ring-1 focus:ring-[#FF5A1F] w-full font-semibold">
                  <option className="bg-[#1C1C1C]">5 km</option>
                  <option className="bg-[#1C1C1C]">10 km</option>
                  <option selected className="bg-[#1C1C1C]">25 km</option>
                  <option className="bg-[#1C1C1C]">50 km</option>
                </select>
              </div>
            </div>
          </div>

          {/* Data Mode */}
          <div className="bg-[#1C1C1C] border border-white/10 rounded-2xl p-6 shadow-2xl">
            <SectionHeader title="Data Mode" />
            <div className="mt-4 space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="radio" name="data-mode" defaultChecked className="text-[#FF5A1F] focus:ring-[#FF5A1F] bg-[#232323]" />
                <div>
                  <span className="text-xs font-bold text-white">Demo Data</span>
                  <span className="text-[10px] text-[#9A9A9A] block font-medium">Use simulated data for demonstration</span>
                </div>
              </label>
              <label className="flex items-center gap-3 opacity-50 cursor-not-allowed">
                <input type="radio" name="data-mode" disabled className="text-[#FF5A1F] focus:ring-[#FF5A1F] bg-[#232323]" />
                <div>
                  <span className="text-xs font-bold text-[#9A9A9A]">Live Data</span>
                  <span className="text-[10px] text-[#6B6B6B] block font-medium">Connect to real APIs (not configured)</span>
                </div>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button className="flex-1 flex items-center justify-center gap-2 text-sm font-bold py-3 rounded-xl bg-gradient-to-r from-[#FF7A3D] to-[#FF3D1F] text-white shadow-[0_0_24px_rgba(255,90,31,0.35)] hover:shadow-[0_0_36px_rgba(255,90,31,0.55)] transition-all cursor-pointer">
              <Save size={15} /> Save Settings
            </button>
            <button className="flex items-center justify-center gap-2 text-sm font-bold py-3 px-6 rounded-xl border border-white/10 bg-[#232323] text-white hover:bg-white/10 transition-colors cursor-pointer">
              <RotateCcw size={15} /> Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
