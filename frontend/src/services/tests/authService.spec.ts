import { authService } from '../authService';
import { apiRequest } from '../api';

jest.mock('../api', () => ({
  apiRequest: jest.fn(),
}));

describe('AuthService', () => {
  const mockApiRequest = apiRequest as jest.Mock;

  const mockAuthResponse = {
    token: 'fake-token',
    user: { id: 1, email: 'test@test.com', role: 'candidat' },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('register', () => {
    it('should call apiRequest with correct params and return response', async () => {
      mockApiRequest.mockResolvedValue(mockAuthResponse);
      const data = { email: 'test@test.com', password: '1234', role: "candidat" as "candidat" | "entreprise" };

      const result = await authService.register(data);

      expect(mockApiRequest).toHaveBeenCalledWith('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      expect(result).toEqual(mockAuthResponse);
    });
  });

  describe('login', () => {
    it('should call apiRequest with correct params and return response', async () => {
      mockApiRequest.mockResolvedValue(mockAuthResponse);
      const data = { email: 'test@test.com', password: '1234' };

      const result = await authService.login(data);

      expect(mockApiRequest).toHaveBeenCalledWith('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      expect(result).toEqual(mockAuthResponse);
    });
  });

  describe('updateProfile', () => {
    it('should call apiRequest with correct params and return response', async () => {
      localStorage.setItem('authToken', 'fake-token');
      const profileData = { name: 'John' };
      const mockResponse = { success: true };
      mockApiRequest.mockResolvedValue(mockResponse);

      const result = await authService.updateProfile(profileData);

      expect(mockApiRequest).toHaveBeenCalledWith('/user/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer fake-token',
        },
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('saveAuthData', () => {
    it('should save token and user data in localStorage', () => {
      authService.saveAuthData(mockAuthResponse);

      expect(localStorage.getItem('authToken')).toBe('fake-token');
      expect(localStorage.getItem('userData')).toBe(JSON.stringify(mockAuthResponse.user));
    });
  });

  describe('isAuthenticated', () => {
    it('should return true if token exists', () => {
      localStorage.setItem('authToken', 'fake-token');
      expect(authService.isAuthenticated()).toBe(true);
    });

    it('should return false if token does not exist', () => {
      expect(authService.isAuthenticated()).toBe(false);
    });
  });

  describe('logout', () => {
    it('should remove all auth-related items from localStorage', () => {
      localStorage.setItem('authToken', 'fake-token');
      localStorage.setItem('userData', '{}');
      localStorage.setItem('accountType', 'candidat');
      localStorage.setItem('onboardingCompleted', 'true');
      localStorage.setItem('onboardingProgress', '50');

      authService.logout();

      expect(localStorage.getItem('authToken')).toBeNull();
      expect(localStorage.getItem('userData')).toBeNull();
      expect(localStorage.getItem('accountType')).toBeNull();
      expect(localStorage.getItem('onboardingCompleted')).toBeNull();
      expect(localStorage.getItem('onboardingProgress')).toBeNull();
    });
  });

  describe('getCurrentUser', () => {
    it('should call apiRequest with correct params and return response', async () => {
      localStorage.setItem('authToken', 'fake-token');
      const mockResponse = { id: 1, email: 'test@test.com' };
      mockApiRequest.mockResolvedValue(mockResponse);

      const result = await authService.getCurrentUser();

      expect(mockApiRequest).toHaveBeenCalledWith('/user/me', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer fake-token',
          'Content-Type': 'application/json',
        },
      });
      expect(result).toEqual(mockResponse);
    });

    it('should handle errors from apiRequest', async () => {
      const error = new Error('Network Error');
      mockApiRequest.mockRejectedValue(error);

      await expect(authService.getCurrentUser()).rejects.toThrow('Network Error');
    });

    it('should handle errors from apiRequest when no token', async () => {
      localStorage.removeItem('authToken');
      mockApiRequest.mockRejectedValue(new Error('Unauthorized'));

      await expect(authService.getCurrentUser()).rejects.toThrow('Unauthorized');
    });
  });
});
