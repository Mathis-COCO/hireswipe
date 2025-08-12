import { useState } from 'react';
import { authService } from '../services/authService';
import { RegisterData, LoginData } from '../types/auth';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authService.register(data);
      authService.saveAuthData(response);
      
      // Store account type for onboarding
      localStorage.setItem('accountType', data.role === 'candidat' ? 'candidate' : 'company');
      
      return { success: true, data: response };
    } catch (err: any) {
      const errorMessage = err.message || 'Erreur lors de l\'inscription';
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
      
      // Store account type from response if available
      if (response.user?.role) {
        const accountType = response.user.role === 'candidat' ? 'candidate' : 'company';
        localStorage.setItem('accountType', accountType);
      }
      
      return { success: true, data: response };
    } catch (err: any) {
      const errorMessage = err.message || 'Erreur lors de la connexion';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    // Clear account type on logout
    localStorage.removeItem('accountType');
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
    isAuthenticated: authService.isAuthenticated(),
  };
};
