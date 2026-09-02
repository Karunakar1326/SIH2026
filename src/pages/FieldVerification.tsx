import { useState } from 'react';
import { PageHeader, SectionHeader } from '@/components/shared';
import { MapPin, Camera, Check, Upload, Loader2 } from 'lucide-react';

export function FieldVerification() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => { setSubmitting(false); setSubmitted(true); }, 1500);
  };

  if (submitted) {
    return (
      <div className="flex flex-col h-full bg-[#141414] text-[#F5F5F5]">
        <PageHeader title="Field Verification" subtitle="Ground-truth data submission" />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center animate-fade-in bg-[#1C1C1C] border border-white/10 rounded-2xl p-8 max-w-md shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-[#2ECC71]/15 border border-[#2ECC71]/30 flex items-center justify-center mx-auto mb-4">
              <Check size={32} className="text-[#2ECC71]" />
            </div>
            <h2 className="text-lg font-black text-white mb-2">Verification Submitted</h2>
            <p className="text-sm text-[#9A9A9A] mb-6">Your field observation has been recorded and will be incorporated into the habitation assessment.</p>
            <button onClick={() => setSubmitted(false)} className="text-sm font-bold text-[#FF5A1F] hover:underline cursor-pointer">Submit another verification</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#141414] text-[#F5F5F5] overflow-hidden">
      <PageHeader title="Field Verification" subtitle="Submit ground-truth observations from field visits" />

      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-[#1C1C1C] border border-white/10 rounded-2xl p-6 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Location */}
              <div>
                <SectionHeader title="Location" />
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div>
                    <label className="text-[11px] font-bold text-[#9A9A9A] uppercase tracking-wider block mb-1">Habitation Name</label>
                    <input type="text" placeholder="Enter habitation name" className="w-full text-sm border border-white/10 rounded-xl px-3 py-2 bg-[#232323] text-white focus:outline-none focus:ring-1 focus:ring-[#FF5A1F]" required />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#9A9A9A] uppercase tracking-wider block mb-1">District</label>
                    <select className="w-full text-sm border border-white/10 rounded-xl px-3 py-2 bg-[#232323] text-white focus:outline-none focus:ring-1 focus:ring-[#FF5A1F] font-medium" required>
                      <option value="" className="bg-[#1C1C1C]">Select district</option>
                      <option className="bg-[#1C1C1C]">Ganjam</option><option className="bg-[#1C1C1C]">Puri</option><option className="bg-[#1C1C1C]">Jagatsinghpur</option><option className="bg-[#1C1C1C]">Kendrapara</option><option className="bg-[#1C1C1C]">Balasore</option>
                    </select>
                  </div>
                </div>
                <div className="mt-3">
                  <label className="text-[11px] font-bold text-[#9A9A9A] uppercase tracking-wider block mb-1">GPS Coordinates</label>
                  <div className="flex gap-2">
                    <input type="text" placeholder="Latitude" className="flex-1 text-sm border border-white/10 rounded-xl px-3 py-2 bg-[#232323] text-white focus:outline-none focus:ring-1 focus:ring-[#FF5A1F]" />
                    <input type="text" placeholder="Longitude" className="flex-1 text-sm border border-white/10 rounded-xl px-3 py-2 bg-[#232323] text-white focus:outline-none focus:ring-1 focus:ring-[#FF5A1F]" />
                    <button type="button" className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl border border-white/10 bg-[#232323] text-white hover:bg-white/10 transition-colors cursor-pointer">
                      <MapPin size={13} className="text-[#FF5A1F]" /> Get GPS
                    </button>
                  </div>
                </div>
              </div>

              {/* Observations */}
              <div>
                <SectionHeader title="Observations" />
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div>
                    <label className="text-[11px] font-bold text-[#9A9A9A] uppercase tracking-wider block mb-1">Estimated Population</label>
                    <input type="number" placeholder="e.g. 2500" className="w-full text-sm border border-white/10 rounded-xl px-3 py-2 bg-[#232323] text-white focus:outline-none focus:ring-1 focus:ring-[#FF5A1F]" />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#9A9A9A] uppercase tracking-wider block mb-1">Housing Condition</label>
                    <select className="w-full text-sm border border-white/10 rounded-xl px-3 py-2 bg-[#232323] text-white focus:outline-none focus:ring-1 focus:ring-[#FF5A1F]">
                      <option value="" className="bg-[#1C1C1C]">Select</option>
                      <option className="bg-[#1C1C1C]">Good</option><option className="bg-[#1C1C1C]">Fair</option><option className="bg-[#1C1C1C]">Poor</option><option className="bg-[#1C1C1C]">Severely Damaged</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#9A9A9A] uppercase tracking-wider block mb-1">Road Condition</label>
                    <select className="w-full text-sm border border-white/10 rounded-xl px-3 py-2 bg-[#232323] text-white focus:outline-none focus:ring-1 focus:ring-[#FF5A1F]">
                      <option value="" className="bg-[#1C1C1C]">Select</option>
                      <option className="bg-[#1C1C1C]">All-weather accessible</option><option className="bg-[#1C1C1C]">Partially damaged</option><option className="bg-[#1C1C1C]">Impassable</option><option className="bg-[#1C1C1C]">No road access</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#9A9A9A] uppercase tracking-wider block mb-1">Water Availability</label>
                    <select className="w-full text-sm border border-white/10 rounded-xl px-3 py-2 bg-[#232323] text-white focus:outline-none focus:ring-1 focus:ring-[#FF5A1F]">
                      <option value="" className="bg-[#1C1C1C]">Select</option>
                      <option className="bg-[#1C1C1C]">Sufficient</option><option className="bg-[#1C1C1C]">Limited</option><option className="bg-[#1C1C1C]">Critical shortage</option><option className="bg-[#1C1C1C]">Contaminated</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#9A9A9A] uppercase tracking-wider block mb-1">Observed Hazard</label>
                    <select className="w-full text-sm border border-white/10 rounded-xl px-3 py-2 bg-[#232323] text-white focus:outline-none focus:ring-1 focus:ring-[#FF5A1F]">
                      <option value="" className="bg-[#1C1C1C]">Select</option>
                      <option className="bg-[#1C1C1C]">Active flooding</option><option className="bg-[#1C1C1C]">Visible erosion</option><option className="bg-[#1C1C1C]">Landslide scars</option><option className="bg-[#1C1C1C]">Storm damage</option><option className="bg-[#1C1C1C]">None observed</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#9A9A9A] uppercase tracking-wider block mb-1">Infrastructure Condition</label>
                    <select className="w-full text-sm border border-white/10 rounded-xl px-3 py-2 bg-[#232323] text-white focus:outline-none focus:ring-1 focus:ring-[#FF5A1F]">
                      <option value="" className="bg-[#1C1C1C]">Select</option>
                      <option className="bg-[#1C1C1C]">Functional</option><option className="bg-[#1C1C1C]">Partially functional</option><option className="bg-[#1C1C1C]">Non-functional</option><option className="bg-[#1C1C1C]">Destroyed</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Notes & Photo */}
              <div>
                <label className="text-[11px] font-bold text-[#9A9A9A] uppercase tracking-wider block mb-1">Field Notes</label>
                <textarea rows={3} placeholder="Additional observations, concerns, or recommendations..." className="w-full text-sm border border-white/10 rounded-xl px-3 py-2 bg-[#232323] text-white focus:outline-none focus:ring-1 focus:ring-[#FF5A1F] resize-none" />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#9A9A9A] uppercase tracking-wider block mb-1">Photo Evidence</label>
                <div className="border-2 border-dashed border-white/10 rounded-2xl p-6 text-center cursor-pointer hover:bg-[#232323] transition-colors">
                  <Camera size={24} className="text-[#FF5A1F] mx-auto mb-2" />
                  <p className="text-xs text-[#9A9A9A] font-medium">Click to upload or drag and drop</p>
                  <p className="text-[10px] text-[#6B6B6B] mt-1 font-mono">JPEG, PNG up to 10MB</p>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 text-sm font-bold py-3 rounded-xl bg-gradient-to-r from-[#FF7A3D] to-[#FF3D1F] text-white shadow-[0_0_24px_rgba(255,90,31,0.35)] hover:shadow-[0_0_36px_rgba(255,90,31,0.55)] transition-all disabled:opacity-50 cursor-pointer"
              >
                {submitting ? <Loader2 size={16} className="animate-spin" /> : <Upload size={15} />}
                {submitting ? 'Submitting...' : 'Submit Verification'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
