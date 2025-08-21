import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

// Mock complet de bcrypt
jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed'),
  compare: jest.fn().mockResolvedValue(true),
}));

import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: Partial<UsersService>;
  let jwtService: Partial<JwtService>;

  const mockUser = {
    id: '1',
    email: 'test@test.com',
    role: 'user',
    password: 'hashed',
  };
  const token = 'signed-token';

  beforeEach(async () => {
    usersService = {
      createUser: jest.fn().mockResolvedValue(mockUser),
      findByEmail: jest.fn().mockResolvedValue(mockUser),
    };
    jwtService = {
      sign: jest.fn().mockReturnValue(token),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should hash password, create user and return token + user', async () => {
      const result = await service.register('test@test.com', 'password');
      expect(bcrypt.hash).toHaveBeenCalledWith('password', 10);
      expect(usersService.createUser).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: 'hashed',
        role: 'user',
      });
      expect(result).toEqual({
        token,
        user: {
          id: mockUser.id,
          email: mockUser.email,
          role: mockUser.role,
        },
      });
    });
  });

  describe('validateUser', () => {
    it('should return user if password matches', async () => {
      const user = await service.validateUser('test@test.com', 'password');
      expect(bcrypt.compare).toHaveBeenCalledWith(
        'password',
        mockUser.password,
      );
      expect(user).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      (usersService.findByEmail as jest.Mock).mockResolvedValue(null);
      const user = await service.validateUser('wrong@test.com', 'password');
      expect(user).toBeNull();
    });

    it('should return null if password does not match', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      const user = await service.validateUser('test@test.com', 'wrong');
      expect(user).toBeNull();
    });
  });

  describe('login', () => {
    it('should return signed token', () => {
      const result = service.login(mockUser);
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
        role: mockUser.role,
      });
      expect(result).toEqual({ access_token: token });
    });
  });
});
