import React, { useState } from 'react';
import styles from './AuthPage.module.scss';
import RegisterForm from '../../components/Forms/RegisterForm/RegisterForm';
import LoginForm from '../../components/Forms/LoginForm/LoginForm';
import TabButton from '../../components/Buttons/TabButton/TabButton';
import { HeartHandshake } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { RegisterData, LoginData } from '../../types/auth';
import { useNavigate } from 'react-router-dom';

const AuthForm: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'register' | 'login'>('register');
  const { register, login, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleRegisterSubmit = async (data: { email: string; password: string; role: 'candidat' | 'entreprise' }) => {
    clearError();
    const result = await register(data);
    
    if (result.success) {
      navigate('/onboarding');
    }
  };

  const handleLoginSubmit = async (data: LoginData) => {
    clearError();
    const result = await login(data);
    
    if (result.success) {
      console.log("Connexion réussie, redirection vers l'onboarding");
      const isCompleted = localStorage.getItem('onboardingCompleted');
      if (isCompleted === 'true') {
        navigate('/');
      } else {
        navigate('/onboarding');
      }
    }
  };

  const handleTabChange = (tab: 'register' | 'login') => {
    setActiveTab(tab);
    clearError();
  };

  return (
    <div className={styles.authPageContainer}>
        <div className={styles.container}>
            <div className={styles.logoSection}>
            <div className={styles.logoHeart}>
                <HeartHandshake color='white' />
            </div>
            <div className={styles.logoText}>HireSwipe</div>
            <div className={styles.slogan}>La rencontre entre talent et opportunité</div>
        </div>

        <div className={styles.tabs}>
            <TabButton
            label="Inscription"
            isActive={activeTab === 'register'}
            onClick={() => handleTabChange('register')}
            />
            <TabButton
            label="Connexion"
            isActive={activeTab === 'login'}
            onClick={() => handleTabChange('login')}
            />
        </div>

        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        <div className={styles.formSection}>
            <div className={styles.formWrapper}>
              <div className={`${styles.formContainer} ${styles.registerContainer} ${activeTab === 'register' ? styles.active : ''}`}>
                <RegisterForm onSubmit={handleRegisterSubmit} />
              </div>
              <div className={`${styles.formContainer} ${styles.loginContainer} ${activeTab === 'login' ? styles.active : ''}`}>
                <LoginForm onSubmit={handleLoginSubmit} />
              </div>
            </div>
        </div>
        </div>
    </div>
  );
};

export default AuthForm;