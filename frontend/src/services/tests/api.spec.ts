import { apiRequest, ApiError } from '../api';

describe('apiRequest', () => {
  const originalFetch = global.fetch;
  const originalLocalStorage = global.localStorage;
  const store: Record<string, string> = {};

  beforeEach(() => {
    global.fetch = jest.fn();
    Object.defineProperty(global, 'localStorage', {
      value: {
        getItem: jest.fn((key) => store[key] || null),
        setItem: jest.fn((key, value) => { store[key] = value; }),
        removeItem: jest.fn((key) => { delete store[key]; }),
        clear: jest.fn(() => { for (const key in store) delete store[key]; }),
      },
      configurable: true,
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
    global.fetch = originalFetch;
    Object.defineProperty(global, 'localStorage', {
      value: originalLocalStorage,
      configurable: true,
    });
  });

  it('should perform a successful request and return data', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });

    const result = await apiRequest('/test');
    expect(result).toEqual({ success: true });
    expect(fetch).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
      mode: 'cors',
      credentials: 'include',
      headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
    }));
  });

  it('should include Authorization header if token exists', async () => {
    store['authToken'] = 'token123';
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });

    await apiRequest('/test');

    expect(fetch).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
      mode: 'cors',
      credentials: 'include',
      headers: expect.objectContaining({
        'Content-Type': 'application/json',
        Authorization: 'Bearer token123',
      }),
    }));
  });

  it('should throw ApiError on non-ok response with json error', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({ message: 'Bad request' }),
    });

    await expect(apiRequest('/test')).rejects.toThrow(ApiError);
    await expect(apiRequest('/test')).rejects.toThrow('Bad request');
  });

  it('should throw ApiError with default message if response json fails', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => { throw new Error('fail'); },
    });

    await expect(apiRequest('/test')).rejects.toThrow(ApiError);
    await expect(apiRequest('/test')).rejects.toThrow('Une erreur est survenue');
  });

  it('should throw ApiError on fetch failure', async () => {
    (fetch as jest.Mock).mockRejectedValue(new Error('network error'));

    await expect(apiRequest('/test')).rejects.toThrow(ApiError);
    await expect(apiRequest('/test')).rejects.toThrow('Erreur de connexion au serveur');
  });
});
