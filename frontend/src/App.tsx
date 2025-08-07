import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/Auth/AuthPage';
import Onboarding from './pages/Onboarding/Onboarding';
import ProtectedOnboarding from './components/ProtectedRoute/ProtectedRoute';

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
        <Route path="/" element={<div>Page d'accueil - onboarding terminé</div>} />
      </Routes>
    </Router>
  );
};

export default App;
