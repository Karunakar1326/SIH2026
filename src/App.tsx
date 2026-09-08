import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PublicExploreLanding } from '@/pages/public/PublicExploreLanding';
import { DisasterExplorationDetail } from '@/pages/public/DisasterExplorationDetail';
import { WorkspaceLayout } from '@/components/workspace/WorkspaceLayout';
import { CommandCenter } from '@/pages/CommandCenter';
import { HazardMonitoring } from '@/pages/HazardMonitoring';
import { EarlyWarning } from '@/pages/EarlyWarning';
import { IntensityAssessment } from '@/pages/IntensityAssessment';
import { RiskIntelligence } from '@/pages/RiskIntelligence';
import { Habitations } from '@/pages/Habitations';
import { HabitationDetail } from '@/pages/HabitationDetail';
import { HistoricalIntelligence } from '@/pages/HistoricalIntelligence';
import { FieldVerification } from '@/pages/FieldVerification';
import { RelocationIntelligence } from '@/pages/RelocationIntelligence';
import { SafeSites } from '@/pages/SafeSites';
import { CapacityAccessibility } from '@/pages/CapacityAccessibility';
import { RelocationOptimization } from '@/pages/RelocationOptimization';
import { ScenariosWhatIf } from '@/pages/ScenariosWhatIf';
import { Analytics } from '@/pages/Analytics';
import { Reports } from '@/pages/Reports';
import { DataMethodology } from '@/pages/DataMethodology';
import { SettingsPage } from '@/pages/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* EXPERIENCE 1 — PUBLIC EXPLORE (UNTOUCHED) */}
        <Route path="/" element={<PublicExploreLanding />} />
        <Route path="/explore/:disasterId" element={<DisasterExplorationDetail />} />

        {/* EXPERIENCE 2 — AUTHORITY DECISION WORKSPACE */}
        <Route
          path="/workspace/*"
          element={
            <WorkspaceLayout>
              <Routes>
                {/* OVERVIEW */}
                <Route path="" element={<CommandCenter />} />

                {/* MONITOR */}
                <Route path="monitor" element={<HazardMonitoring />} />
                <Route path="early-warning" element={<EarlyWarning />} />

                {/* RISK INTELLIGENCE */}
                <Route path="intensity" element={<IntensityAssessment />} />
                <Route path="risk-map" element={<RiskIntelligence />} />
                <Route path="exposure" element={<Habitations />} />
                <Route path="exposure/:id" element={<HabitationDetail />} />
                <Route path="historical" element={<HistoricalIntelligence />} />

                {/* FIELD OPERATIONS */}
                <Route path="field-verification" element={<FieldVerification />} />

                {/* RELOCATION */}
                <Route path="relocation" element={<RelocationIntelligence />} />
                <Route path="safe-sites" element={<SafeSites />} />
                <Route path="capacity" element={<CapacityAccessibility />} />
                <Route path="planner" element={<RelocationOptimization />} />

                {/* SYSTEM */}
                <Route path="reports" element={<Reports />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="data-methodology" element={<DataMethodology />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="scenarios" element={<ScenariosWhatIf />} />

                {/* REDIRECT ALIASES — backwards compatibility */}
                <Route path="risk" element={<Navigate to="/workspace/risk-map" replace />} />
                <Route path="communities" element={<Navigate to="/workspace/exposure" replace />} />
                <Route path="communities/:id" element={<HabitationDetailRedirect />} />
                <Route path="optimization" element={<Navigate to="/workspace/planner" replace />} />
                <Route path="habitations" element={<Navigate to="/workspace/exposure" replace />} />
                <Route path="habitations/:id" element={<HabitationDetailRedirect />} />
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

// Wrapper for old habitation detail route compatibility
import { useParams } from 'react-router-dom';
function HabitationDetailRedirect() {
  const { id } = useParams();
  return <Navigate to={`/workspace/exposure/${id}`} replace />;
}
