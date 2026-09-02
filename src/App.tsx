import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PublicExploreLanding } from '@/pages/public/PublicExploreLanding';
import { DisasterExplorationDetail } from '@/pages/public/DisasterExplorationDetail';
import { WorkspaceLayout } from '@/components/workspace/WorkspaceLayout';
import { CommandCenter } from '@/pages/CommandCenter';
import { RiskIntelligence } from '@/pages/RiskIntelligence';
import { HistoricalIntelligence } from '@/pages/HistoricalIntelligence';
import { Habitations } from '@/pages/Habitations';
import { HabitationDetail } from '@/pages/HabitationDetail';
import { RelocationIntelligence } from '@/pages/RelocationIntelligence';
import { SafeSites } from '@/pages/SafeSites';
import { RelocationOptimization } from '@/pages/RelocationOptimization';
import { Analytics } from '@/pages/Analytics';
import { Reports } from '@/pages/Reports';
import { FieldVerification } from '@/pages/FieldVerification';
import { DataMethodology } from '@/pages/DataMethodology';
import { SettingsPage } from '@/pages/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* EXPERIENCE 1 — PUBLIC EXPLORE */}
        <Route path="/" element={<PublicExploreLanding />} />
        <Route path="/explore/:disasterId" element={<DisasterExplorationDetail />} />

        {/* EXPERIENCE 2 — AUTHORITY DECISION WORKSPACE */}
        <Route
          path="/workspace/*"
          element={
            <WorkspaceLayout>
              <Routes>
                {/* MONITOR */}
                <Route path="" element={<CommandCenter />} />

                {/* ASSESS */}
                <Route path="risk" element={<RiskIntelligence />} />
                <Route path="historical" element={<HistoricalIntelligence />} />
                <Route path="communities" element={<Habitations />} />
                <Route path="communities/:id" element={<HabitationDetail />} />

                {/* PLAN */}
                <Route path="relocation" element={<RelocationIntelligence />} />
                <Route path="safe-sites" element={<SafeSites />} />
                <Route path="optimization" element={<RelocationOptimization />} />

                {/* OPERATE */}
                <Route path="field-verification" element={<FieldVerification />} />

                {/* REVIEW */}
                <Route path="analytics" element={<Analytics />} />
                <Route path="reports" element={<Reports />} />
                <Route path="data-methodology" element={<DataMethodology />} />

                {/* SYSTEM */}
                <Route path="settings" element={<SettingsPage />} />

                {/* Aliases / Fallbacks */}
                <Route path="habitations" element={<Navigate to="/workspace/communities" replace />} />
                <Route path="habitations/:id" element={<HabitationDetailWrapper />} />
              </Routes>
            </WorkspaceLayout>
          }
        />

        {/* Fallback redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

// Wrapper for /workspace/habitations/:id compatibility alias
import { useParams } from 'react-router-dom';
function HabitationDetailWrapper() {
  const { id } = useParams();
  return <Navigate to={`/workspace/communities/${id}`} replace />;
}
