import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import styles from './App.module.scss';
import AppNavigation from '../../components/AppNavigation/AppNavigation';
import Messages from '../Messages/Messages';
import Likes from '../Likes/Likes';
import Profile from '../Profile/Profile';
import AddOffer from '../AddOffer/AddOffer';

const App: React.FC = () => {
  const token = localStorage.getItem('authToken');
  const isCompleted = localStorage.getItem('onboardingCompleted');
  const accountType = localStorage.getItem('accountType');
  const location = useLocation();

  if (!token) {
    return <Navigate to="/auth" replace />;
  }
  if (isCompleted !== 'true') {
    return <Navigate to="/onboarding" replace />;
  }

  let content;
  switch (location.pathname) {
    case '/messages':
      content = <Messages />;
      break;
    case '/likes':
      content = accountType === 'candidat' ? <Likes /> : <Navigate to="/" replace />;
      break;
    case '/ajouter-offre':
      content = accountType === 'entreprise' ? <AddOffer /> : <Navigate to="/" replace />;
      break;
    case '/profile':
      content = <Profile />;
      break;
    case '/':
    default:
      content = (
        <>
          <h1>HireSwipe</h1>
          <p>Bienvenue sur la page d'accueil ! 🎉</p>
        </>
      );
      break;
  }

  return (
    <div className={styles.appRoot}>
      {content}
      <AppNavigation />
    </div>
  );
};

export default App;