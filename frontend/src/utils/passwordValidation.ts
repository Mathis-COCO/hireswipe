export interface PasswordRequirements {
  minLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}

export interface PasswordStrength {
  requirements: PasswordRequirements;
  score: number;
}

export const getPasswordStrength = (password: string): PasswordStrength => {
  const requirements: PasswordRequirements = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };

  const score = Object.values(requirements).filter(Boolean).length;
  return { requirements, score };
};

export const isPasswordStrong = (password: string): boolean => {
  const { score } = getPasswordStrength(password);
  return score >= 4;
};
