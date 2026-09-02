import { useParams, useNavigate, Link } from 'react-router-dom';
import { PublicHeader } from '@/components/public/PublicHeader';
import { disasterCategories } from '@/components/public/DisasterHazardGrid';
import { ArrowLeft, Lock, ArrowRight } from 'lucide-react';

export function DisasterExplorationDetail() {
  const { disasterId } = useParams<{ disasterId: string }>();
  const navigate = useNavigate();

  const category = disasterCategories.find(c => c.id === disasterId) || disasterCategories[0];

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans flex flex-col">
      <PublicHeader />

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-10 space-y-8">
        {/* Back Link */}
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white font-semibold transition-colors">
          <ArrowLeft size={14} /> Back to Public Explore
        </Link>

        {/* Title Header */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-md flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-4xl text-accent">{category.icon}</span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-white">{category.name} ANALYSIS</h1>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${
                  category.status === 'implemented' ? 'bg-emerald-950 text-emerald-400 border-emerald-800' : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                }`}>
                  {category.status === 'implemented' ? 'MODEL IMPLEMENTED' : 'PLANNED MODEL'}
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-1">{category.description}</p>
            </div>
          </div>

          <button
            onClick={() => navigate('/workspace')}
            className="px-4 py-2 bg-accent text-white text-xs font-bold rounded hover:bg-accent-dark transition-colors flex items-center gap-1.5 shrink-0"
          >
            <Lock size={13} /> Authority Access
          </button>
        </div>

        {/* Breakdown Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* What is measured */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5">
            <h3 className="text-xs font-bold text-accent uppercase tracking-wider mb-3">1. Measured Inputs & Authoritative Datasets</h3>
            <ul className="space-y-2 text-xs text-neutral-300">
              {category.measuredInputs.map((inp, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-neutral-950 p-2.5 rounded border border-neutral-850">
                  <span className="text-accent font-bold">•</span>
                  <span>{inp}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* NEXUS Derived Assessment */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5">
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3">2. NEXUS Derived Assessments</h3>
            <ul className="space-y-2 text-xs text-neutral-300">
              {category.nexusAssessment.map((ass, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-neutral-950 p-2.5 rounded border border-neutral-850">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>{ass}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Workflow Pipeline for this hazard */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 text-xs space-y-3">
          <h3 className="font-bold text-white uppercase text-xs">NEXUS Decision Workflow for {category.name}</h3>
          <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
            <span className="bg-neutral-950 px-3 py-1.5 rounded border border-neutral-800">Raw Observations (IMD/CWC/ISRO)</span>
            <ArrowRight size={12} className="text-neutral-500" />
            <span className="bg-neutral-950 px-3 py-1.5 rounded border border-neutral-800">Vulnerability Index</span>
            <ArrowRight size={12} className="text-neutral-500" />
            <span className="bg-neutral-950 px-3 py-1.5 rounded border border-neutral-800">Historical Recurrence</span>
            <ArrowRight size={12} className="text-neutral-500" />
            <span className="bg-neutral-950 px-3 py-1.5 rounded border border-neutral-800 text-red-400 font-bold">Red-Zone Classification</span>
            <ArrowRight size={12} className="text-neutral-500" />
            <span className="bg-neutral-950 px-3 py-1.5 rounded border border-neutral-800 text-emerald-400 font-bold">Phased Relocation Plan</span>
          </div>
        </div>
      </main>
    </div>
  );
}
