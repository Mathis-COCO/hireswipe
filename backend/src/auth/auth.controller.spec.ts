import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: Partial<AuthService>;

  const mockUser = { id: '1', email: 'test@test.com', role: 'user' };
  const mockToken = 'signed-token';

  beforeEach(async () => {
    authService = {
      register: jest.fn().mockResolvedValue({
        token: mockToken,
        user: mockUser,
      }),
      validateUser: jest.fn().mockResolvedValue(mockUser),
      login: jest.fn().mockReturnValue({ access_token: mockToken }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should call authService.register and return result', async () => {
      const dto = {
        email: 'test@test.com',
        password: 'password',
        role: 'user',
      };
      const result = await controller.register(dto);
      expect(authService.register).toHaveBeenCalledWith(
        dto.email,
        dto.password,
        dto.role,
      );
      expect(result).toEqual({
        token: mockToken,
        user: mockUser,
      });
    });
  });

  describe('login', () => {
    it('should return token and user if credentials are valid', async () => {
      const dto = { email: 'test@test.com', password: 'password' };
      const result = await controller.login(dto);
      expect(authService.validateUser).toHaveBeenCalledWith(
        dto.email,
        dto.password,
      );
      expect(authService.login).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual({
        token: mockToken,
        user: mockUser,
      });
    });

    it('should throw UnauthorizedException if credentials are invalid', async () => {
      (authService.validateUser as jest.Mock).mockResolvedValue(null);
      const dto = { email: 'wrong@test.com', password: 'wrong' };
      await expect(controller.login(dto)).rejects.toThrow(
        new UnauthorizedException('Email ou mot de passe incorrect'),
      );
      expect(authService.validateUser).toHaveBeenCalledWith(
        dto.email,
        dto.password,
      );
    });
  });
});
