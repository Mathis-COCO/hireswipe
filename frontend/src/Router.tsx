import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/Auth/AuthPage';
import Onboarding from './pages/Onboarding/Onboarding';
import ProtectedOnboarding from './components/ProtectedRoute/ProtectedRoute';
import { authService } from '../src/services/authService';

interface UserData {
  firstName?: string;
  companyName?: string;
}

const ProtectedHome: React.FC = () => {
  const token = localStorage.getItem('authToken');

  if (token) {
    authService.getCurrentUser().then((userData: UserData) => {
      if (userData.firstName || userData.companyName) {
        return <Navigate to="/" replace />;
      } else {
        return <Navigate to="/onboarding" replace />;
      }
    });
  } else {
    return <Navigate to="/auth" replace />;
  }

  return <div>Page d'accueil - onboarding terminé</div>;
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route
          path="/onboarding"
          element={
            <ProtectedOnboarding>
              <Onboarding />
            </ProtectedOnboarding>
          }
        />
        <Route path="/" element={<ProtectedHome />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
