jest.mock('../offers/entities/offer.entity', () => ({
  Offer: class MockOffer {},
}));

jest.mock('./entities/match.entity', () => ({
  Match: class MockMatch {},
}));

import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { Match } from './entities/match.entity';
import { Offer } from '../offers/entities/offer.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, DataSource, EntityManager } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<User>;
  let matchRepository: Repository<Match>;
  let dataSource: DataSource;

  const mockUserRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockMatchRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockTransaction = jest.fn((cb: (em: EntityManager) => unknown) =>
    cb({
      create: jest
        .fn()
        .mockImplementation((_: unknown, data: unknown) => ({ ...data })),
      save: jest.fn(),
    } as unknown as EntityManager),
  );

  const mockDataSource = { transaction: mockTransaction };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
        { provide: getRepositoryToken(Match), useValue: mockMatchRepository },
        { provide: DataSource, useValue: mockDataSource },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get(getRepositoryToken(User));
    matchRepository = module.get(getRepositoryToken(Match));
    dataSource = module.get(DataSource);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('should return a user when found', async () => {
      const mockUser = {
        id: '1',
        email: 'test@test.com',
        role: 'candidat',
      } as Partial<User> as User;
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findById('1');
      expect(result).toEqual(mockUser);
    });

    it('should return null when not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      const result = await service.findById('99');
      expect(result).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('should return a user when found', async () => {
      const mockUser = {
        id: '1',
        email: 'user@test.com',
        role: 'candidat',
      } as Partial<User> as User;
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findByEmail('user@test.com');
      expect(result).toEqual(mockUser);
    });

    it('should return null when not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      const result = await service.findByEmail('missing@test.com');
      expect(result).toBeNull();
    });
  });

  describe('createUser', () => {
    it('should create and save a user', async () => {
      const mockUser = {
        email: 'new@test.com',
        role: 'candidat',
      } as Partial<User> as User;
      mockUserRepository.create.mockReturnValue(mockUser);
      mockUserRepository.save.mockResolvedValue({ ...mockUser, id: '123' });

      const result = await service.createUser(mockUser);
      expect(userRepository.create).toHaveBeenCalledWith(mockUser);
      expect(userRepository.save).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual({ ...mockUser, id: '123' });
    });
  });

  describe('updateUser', () => {
    it('should update and save a user', async () => {
      const mockUser = {
        id: '1',
        firstName: 'Old',
        email: 'a@a.com',
        role: 'candidat',
      } as Partial<User> as User;
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockUserRepository.save.mockResolvedValue({
        ...mockUser,
        firstName: 'New',
      });

      const result = await service.updateUser('1', { firstName: 'New' });
      expect(result.firstName).toBe('New');
    });

    it('should throw NotFoundException if user does not exist', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(
        service.updateUser('404', { firstName: 'Test' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateProfile', () => {
    it('should update candidate profile', async () => {
      const dto = { firstName: 'Alice', lastName: 'Doe' };
      jest
        .spyOn(service as any, 'updateUser')
        .mockResolvedValue({ id: '1', ...dto } as User);

      const result = await service.updateProfile('1', 'candidat', dto);
      expect(result).toEqual({ id: '1', ...dto });
    });

    it('should update recruiter profile', async () => {
      const dto = { companyName: 'MyCompany', sector: 'IT' };
      jest
        .spyOn(service as any, 'updateUser')
        .mockResolvedValue({ id: '2', ...dto } as User);

      const result = await service.updateProfile('2', 'entreprise', dto);
      expect(result).toEqual({ id: '2', ...dto });
    });

    it('should throw BadRequestException for invalid role', () => {
      expect(() =>
        service.updateProfile('userId', 'invalidRole', {} as any),
      ).toThrow(BadRequestException);
    });
  });

  describe('findInteractedOffers', () => {
    it('should return interacted offers array', async () => {
      const mockUser = {
        id: '1',
        interactedOfferIds: ['o1', 'o2'],
        email: 'x@x.com',
        role: 'candidat',
      } as Partial<User> as User;
      jest.spyOn(service, 'findById').mockResolvedValue(mockUser);

      const result = await service.findInteractedOffers('1');
      expect(result).toEqual(['o1', 'o2']);
    });

    it('should return empty array if no offers', async () => {
      const mockUser = {
        id: '2',
        interactedOfferIds: null,
        email: 'y@y.com',
        role: 'candidat',
      } as Partial<User> as User;
      jest.spyOn(service, 'findById').mockResolvedValue(mockUser);

      const result = await service.findInteractedOffers('2');
      expect(result).toEqual([]);
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(service, 'findById').mockResolvedValue(null);

      await expect(service.findInteractedOffers('404')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createMatchBetweenUsers', () => {
    it('should create two matches in a transaction', async () => {
      const candidate = {
        id: '1',
        email: 'c@test.com',
        role: 'candidat',
      } as Partial<User> as User;
      const recruiter = {
        id: '2',
        email: 'r@test.com',
        role: 'entreprise',
      } as Partial<User> as User;
      const offer = { id: '10', title: 'Dev Job' } as Partial<Offer> as Offer;

      await service.createMatchBetweenUsers(candidate, recruiter, offer);

      expect(dataSource.transaction).toHaveBeenCalled();
      const callback = mockDataSource.transaction.mock.calls[0][0];
      const manager = {
        create: jest
          .fn()
          .mockImplementation((_: unknown, data: unknown) => data),
        save: jest.fn(),
      };
      await callback(manager as unknown as EntityManager);

      expect(manager.create).toHaveBeenCalledTimes(2);
      expect(manager.save).toHaveBeenCalledTimes(2);
    });
  });
});
