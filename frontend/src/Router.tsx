import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/Auth/AuthPage';
import Onboarding from './pages/Onboarding/Onboarding';
import ProtectedOnboarding from './components/ProtectedRoute/ProtectedRoute';
import { authService } from './services/authService';

interface UserData {
  firstName?: string;
  companyName?: string;
}

const ProtectedHome: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [redirectTo, setRedirectTo] = useState<string | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setRedirectTo('/auth');
        setLoading(false);
        return;
      }

      const userData: UserData = await authService.getCurrentUser();
      if (userData.firstName || userData.companyName) {
        setRedirectTo('/');
      } else {
        setRedirectTo('/onboarding');
      }
      setLoading(false);
    };

    checkUser();
  }, []);

  if (loading) return <div>Chargement...</div>;
  if (redirectTo) return <Navigate to={redirectTo} replace />;
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