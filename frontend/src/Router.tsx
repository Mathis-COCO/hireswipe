import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/Auth/AuthPage';
import Onboarding from './pages/Onboarding/Onboarding';
import ProtectedOnboarding from './components/ProtectedRoute/ProtectedRoute';

const ProtectedHome: React.FC = () => {
    const token = localStorage.getItem('authToken');
    const isCompleted = localStorage.getItem('onboardingCompleted');
    
    if (!token) {
        return <Navigate to="/auth" replace />;
    }
    
    if (isCompleted !== 'true') {
        return <Navigate to="/onboarding" replace />;
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
