import React, { useState } from 'react';
import styles from './LoginForm.module.scss';
import InputField from '../../Inputs/InputfieldAuth/InputfieldAuth';
import Button from '../../Buttons/AuthButton/AuthButton';

interface LoginFormProps {
  onSubmit: (data: { email: string; password: string }) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ email, password });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.loginForm}>
      <h2 className={styles.formTitle}>Connexion</h2>
      <p className={styles.formDescription}>Connectez-vous à votre compte HireSwipe</p>

      <InputField
        label="Email"
        type="email"
        placeholder="votre@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <InputField
        label="Mot de passe"
        type="password"
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <Button type="submit" label="Se connecter" />
    </form>
  );
};

export default LoginForm;