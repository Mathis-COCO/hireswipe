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

  async getRandomOfferForCandidate(): Promise<any> {
    const response = await apiRequest(`/offers/random/candidate`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      },
    });
    return response;
  }

  async getCurrentUserWithInteractedOffers(): Promise<any> {
    const response = await apiRequest(`/user/me/interacted-offers`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      },
    });
    return response;
  }

  async getOfferById(id: number): Promise<any> {
    const response = await apiRequest(`/offers/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      },
    });
    return response;
  }
}

export const offerService = new OfferService();
