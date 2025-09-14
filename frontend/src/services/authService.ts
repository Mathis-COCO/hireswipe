import { apiRequest } from './api';

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
    const response = await apiRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response;
  }

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response;
  }

  async updateProfile(profileData: any): Promise<any> {
    const response = await apiRequest('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      },
    });
    return response;
  }

  saveAuthData(authData: AuthResponse): void {
    localStorage.setItem('authToken', authData.token);
    localStorage.setItem('userData', JSON.stringify(authData.user));
    // accountType is no longer stored in localStorage
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('onboardingCompleted');
    localStorage.removeItem('onboardingProgress');
  }

  async getCurrentUser(): Promise<any> {
    const token = localStorage.getItem('authToken');
    console.debug('[authService] getCurrentUser - token:', token);
    const response = await apiRequest('/user/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    console.debug('[authService] getCurrentUser - success');
    return response;
  }
}

export const authService = new AuthService();
