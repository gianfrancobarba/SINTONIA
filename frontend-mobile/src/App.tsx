import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { isAuthenticated } from './services/spid-auth.service';
import Splash from './pages/Splash';
import Welcome from './pages/Welcome';
import SPIDInfo from './pages/SPIDInfo';
import SPIDCallback from './pages/SPIDCallback';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Questionari from './pages/Questionari';
import QuestionnaireCompilation from './pages/QuestionnaireCompilation';
import SPIDError from './pages/SPIDError';
import './App.css';

import Terms from './pages/Terms';
import { getCurrentPatient } from './services/spid-auth.service';
import Forum from './pages/Forum';
import CreatePost from './pages/CreatePost';
import EditPost from './pages/EditPost';
import Settings from './pages/Settings';
import PersonalInfo from './pages/PersonalInfo.tsx';
import TechnicalSupport from './pages/TechnicalSupport.tsx';
import Badges from './pages/Badges.tsx';
import Notifications from './pages/Notifications';
import Diary from './pages/Diary';
import NewDiaryPage from './pages/NewDiaryPage';
import EditDiaryPage from './pages/EditDiaryPage';
import MainLayout from './components/MainLayout';
import MoodEntry from './pages/MoodEntry';

// Protected Route Component
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/spid-info" replace />;
  }

  const user = getCurrentPatient();
  if (user && !user.terms) {
    return <Navigate to="/terms" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/spid-info" element={<SPIDInfo />} />
        <Route path="/spid-callback" element={<SPIDCallback />} />

        {/* Terms page should be protected but accessible without terms accepted */}
        <Route path="/terms" element={
          isAuthenticated() ? <Terms /> : <Navigate to="/spid-info" replace />
        } />

        <Route element={<MainLayout />}>
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/forum"
            element={
              <PrivateRoute>
                <Forum />
              </PrivateRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <PrivateRoute>
                <Notifications />
              </PrivateRoute>
            }
          />
          <Route
            path="/diary"
            element={
              <PrivateRoute>
                <Diary />
              </PrivateRoute>
            }
          />
        </Route>

        {/* Routes without BottomNavigation */}
        <Route
          path="/questionari"
          element={
            <PrivateRoute>
              <Questionari />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <Settings />
            </PrivateRoute>
          }
        />
        <Route
          path="/badges"
          element={
            <PrivateRoute>
              <Badges />
            </PrivateRoute>
          }
        />

        {/* Sub-pages without BottomNavigation */}
        <Route
          path="/settings/personal-info"
          element={
            <PrivateRoute>
              <PersonalInfo />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings/support"
          element={
            <PrivateRoute>
              <TechnicalSupport />
            </PrivateRoute>
          }
        />
        <Route
          path="/compilation"
          element={
            <PrivateRoute>
              <QuestionnaireCompilation />
            </PrivateRoute>
          }
        />
        <Route
          path="/forum/create"
          element={
            <PrivateRoute>
              <CreatePost />
            </PrivateRoute>
          }
        />
        <Route
          path="/forum/edit/:id"
          element={
            <PrivateRoute>
              <EditPost />
            </PrivateRoute>
          }
        />
        <Route
          path="/new-diary-page"
          element={
            <PrivateRoute>
              <NewDiaryPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/edit-diary-page"
          element={
            <PrivateRoute>
              <EditDiaryPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/mood-entry"
          element={
            <PrivateRoute>
              <MoodEntry />
            </PrivateRoute>
          }
        />
        <Route path="/spid-error" element={
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <h1>Errore autenticazione SPID</h1>
            <p>Si è verificato un errore durante l'autenticazione.</p>
            <a href="/">Torna alla home</a>
          </div>
        } />
        <Route path="/spid-error" element={<SPIDError />} />
      </Routes>
    </Router>
  );
}

export default App;
