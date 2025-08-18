import { apiRequest } from './api';

interface AuthResponse {
  token: string;
  user: {
    id: number;
    email: string;
    role: string;
  };
}

class OfferService {
  async createOffer(data: any): Promise<any> {
    const response = await apiRequest('/offers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response;
  }

  async getMyOffers(): Promise<any[]> {
    const response = await apiRequest(`/offers/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      },
    });
    return response as any[];
  }
}

export const offerService = new OfferService();
