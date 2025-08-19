import { apiRequest } from './api';

class UserService {

  async getUserById(userId: string | undefined): Promise<any> {
    const response = await apiRequest(`/user/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json',
      },
    });
    return response;
  }
}

export const userService = new UserService();
