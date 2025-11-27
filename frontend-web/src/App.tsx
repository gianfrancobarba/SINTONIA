import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import PsychologistDashboard from './pages/PsychologistDashboard';
import AdminDashboardPage from './pages/AdminDashboardPage';
import QuestionnaireManagement from './pages/QuestionnaireManagement';
import SpidCallback from './pages/SpidCallback';
import { getCurrentUser } from './services/auth.service';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const user = getCurrentUser();
  return user ? children : <Navigate to="/login" />;
};

const RoleRoute = ({ role, children }: { role: 'admin' | 'psychologist'; children: React.ReactNode }) => {
  const user = getCurrentUser();
  if (!user) return <Navigate to="/login" />;
  return user.role === role ? children : <Navigate to={user.role === 'admin' ? '/admin-dashboard' : '/dashboard'} />;
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
            <RoleRoute role="psychologist">
              <PsychologistDashboard />
            </RoleRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <RoleRoute role="admin">
              <AdminDashboardPage />
            </RoleRoute>
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

        <Route path="/spid-callback" element={<SpidCallback />} />
        {/* Default route */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App
