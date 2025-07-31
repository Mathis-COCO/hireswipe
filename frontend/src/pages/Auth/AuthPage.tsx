import React, { useState } from 'react';
import styles from './AuthPage.module.scss';
import RegisterForm from '../../components/Forms/RegisterForm/RegisterForm';
import LoginForm from '../../components/Forms/LoginForm/LoginForm';
import TabButton from '../../components/Buttons/TabButton/TabButton';
import { HeartHandshake } from 'lucide-react';

const AuthForm: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'register' | 'login'>('register');

  const handleRegisterSubmit = (data: { firstName: string; email: string; password: string; role: 'candidat' | 'entreprise' }) => {
    console.log('Données d\'inscription soumises :', data);
    alert('Inscription soumise (voir console pour les données) !');
  };

  const handleLoginSubmit = (data: { email: string; password: string }) => {
    console.log('Données de connexion soumises :', data);
    alert('Connexion soumise (voir console pour les données) !');
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
            onClick={() => setActiveTab('register')}
            />
            <TabButton
            label="Connexion"
            isActive={activeTab === 'login'}
            onClick={() => setActiveTab('login')}
            />
        </div>

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