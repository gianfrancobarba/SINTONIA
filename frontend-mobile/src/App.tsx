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
import './App.css';

import Terms from './pages/Terms';
import { getCurrentPatient } from './services/spid-auth.service';
import Forum from './pages/Forum';
import CreatePost from './pages/CreatePost';

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
          path="/questionari"
          element={
            <PrivateRoute>
              <Questionari />
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
          path="/forum"
          element={
            <PrivateRoute>
              <Forum />
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
        <Route path="/spid-error" element={
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <h1>Errore autenticazione SPID</h1>
            <p>Si è verificato un errore durante l'autenticazione.</p>
            <a href="/">Torna alla home</a>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
