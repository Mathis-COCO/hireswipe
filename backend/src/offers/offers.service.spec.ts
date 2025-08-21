import { Test, TestingModule } from '@nestjs/testing';
import { OffersService } from './offers.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { User } from 'src/users/entities/user.entity';
import { OfferCandidate } from '../users/entities/userOffer.entity';
import { Repository } from 'typeorm';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const createMockRepository = <T = any>(): MockRepository<T> => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

describe('OffersService', () => {
  let service: OffersService;
  let offerRepo: MockRepository;
  let userRepo: MockRepository;
  let offerCandidateRepo: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OffersService,
        {
          provide: getRepositoryToken(Offer),
          useValue: createMockRepository(),
        },
        { provide: getRepositoryToken(User), useValue: createMockRepository() },
        {
          provide: getRepositoryToken(OfferCandidate),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<OffersService>(OffersService);
    offerRepo = module.get(getRepositoryToken(Offer));
    userRepo = module.get(getRepositoryToken(User));
    offerCandidateRepo = module.get(getRepositoryToken(OfferCandidate));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an offer with user', async () => {
      const dto = { title: 'Offer 1' };
      const user = { id: '123' };
      offerRepo.create.mockReturnValue(dto);
      userRepo.findOne.mockResolvedValue(user);
      offerRepo.save.mockResolvedValue({ ...dto, createdBy: user });

      const result = await service.create(dto as any, '123');
      expect(result).toEqual({ ...dto, createdBy: user });
      expect(offerRepo.create).toHaveBeenCalledWith(dto);
      expect(offerRepo.save).toHaveBeenCalled();
    });

    it('should create an offer without user', async () => {
      const dto = { title: 'Offer 1' };
      offerRepo.create.mockReturnValue(dto);
      offerRepo.save.mockResolvedValue(dto);

      const result = await service.create(dto as any, null);
      expect(result).toEqual(dto);
      expect(userRepo.findOne).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all offers', async () => {
      const offers = [{ id: '1' }];
      offerRepo.find.mockResolvedValue(offers);
      const result = await service.findAll();
      expect(result).toEqual(offers);
    });
  });

  describe('findAllForUser', () => {
    it('should return offers for a user', async () => {
      const offers = [{ id: '1' }];
      offerRepo.find.mockResolvedValue(offers);
      const result = await service.findAllForUser('123');
      expect(result).toEqual(offers);
      expect(offerRepo.find).toHaveBeenCalledWith({
        where: { createdBy: { id: '123' } },
      });
    });
  });

  describe('findOne', () => {
    it('should return one offer', async () => {
      const offer = { id: '1' };
      offerRepo.findOne.mockResolvedValue(offer);
      const result = await service.findOne('1');
      expect(result).toEqual(offer);
      expect(offerRepo.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
    });
  });

  describe('update', () => {
    it('should update and return offer', async () => {
      const dto = { title: 'Updated' };
      const offer = { id: '1', title: 'Updated' };
      offerRepo.update.mockResolvedValue(undefined);
      offerRepo.findOne.mockResolvedValue(offer);
      const result = await service.update('1', dto as any);
      expect(result).toEqual(offer);
      expect(offerRepo.update).toHaveBeenCalledWith('1', dto);
    });
  });

  describe('remove', () => {
    it('should delete an offer', async () => {
      offerRepo.delete.mockResolvedValue(undefined);
      await service.remove('1');
      expect(offerRepo.delete).toHaveBeenCalledWith('1');
    });
  });

  describe('getRandomAvailableOffer', () => {
    it('should return null if no valid offer', async () => {
      offerRepo.find.mockResolvedValue([]);
      const result = await service.getRandomAvailableOffer();
      expect(result).toBeNull();
    });

    it('should return a random valid offer', async () => {
      const now = new Date();
      const offer = { id: '1', createdAt: now, isAvailable: true };
      offerRepo.find.mockResolvedValue([offer]);
      const result = await service.getRandomAvailableOffer();
      expect(result).toEqual(offer);
    });
  });

  describe('getRandomAvailableOfferForCandidate', () => {
    it('should return null if user not found', async () => {
      userRepo.findOne.mockResolvedValue(null);
      const result = await service.getRandomAvailableOfferForCandidate('123');
      expect(result).toBeNull();
    });

    it('should return a random offer and update user', async () => {
      const user = { id: '123', interactedOfferIds: [] };
      const offer = { id: '1', isAvailable: true };
      userRepo.findOne.mockResolvedValue(user);
      offerRepo.find.mockResolvedValue([offer]);
      userRepo.save.mockResolvedValue(user);

      const result = await service.getRandomAvailableOfferForCandidate('123');
      expect(result).toEqual(offer);
      expect(user.interactedOfferIds).toContain('1');
    });

    it('should return null if no valid offer', async () => {
      const user = { id: '123', interactedOfferIds: ['1'] };
      userRepo.findOne.mockResolvedValue(user);
      offerRepo.find.mockResolvedValue([{ id: '1', isAvailable: true }]);

      const result = await service.getRandomAvailableOfferForCandidate('123');
      expect(result).toBeNull();
    });
  });

  describe('applyToOffer', () => {
    it('should throw error if offer not found', async () => {
      offerRepo.findOne.mockResolvedValue(null);
      await expect(service.applyToOffer('1', '123')).rejects.toThrow(
        'Offer not found',
      );
    });

    it('should throw error if user not found', async () => {
      offerRepo.findOne.mockResolvedValue({ id: '1', candidates: [] });
      userRepo.findOne.mockResolvedValue(null);
      await expect(service.applyToOffer('1', '123')).rejects.toThrow(
        'User not found',
      );
    });

    it('should not add duplicate candidate', async () => {
      const candidate = { user: { id: '123' } };
      offerRepo.findOne.mockResolvedValue({ id: '1', candidates: [candidate] });
      userRepo.findOne.mockResolvedValue({ id: '123' });
      await service.applyToOffer('1', '123');
      expect(offerCandidateRepo.save).not.toHaveBeenCalled();
    });

    it('should add a new candidate', async () => {
      const offer = { id: '1', candidates: [] };
      const user = { id: '123' };
      offerRepo.findOne.mockResolvedValue(offer);
      userRepo.findOne.mockResolvedValue(user);
      offerCandidateRepo.save.mockResolvedValue({});

      await service.applyToOffer('1', '123');
      expect(offerCandidateRepo.save).toHaveBeenCalled();
      expect(offer.candidates.length).toBe(1);
    });
  });

  describe('updateCandidateStatus', () => {
    it('should throw if candidate not found', async () => {
      offerCandidateRepo.findOne.mockResolvedValue(null);
      await expect(
        service.updateCandidateStatus('o', 'c', 'accepted'),
      ).rejects.toThrow('Candidate not found');
    });

    it('should update status', async () => {
      const candidate = { status: 'pending' };
      offerCandidateRepo.findOne.mockResolvedValue(candidate);
      offerCandidateRepo.save.mockResolvedValue(candidate);

      const result = await service.updateCandidateStatus('o', 'c', 'accepted');
      expect(result).toEqual(candidate);
      expect(candidate.status).toBe('accepted');
    });
  });

  describe('hasRemainingOffer', () => {
    it('should return false if user not found', async () => {
      userRepo.findOne.mockResolvedValue(null);
      const result = await service.hasRemainingOffer('123');
      expect(result).toBe(false);
    });

    it('should return true if offers available', async () => {
      const user = { interactedOfferIds: ['2'] };
      userRepo.findOne.mockResolvedValue(user);
      offerRepo.find.mockResolvedValue([
        { id: '1', isAvailable: true },
        { id: '2', isAvailable: true },
      ]);
      const result = await service.hasRemainingOffer('123');
      expect(result).toBe(true);
    });

    it('should return false if all offers interacted', async () => {
      const user = { interactedOfferIds: ['1', '2'] };
      userRepo.findOne.mockResolvedValue(user);
      offerRepo.find.mockResolvedValue([
        { id: '1', isAvailable: true },
        { id: '2', isAvailable: true },
      ]);
      const result = await service.hasRemainingOffer('123');
      expect(result).toBe(false);
    });
  });
});
