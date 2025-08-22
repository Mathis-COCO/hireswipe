import { useState } from 'react';
import { authService } from '../services/authService';
import { RegisterData, LoginData } from '../types/auth';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accountType, setAccountType] = useState<'candidat' | 'entreprise' | null>(null);

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.register(data);
      authService.saveAuthData(response);
      setAccountType(response.user?.role === 'candidat' ? 'candidat' : 'entreprise');
      return { success: true, data: response };
    } catch (err: any) {
      const errorMessage = err.message || "Erreur lors de l'inscription";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (data: LoginData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.login(data);
      authService.saveAuthData(response);
      setAccountType(response.user?.role === 'candidat' ? 'candidat' : 'entreprise');
      return { success: true, data: response };
    } catch (err: any) {
      const errorMessage = err.message || "Erreur lors de la connexion";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAccountType = async () => {
    try {
      const user = await authService.getCurrentUser();
      setAccountType(user?.role === 'candidat' ? 'candidat' : 'entreprise');
    } catch {
      setAccountType(null);
    }
  };

  const logout = () => {
    authService.logout();
    setAccountType(null);
    localStorage.removeItem('onboardingCompleted');
    localStorage.removeItem('onboardingProgress');
  };

  const clearError = () => {
    setError(null);
  };

  return {
    register,
    login,
    logout,
    isLoading,
    error,
    clearError,
    accountType,
    fetchAccountType,
    isAuthenticated: authService.isAuthenticated(),
  };
};
