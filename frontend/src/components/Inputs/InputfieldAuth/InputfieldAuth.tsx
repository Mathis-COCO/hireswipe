import React, { useState } from 'react';
import styles from './InputfieldAuth.module.scss';
import { Eye, EyeOff } from 'lucide-react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hasError?: boolean;
}

const InputFieldAuth: React.FC<InputFieldProps> = ({ label, type, hasError, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordField = type === 'password';
  const inputType = isPasswordField && showPassword ? 'text' : type;

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className={styles.formGroup}>
      <label htmlFor={props.id || props.name} className={styles.label}>
        {label}
      </label>
      <div className={styles.inputWrapper}>
        <input 
          className={`${styles.input} ${hasError ? styles.inputError : ''}`} 
          type={inputType} 
          {...props} 
        />
        {isPasswordField && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className={styles.passwordToggleButton}
            aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
    </div>
  );
};

export default InputFieldAuth;