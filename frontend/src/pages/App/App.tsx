import React from 'react';
import { Navigate } from 'react-router-dom';
import styles from './App.module.scss';

// Redirection selon token et onboarding
const App: React.FC = () => {
  const token = localStorage.getItem('authToken');
  const isCompleted = localStorage.getItem('onboardingCompleted');

  if (!token) {
    return <Navigate to="/auth" replace />;
  }
  if (isCompleted !== 'true') {
    return <Navigate to="/onboarding" replace />;
  }

  return (
    <div className={styles.appRoot}>
      <h1>HireSwipe</h1>
      <p>Bienvenue sur la page d'accueil ! 🎉</p>
    </div>
  );
};

export default App;