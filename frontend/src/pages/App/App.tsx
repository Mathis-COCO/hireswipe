import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import styles from './App.module.scss';
import AppNavigation from '../../components/AppNavigation/AppNavigation';
import Messages from '../Messages/Messages';
import Likes from '../Likes/Likes';
import Profile from '../Profile/Profile';
import MyOffers from '../MyOffers/MyOffers';
import { authService } from '../../services/authService';

const App: React.FC = () => {
  const token = localStorage.getItem('authToken');
  const accountType = localStorage.getItem('accountType');
  const location = useLocation();
  authService.getCurrentUser().then(userData => {
          if (userData.firstName || userData.companyName) {
            return <Navigate to="/onboarding" replace />;
          }
        });

  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  let content;
  switch (location.pathname) {
    case '/messages':
      content = <Messages />;
      break;
    case '/likes':
      content = accountType === 'candidat' ? <Likes /> : <Navigate to="/" replace />;
      break;
    case '/mes-offres':
      content = accountType === 'entreprise' ? <MyOffers /> : <Navigate to="/" replace />;
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