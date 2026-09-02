import { PageHeader, SectionHeader } from '@/components/shared';
import { Save, RotateCcw } from 'lucide-react';

export function SettingsPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <PageHeader title="Settings" subtitle="Configure platform parameters and preferences" />

      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="max-w-2xl mx-auto space-y-4">
          {/* Risk Weights */}
          <div className="bg-white border border-neutral-200 rounded-lg p-5">
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
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-neutral-600 font-medium">{item.label}</span>
                    <span className="text-neutral-800 font-bold">{item.default}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    defaultValue={item.default}
                    className="w-full h-1.5 bg-neutral-200 rounded-full appearance-none cursor-pointer accent-accent"
                  />
                </div>
              ))}
              <p className="text-[10px] text-neutral-400 border-t border-neutral-100 pt-2">
                Weights must sum to 100%. Changes will recalculate all risk scores.
              </p>
            </div>
          </div>

          {/* Display Preferences */}
          <div className="bg-white border border-neutral-200 rounded-lg p-5">
            <SectionHeader title="Display Preferences" />
            <div className="mt-4 space-y-3">
              <label className="flex items-center justify-between">
                <span className="text-xs text-neutral-600">Show confidence indicators</span>
                <input type="checkbox" defaultChecked className="rounded border-neutral-300 text-accent focus:ring-accent w-4 h-4" />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-xs text-neutral-600">Show data freshness badges</span>
                <input type="checkbox" defaultChecked className="rounded border-neutral-300 text-accent focus:ring-accent w-4 h-4" />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-xs text-neutral-600">Show methodology disclaimers</span>
                <input type="checkbox" defaultChecked className="rounded border-neutral-300 text-accent focus:ring-accent w-4 h-4" />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-xs text-neutral-600">Enable animations</span>
                <input type="checkbox" defaultChecked className="rounded border-neutral-300 text-accent focus:ring-accent w-4 h-4" />
              </label>
              <div>
                <label className="text-xs text-neutral-600 block mb-1">Default map basemap</label>
                <select className="text-sm border border-neutral-200 rounded-md px-2.5 py-1.5 bg-neutral-50 focus:outline-none focus:ring-1 focus:ring-accent w-full">
                  <option>Streets</option>
                  <option>Satellite</option>
                  <option>Terrain</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-neutral-600 block mb-1">Historical event radius (default)</label>
                <select className="text-sm border border-neutral-200 rounded-md px-2.5 py-1.5 bg-neutral-50 focus:outline-none focus:ring-1 focus:ring-accent w-full">
                  <option>5 km</option>
                  <option>10 km</option>
                  <option selected>25 km</option>
                  <option>50 km</option>
                </select>
              </div>
            </div>
          </div>

          {/* Data Mode */}
          <div className="bg-white border border-neutral-200 rounded-lg p-5">
            <SectionHeader title="Data Mode" />
            <div className="mt-4 space-y-3">
              <label className="flex items-center gap-3">
                <input type="radio" name="data-mode" defaultChecked className="text-accent focus:ring-accent" />
                <div>
                  <span className="text-xs font-medium text-neutral-800">Demo Data</span>
                  <span className="text-[10px] text-neutral-500 block">Use simulated data for demonstration</span>
                </div>
              </label>
              <label className="flex items-center gap-3 opacity-50">
                <input type="radio" name="data-mode" disabled className="text-accent focus:ring-accent" />
                <div>
                  <span className="text-xs font-medium text-neutral-800">Live Data</span>
                  <span className="text-[10px] text-neutral-500 block">Connect to real APIs (not configured)</span>
                </div>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button className="flex-1 flex items-center justify-center gap-2 text-sm font-medium py-2 rounded-md bg-accent text-white hover:bg-accent-dark transition-colors">
              <Save size={14} /> Save Settings
            </button>
            <button className="flex items-center justify-center gap-2 text-sm font-medium py-2 px-4 rounded-md border border-neutral-200 text-neutral-700 hover:bg-neutral-50 transition-colors">
              <RotateCcw size={14} /> Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
