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

  async getAllOffers(): Promise<any[]> {
    const response = await apiRequest(`/offers`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      },
    });
    return response as any[];
  }

  async applyToOffer(offerId: number): Promise<any> {
    const response = await apiRequest(`/offers/${offerId}/apply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      },
    });
    return response;
  }

  async hasRemainingOffer(): Promise<boolean> {
    const response = await apiRequest(`/offers/remaining/candidate`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      },
    });
    console.log('Response from hasRemainingOffer:', response);
    return (response as { hasRemaining: boolean }).hasRemaining;
  }
}

export const offerService = new OfferService();
