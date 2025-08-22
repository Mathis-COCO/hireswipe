import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import styles from './App.module.scss';
import AppNavigation from '../components/AppNavigation/AppNavigation';
import Messages from './Messages/Messages';
import Likes from './Likes/Likes';
import MyOffers from './MyOffers/MyOffers';
import { authService } from '../services/authService';
import AddOffer from './AddOffer/AddOffer';
import CandidateFeed from './Feed/CandidateFeed/CandidateFeed';
import RecruiterFeed from './Feed/RecruiterFeed/RecruiterFeed';
import CandidateProfile from './Profile/CandidateProfile/CandidateProfile';
import RecruiterProfile from './Profile/RecruiterProfile/RecruiterProfile';

const App: React.FC = () => {
  const token = localStorage.getItem('authToken');
  const location = useLocation();
  const [accountType, setAccountType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await authService.getCurrentUser();
        setAccountType(userData.role);
        if (!userData.firstName || !userData.companyName) {
          window.location.replace('/onboarding');
        }
      } catch {
        localStorage.removeItem('authToken');
        window.location.replace('/auth');
      } finally {
        setLoading(false);
      }
    };

    // The conditional logic is now inside the effect.
    if (token) {
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, [token]);

  // The conditional redirection remains at the top level,
  // outside of any hooks, which is correct.
  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  if (loading || accountType === null) {
    return <div>Chargement...</div>;
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
    case '/mes-offres':
      content = accountType === 'entreprise' ? <MyOffers /> : <Navigate to="/" replace />;
      break;
    case '/profile':
      content = accountType === 'candidat' ? <CandidateProfile /> : <RecruiterProfile />;
      break;
    case '/':
      content = accountType === 'candidat' ? <CandidateFeed /> : <MyOffers />;
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