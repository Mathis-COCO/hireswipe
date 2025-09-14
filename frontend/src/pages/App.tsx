import React from 'react';
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
import ViewProfile from './Profile/ViewProfile/ViewProfile';

const App: React.FC = () => {
  const [accountType, setAccountType] = React.useState<'candidat' | 'entreprise' | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const location = useLocation();
  const token = localStorage.getItem('authToken');

  React.useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }
    authService.getCurrentUser().then(userData => {
      if (!userData) {
        setAccountType(null);
        setIsLoading(false);
        return;
      }
      setAccountType(userData.role === 'candidat' ? 'candidat' : 'entreprise');
      setIsLoading(false);
    });
  }, [token]);

  if (!token) {
    return <Navigate to="/auth" replace />;
  }
  if (isLoading) {
    return <div className={styles.appRoot}><p>Chargement...</p></div>;
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
    default:
      if (location.pathname.startsWith('/user/')) {
        const parts = location.pathname.split('/');
        const userId = parts[2];
        content = <ViewProfile userId={userId} />;
      } else {
        content = accountType === 'candidat' ? <CandidateFeed /> : <MyOffers />;
      }
      break;
  }

  return (
    <div className={styles.appRoot}>
      {content}
      <AppNavigation accountType={accountType} />
    </div>
  );
};

export default App;