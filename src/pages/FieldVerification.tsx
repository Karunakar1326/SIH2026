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
      <div className="flex flex-col h-full">
        <PageHeader title="Field Verification" subtitle="Ground-truth data submission" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <Check size={32} className="text-green-600" />
            </div>
            <h2 className="text-lg font-bold text-neutral-900 mb-2">Verification Submitted</h2>
            <p className="text-sm text-neutral-500 mb-4">Your field observation has been recorded and will be incorporated into the habitation assessment.</p>
            <button onClick={() => setSubmitted(false)} className="text-sm text-accent hover:underline">Submit another verification</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <PageHeader title="Field Verification" subtitle="Submit ground-truth observations from field visits" />

      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white border border-neutral-200 rounded-lg p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Location */}
              <div>
                <SectionHeader title="Location" />
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div>
                    <label className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider block mb-1">Habitation Name</label>
                    <input type="text" placeholder="Enter habitation name" className="w-full text-sm border border-neutral-200 rounded-md px-3 py-2 bg-neutral-50 focus:outline-none focus:ring-1 focus:ring-accent" required />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider block mb-1">District</label>
                    <select className="w-full text-sm border border-neutral-200 rounded-md px-3 py-2 bg-neutral-50 focus:outline-none focus:ring-1 focus:ring-accent" required>
                      <option value="">Select district</option>
                      <option>Ganjam</option><option>Puri</option><option>Jagatsinghpur</option><option>Kendrapara</option><option>Balasore</option>
                    </select>
                  </div>
                </div>
                <div className="mt-3">
                  <label className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider block mb-1">GPS Coordinates</label>
                  <div className="flex gap-2">
                    <input type="text" placeholder="Latitude" className="flex-1 text-sm border border-neutral-200 rounded-md px-3 py-2 bg-neutral-50 focus:outline-none focus:ring-1 focus:ring-accent" />
                    <input type="text" placeholder="Longitude" className="flex-1 text-sm border border-neutral-200 rounded-md px-3 py-2 bg-neutral-50 focus:outline-none focus:ring-1 focus:ring-accent" />
                    <button type="button" className="flex items-center gap-1 text-xs font-medium px-3 py-2 rounded-md border border-neutral-200 text-neutral-700 hover:bg-neutral-50">
                      <MapPin size={12} /> Get GPS
                    </button>
                  </div>
                </div>
              </div>

              {/* Observations */}
              <div>
                <SectionHeader title="Observations" />
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div>
                    <label className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider block mb-1">Estimated Population</label>
                    <input type="number" placeholder="e.g. 2500" className="w-full text-sm border border-neutral-200 rounded-md px-3 py-2 bg-neutral-50 focus:outline-none focus:ring-1 focus:ring-accent" />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider block mb-1">Housing Condition</label>
                    <select className="w-full text-sm border border-neutral-200 rounded-md px-3 py-2 bg-neutral-50 focus:outline-none focus:ring-1 focus:ring-accent">
                      <option value="">Select</option>
                      <option>Good</option><option>Fair</option><option>Poor</option><option>Severely Damaged</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider block mb-1">Road Condition</label>
                    <select className="w-full text-sm border border-neutral-200 rounded-md px-3 py-2 bg-neutral-50 focus:outline-none focus:ring-1 focus:ring-accent">
                      <option value="">Select</option>
                      <option>All-weather accessible</option><option>Partially damaged</option><option>Impassable</option><option>No road access</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider block mb-1">Water Availability</label>
                    <select className="w-full text-sm border border-neutral-200 rounded-md px-3 py-2 bg-neutral-50 focus:outline-none focus:ring-1 focus:ring-accent">
                      <option value="">Select</option>
                      <option>Sufficient</option><option>Limited</option><option>Critical shortage</option><option>Contaminated</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider block mb-1">Observed Hazard</label>
                    <select className="w-full text-sm border border-neutral-200 rounded-md px-3 py-2 bg-neutral-50 focus:outline-none focus:ring-1 focus:ring-accent">
                      <option value="">Select</option>
                      <option>Active flooding</option><option>Visible erosion</option><option>Landslide scars</option><option>Storm damage</option><option>None observed</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider block mb-1">Infrastructure Condition</label>
                    <select className="w-full text-sm border border-neutral-200 rounded-md px-3 py-2 bg-neutral-50 focus:outline-none focus:ring-1 focus:ring-accent">
                      <option value="">Select</option>
                      <option>Functional</option><option>Partially functional</option><option>Non-functional</option><option>Destroyed</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Notes & Photo */}
              <div>
                <label className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider block mb-1">Field Notes</label>
                <textarea rows={3} placeholder="Additional observations, concerns, or recommendations..." className="w-full text-sm border border-neutral-200 rounded-md px-3 py-2 bg-neutral-50 focus:outline-none focus:ring-1 focus:ring-accent resize-none" />
              </div>

              <div>
                <label className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider block mb-1">Photo Evidence</label>
                <div className="border-2 border-dashed border-neutral-200 rounded-md p-6 text-center cursor-pointer hover:bg-neutral-50 transition-colors">
                  <Camera size={24} className="text-neutral-400 mx-auto mb-2" />
                  <p className="text-xs text-neutral-500">Click to upload or drag and drop</p>
                  <p className="text-[10px] text-neutral-400 mt-1">JPEG, PNG up to 10MB</p>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 text-sm font-medium py-2.5 rounded-md bg-accent text-white hover:bg-accent-dark transition-colors disabled:opacity-50"
              >
                {submitting ? <Loader2 size={16} className="animate-spin" /> : <Upload size={14} />}
                {submitting ? 'Submitting...' : 'Submit Verification'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
