import { offerService } from '../offerService';
import * as apiModule from '../api';

jest.mock('../api');

describe('OfferService', () => {
  const mockResponse = { success: true };
  const token = 'token123';

  beforeEach(() => {
    jest.resetAllMocks();
    localStorage.setItem('authToken', token);
    (apiModule.apiRequest as jest.Mock).mockResolvedValue(mockResponse);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create an offer', async () => {
    const data = { title: 'Test Offer' };
    const result = await offerService.createOffer(data);
    expect(apiModule.apiRequest).toHaveBeenCalledWith('/offers', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify(data),
    }));
    expect(result).toEqual(mockResponse);
  });

  it('should get my offers', async () => {
    const result = await offerService.getMyOffers();
    expect(apiModule.apiRequest).toHaveBeenCalledWith('/offers/me', expect.objectContaining({
      method: 'GET',
      headers: expect.objectContaining({
        Authorization: `Bearer ${token}`,
      }),
    }));
    expect(result).toEqual(mockResponse);
  });

  it('should get a random offer for candidate', async () => {
    const result = await offerService.getRandomOfferForCandidate();
    expect(apiModule.apiRequest).toHaveBeenCalledWith('/offers/random/candidate', expect.objectContaining({
      method: 'GET',
      headers: expect.objectContaining({
        Authorization: `Bearer ${token}`,
      }),
    }));
    expect(result).toEqual(mockResponse);
  });

  it('should get current user with interacted offers', async () => {
    const result = await offerService.getCurrentUserWithInteractedOffers();
    expect(apiModule.apiRequest).toHaveBeenCalledWith('/user/me/interacted-offers', expect.objectContaining({
      method: 'GET',
      headers: expect.objectContaining({
        Authorization: `Bearer ${token}`,
      }),
    }));
    expect(result).toEqual(mockResponse);
  });

  it('should get offer by id', async () => {
    const result = await offerService.getOfferById(1);
    expect(apiModule.apiRequest).toHaveBeenCalledWith('/offers/1', expect.objectContaining({
      method: 'GET',
      headers: expect.objectContaining({
        Authorization: `Bearer ${token}`,
      }),
    }));
    expect(result).toEqual(mockResponse);
  });

  it('should get all offers', async () => {
    const result = await offerService.getAllOffers();
    expect(apiModule.apiRequest).toHaveBeenCalledWith('/offers', expect.objectContaining({
      method: 'GET',
      headers: expect.objectContaining({
        Authorization: `Bearer ${token}`,
      }),
    }));
    expect(result).toEqual(mockResponse);
  });

  it('should apply to an offer', async () => {
    const result = await offerService.applyToOffer(1);
    expect(apiModule.apiRequest).toHaveBeenCalledWith('/offers/1/apply', expect.objectContaining({
      method: 'POST',
      headers: expect.objectContaining({
        Authorization: `Bearer ${token}`,
      }),
    }));
    expect(result).toEqual(mockResponse);
  });

  it('should check if has remaining offer', async () => {
    (apiModule.apiRequest as jest.Mock).mockResolvedValue({ hasRemaining: true });
    const result = await offerService.hasRemainingOffer();
    expect(result).toBe(true);
    expect(apiModule.apiRequest).toHaveBeenCalledWith('/offers/remaining/candidate', expect.objectContaining({
      method: 'GET',
      headers: expect.objectContaining({
        Authorization: `Bearer ${token}`,
      }),
    }));
  });

  it('should update an offer', async () => {
    const data: any = { title: 'Updated', candidates: [], skillInput: [], avantageInput: [] };
    const result = await offerService.updateOffer(1, data);
    expect(apiModule.apiRequest).toHaveBeenCalledWith('/offers/1', expect.objectContaining({
      method: 'PATCH',
      body: expect.stringContaining('"title":"Updated"'),
      headers: expect.objectContaining({
        Authorization: `Bearer ${token}`,
      }),
    }));
    expect(result).toEqual(mockResponse);
  });

  it('should update candidate status', async () => {
    const result = await offerService.updateCandidateStatus(1, 2, 'accepted');
    expect(apiModule.apiRequest).toHaveBeenCalledWith('/offers/1/candidates/2/status', expect.objectContaining({
      method: 'PUT',
      body: expect.stringContaining('"status":"accepted"'),
    }));
    expect(result).toEqual(mockResponse);
  });

  it('should create a match', async () => {
    const result = await offerService.createMatch(1, 2);
    expect(apiModule.apiRequest).toHaveBeenCalledWith('/user/match', expect.objectContaining({
      method: 'PUT',
      body: expect.stringContaining('"offerId":2'),
    }));
    expect(result).toEqual(mockResponse);
  });
});

it('should handle errors from apiRequest', async () => {
    const error = new Error('Network Error');
    (apiModule.apiRequest as jest.Mock).mockRejectedValue(error);

    await expect(offerService.getRandomOfferForCandidate()).rejects.toThrow('Network Error');
});

it('should handle errors from apiRequest when no token', async () => {
    localStorage.removeItem('authToken');
    (apiModule.apiRequest as jest.Mock).mockRejectedValue(new Error('Unauthorized'));

    await expect(offerService.getMyOffers()).rejects.toThrow('Unauthorized');
});

it('should handle errors from apiRequest when offer not found', async () => {
    (apiModule.apiRequest as jest.Mock).mockRejectedValue(new Error('Not Found'));

    await expect(offerService.getOfferById(999)).rejects.toThrow('Not Found');
});

it('should handle errors from apiRequest when applying to an offer', async () => {
    (apiModule.apiRequest as jest.Mock).mockRejectedValue(new Error('Forbidden'));

    await expect(offerService.applyToOffer(1)).rejects.toThrow('Forbidden');
});

it('should handle errors from apiRequest when updating an offer', async () => {
    (apiModule.apiRequest as jest.Mock).mockRejectedValue(new Error('Bad Request'));

    await expect(offerService.updateOffer(1, {})).rejects.toThrow('Bad Request');
});

it('should handle errors from apiRequest when updating candidate status', async () => {
    (apiModule.apiRequest as jest.Mock).mockRejectedValue(new Error('Not Found'));

    await expect(offerService.updateCandidateStatus(1, 2, 'accepted')).rejects.toThrow('Not Found');
});

it('should handle errors from apiRequest when creating a match', async () => {
    (apiModule.apiRequest as jest.Mock).mockRejectedValue(new Error('Internal Server Error'));

    await expect(offerService.createMatch(1, 2)).rejects.toThrow('Internal Server Error');
});

it('should handle errors from apiRequest when checking remaining offers', async () => {
    (apiModule.apiRequest as jest.Mock).mockRejectedValue(new Error('Internal Server Error'));

    await expect(offerService.hasRemainingOffer()).rejects.toThrow('Internal Server Error');
});