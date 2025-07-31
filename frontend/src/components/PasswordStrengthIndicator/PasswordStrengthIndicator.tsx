import React from 'react';
import styles from './PasswordStrengthIndicator.module.scss';
import { getPasswordStrength } from '../../utils/passwordValidation';

interface PasswordStrengthIndicatorProps {
  password: string;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ password }) => {
  if (!password) return null;

  const passwordStrength = getPasswordStrength(password);

  return (
    <div className={styles.passwordStrength}>
      <div className={styles.strengthHeader}>
        <span>Sécurité du mot de passe :</span>
        <span className={`${styles.strengthLevel} ${styles[`strength${passwordStrength.score}`]}`}>
          {passwordStrength.score < 2 ? 'Faible' :
           passwordStrength.score < 4 ? 'Moyen' : 'Fort'}
        </span>
      </div>
      <div className={styles.requirements}>
        <div className={`${styles.requirement} ${passwordStrength.requirements.minLength ? styles.valid : styles.invalid}`}>
          ✓ Au moins 8 caractères
        </div>
        <div className={`${styles.requirement} ${passwordStrength.requirements.hasUppercase ? styles.valid : styles.invalid}`}>
          ✓ Une lettre majuscule
        </div>
        <div className={`${styles.requirement} ${passwordStrength.requirements.hasLowercase ? styles.valid : styles.invalid}`}>
          ✓ Une lettre minuscule
        </div>
        <div className={`${styles.requirement} ${passwordStrength.requirements.hasNumber ? styles.valid : styles.invalid}`}>
          ✓ Un chiffre
        </div>
        <div className={`${styles.requirement} ${passwordStrength.requirements.hasSpecialChar ? styles.valid : styles.invalid}`}>
          ✓ Un caractère spécial (!@#$%^&*)
        </div>
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator;
