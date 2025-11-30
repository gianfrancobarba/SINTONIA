import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import PsychologistDashboard from './pages/PsychologistDashboard';
import AdminDashboard from './pages/AdminDashboard';
import QuestionnaireManagement from './pages/QuestionnaireManagement';
import ForumPage from './pages/ForumPage';
import ClinicalAlerts from './pages/ClinicalAlerts';
import SpidCallback from './pages/SpidCallback';
import { getCurrentUser } from './services/auth.service';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const user = getCurrentUser();
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>

        {/* Login per admin/psicologi */}
        <Route path="/login" element={<Login />} />


        {/* Dashboard admin/psicologo */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <PsychologistDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        />

        {/* Gestione Questionari - accessible by both psychologists and admins */}
        <Route
          path="/questionnaires"
          element={
            <PrivateRoute>
              <QuestionnaireManagement />
            </PrivateRoute>
          }
        />

        {/* Forum - accessible by both psychologists and admins */}
        <Route
          path="/forum"
          element={
            <PrivateRoute>
              <ForumPage />
            </PrivateRoute>
          }
        />

        {/* Clinical Alerts - accessible by psychologists */}
        <Route
          path="/clinical-alerts"
          element={
            <PrivateRoute>
              <ClinicalAlerts />
            </PrivateRoute>
          }
        />

        <Route path="/spid-callback" element={<SpidCallback />} />
        {/* Default route */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App
