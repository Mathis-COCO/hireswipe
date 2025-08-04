import React, { useState } from 'react';
import styles from './RegisterForm.module.scss';
import InputFieldAuth from '../../Inputs/InputfieldAuth/InputfieldAuth';
import Button from '../../Buttons/AuthButton/AuthButton';
import RoleSelector from '../../RoleSelector/RoleSelector';
import PasswordStrengthIndicator from '../../PasswordStrengthIndicator/PasswordStrengthIndicator';
import { isPasswordStrong } from '../../../utils/passwordValidation';

interface RegisterFormProps {
  onSubmit: (data: { firstName: string; email: string; password: string; role: 'candidat' | 'entreprise' }) => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVerification, setPasswordVerification] = useState('');
  const [role, setRole] = useState<'candidat' | 'entreprise'>('candidat');
  const [showPasswordMismatch, setShowPasswordMismatch] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isPasswordStrong(password)) {
      alert('Le mot de passe ne respecte pas les critères de sécurité requis.');
      return;
    }

    if (password !== passwordVerification) {
      setShowPasswordMismatch(true);
      return;
    }

    setShowPasswordMismatch(false);
    onSubmit({ firstName, email, password, role });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.registerForm}>
      <h2 className={styles.formTitle}>Créer un compte</h2>
      <p className={styles.formDescription}>Rejoignez HireSwipe et trouvez votre match professionnel</p>

      <div className={styles.fullName}>
        <InputFieldAuth
          label="Prénom"
          type="text"
          placeholder="Votre prénom"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <InputFieldAuth
          label="Nom"
          type="text"
          placeholder="Votre nom"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
      </div>

      <InputFieldAuth
        label="Email"
        type="email"
        placeholder="votre@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <div className={styles.passwordFields}>
        <InputFieldAuth
          label="Mot de passe"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (showPasswordMismatch && passwordVerification && e.target.value === passwordVerification) {
              setShowPasswordMismatch(false);
            }
          }}
          hasError={showPasswordMismatch}
          required
        />
        <InputFieldAuth
          label="Valider le mot de passe"
          type="password"
          placeholder="••••••••"
          value={passwordVerification}
          onChange={(e) => {
            setPasswordVerification(e.target.value);
            if (showPasswordMismatch && password === e.target.value) {
              setShowPasswordMismatch(false);
            }
          }}
          hasError={showPasswordMismatch}
          required
        />
      </div>

      <PasswordStrengthIndicator password={password} />

      {showPasswordMismatch && (
        <p className={styles.passwordMismatchWarning}>Les mots de passe doivent correspondre.</p>
      )}

      <RoleSelector selectedRole={role} onSelectRole={setRole} />

      <Button type="submit" label="Créer mon compte" />
    </form>
  );
};

export default RegisterForm;