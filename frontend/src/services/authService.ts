import { apiRequest, authRequest } from './api';

interface AuthResponse {
  token: string;
  user: {
    id: number;
    email: string;
    role: string;
  };
}

interface RegisterData {
  email: string;
  password: string;
  role: 'candidat' | 'entreprise';
}

interface LoginData {
  email: string;
  password: string;
}

class AuthService {
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await authRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response;
  }

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await authRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response;
  }

  async updateProfile(profileData: any): Promise<any> {
    const response = await apiRequest('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
    return response;
  }

  saveAuthData(authData: AuthResponse): void {
    localStorage.setItem('authToken', authData.token);
    localStorage.setItem('userData', JSON.stringify(authData.user));
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('onboardingProgress');
  }

  async getCurrentUser(): Promise<any> {
    const response = await apiRequest('/user/me', {
      method: 'GET',
    });
    return response;
  }
}

export const authService = new AuthService();