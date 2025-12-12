import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AppLayout from './components/AppLayout';
import PsychologistPatientList from './pages/PsychologistPatientList';
import AdminPatientList from './pages/AdminPatientList';
import AdminPsychologistList from './pages/AdminPsychologistList';
import AdminInvalidationList from './pages/AdminInvalidationList';
import AdminQuestionnaireList from './pages/AdminQuestionnaireList';
import AdminTechnicalSupport from './pages/AdminTechnicalSupport';
import QuestionnaireManagement from './pages/QuestionnaireManagement';
import ForumPage from './pages/ForumPage';
import ClinicalAlerts from './pages/ClinicalAlerts';
import PsychologistTechnicalSupport from './pages/PsychologistTechnicalSupport';
import PsychologistPersonalArea from './components/PsychologistPersonalArea';
import AdminPersonalArea from './components/AdminPersonalArea';
import SpidCallback from './pages/SpidCallback';
import SpidError from './pages/SpidError';
import NotificationCenter from './pages/NotificationCenter';
import { getCurrentUser } from './services/auth.service';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const user = getCurrentUser();
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Login page */}
        <Route path="/login" element={<Login />} />
        <Route path="/spid-callback" element={<SpidCallback />} />
        <Route path="/spid-error" element={<SpidError />} />

        {/* Psychologist Dashboard with nested routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <AppLayout role="psychologist" />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="personal-area" replace />} />
          <Route path="patients" element={<PsychologistPatientList />} />
          <Route path="questionnaires" element={<QuestionnaireManagement />} />
          <Route path="forum" element={<ForumPage />} />
          <Route path="clinical-alerts" element={<ClinicalAlerts />} />
          <Route path="technical-support" element={<PsychologistTechnicalSupport />} />
          <Route path="personal-area" element={<PsychologistPersonalArea onProfileUpdate={() => { }} />} />
          <Route path="notifications" element={<NotificationCenter />} />
        </Route>

        {/* Admin Dashboard with nested routes */}
        <Route
          path="/admin-dashboard"
          element={
            <PrivateRoute>
              <AppLayout role="admin" />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="personal-area" replace />} />
          <Route path="patients" element={<AdminPatientList />} />
          <Route path="psychologists" element={<AdminPsychologistList />} />
          <Route path="questionnaires" element={<AdminQuestionnaireList />} />
          <Route path="invalidation" element={<AdminInvalidationList />} />
          <Route path="technical-support" element={<AdminTechnicalSupport />} />
          <Route path="forum" element={<ForumPage />} />
          <Route path="personal-area" element={<AdminPersonalArea />} />
          <Route path="notifications" element={<NotificationCenter />} />
        </Route>

        {/* Legacy routes - redirect to new structure */}
        <Route path="/questionnaires" element={<Navigate to="/dashboard/questionnaires" replace />} />
        <Route path="/forum" element={<Navigate to="/dashboard/forum" replace />} />
        <Route path="/clinical-alerts" element={<Navigate to="/dashboard/clinical-alerts" replace />} />

        {/* Default route */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App

