import { userService } from '../userService';
import * as apiModule from '../api';

jest.mock('../api');

const token = 'token123';
const mockResponse = { id: '1', email: 'test@test.com' };

describe('UserService', () => {

    beforeEach(() => {
        jest.resetAllMocks();
        localStorage.setItem('authToken', token);
        (apiModule.apiRequest as jest.Mock).mockResolvedValue(mockResponse);
    });

    afterEach(() => {
        localStorage.clear();
    });

    it('should get user by id', async () => {
        const result = await userService.getUserById('1');
        expect(apiModule.apiRequest).toHaveBeenCalledWith('/user/1', expect.objectContaining({
            method: 'GET',
            headers: expect.objectContaining({
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            }),
        }));
        expect(result).toEqual(mockResponse);
    });

    it('should call apiRequest with undefined if no id provided', async () => {
        const result = await userService.getUserById(undefined);
        expect(apiModule.apiRequest).toHaveBeenCalledWith('/user/undefined', expect.objectContaining({
            method: 'GET',
            headers: expect.objectContaining({
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            }),
        }));
        expect(result).toEqual(mockResponse);
    });
});
it('should handle errors from apiRequest', async () => {
    const error = new Error('Network Error');
    (apiModule.apiRequest as jest.Mock).mockRejectedValue(error);

    await expect(userService.getUserById('1')).rejects.toThrow('Network Error');
});
