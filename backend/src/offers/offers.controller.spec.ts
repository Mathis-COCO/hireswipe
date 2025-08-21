import { Test, TestingModule } from '@nestjs/testing';
import { OffersController } from './offers.controller';
import { OffersService } from './offers.service';
import { AuthGuard } from '@nestjs/passport';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { AuthService } from 'src/auth/auth.service';

describe('OffersController', () => {
  let controller: OffersController;
  let service: OffersService;
  let authService: AuthService;

  const mockOffer = { id: '1', title: 'Offer 1' } as Offer;

  const mockOffersService = {
    create: jest.fn((dto, userId) => ({ ...dto, id: '1', userId })),
    findAll: jest.fn(() => [mockOffer]),
    findAllForUser: jest.fn((userId) => [mockOffer]),
    findOne: jest.fn((id) => mockOffer),
    update: jest.fn((id, dto) => ({ ...mockOffer, ...dto })),
    remove: jest.fn(() => undefined),
    getRandomAvailableOffer: jest.fn(() => mockOffer),
    getRandomAvailableOfferForCandidate: jest.fn((userId) => mockOffer),
    hasRemainingOffer: jest.fn(() => true),
    applyToOffer: jest.fn(() => undefined),
    updateCandidateStatus: jest.fn(() => mockOffer),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OffersController],
      providers: [
        {
          provide: OffersService,
          useValue: mockOffersService,
        },
        {
          provide: AuthService,
          useValue: { login: jest.fn(), register: jest.fn() },
        },
      ],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<OffersController>(OffersController);
    service = module.get<OffersService>(OffersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create an offer', async () => {
    const dto = { title: 'New Offer' };
    const result = await controller.create(dto as any, { user: { id: '123' } });
    expect(result).toEqual({ ...dto, id: '1', userId: '123' });
    expect(service.create).toHaveBeenCalledWith(dto, '123');
  });

  it('should find all offers', async () => {
    const result = await controller.findAll();
    expect(result).toEqual([mockOffer]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should find all offers for a user', async () => {
    const result = await controller.findAllForUser('123');
    expect(result).toEqual([mockOffer]);
    expect(service.findAllForUser).toHaveBeenCalledWith('123');
  });

  it('should find all offers for me', async () => {
    const result = await controller.findAllForMe({
      user: { id: '123' },
    } as any);
    expect(result).toEqual([mockOffer]);
    expect(service.findAllForUser).toHaveBeenCalledWith('123');
  });

  it('should find one offer', async () => {
    const result = await controller.findOne('1');
    expect(result).toEqual(mockOffer);
    expect(service.findOne).toHaveBeenCalledWith('1');
  });

  it('should update an offer', async () => {
    const dto = { title: 'Updated' };
    const result = await controller.update('1', dto as any);
    expect(result).toEqual({ ...mockOffer, ...dto });
    expect(service.update).toHaveBeenCalledWith('1', dto);
  });

  it('should remove an offer', async () => {
    const result = await controller.remove('1');
    expect(result).toBeUndefined();
    expect(service.remove).toHaveBeenCalledWith('1');
  });

  it('should get a random offer', async () => {
    const result = await controller.getRandomOffer();
    expect(result).toEqual(mockOffer);
    expect(service.getRandomAvailableOffer).toHaveBeenCalled();
  });

  it('should get a random offer for candidate', async () => {
    const result = await controller.getRandomOfferForCandidate({
      user: { id: '123' },
    } as any);
    expect(result).toEqual(mockOffer);
    expect(service.getRandomAvailableOfferForCandidate).toHaveBeenCalledWith(
      '123',
    );
  });

  it('should check remaining offer', async () => {
    const result = await controller.hasRemainingOffer({
      user: { id: '123' },
    } as any);
    expect(result).toEqual({ hasRemaining: true });
    expect(service.hasRemainingOffer).toHaveBeenCalledWith('123');
  });

  it('should apply to an offer', async () => {
    const result = await controller.applyToOffer('1', {
      user: { id: '123' },
    } as any);
    expect(result).toEqual({
      success: true,
      message: 'Candidature enregistrée.',
    });
    expect(service.applyToOffer).toHaveBeenCalledWith('1', '123');
  });

  it('should update candidate status', async () => {
    const result = await controller.updateCandidateStatus(
      'offer1',
      'candidate1',
      'accepted',
    );
    expect(result).toEqual(mockOffer);
    expect(service.updateCandidateStatus).toHaveBeenCalledWith(
      'offer1',
      'candidate1',
      'accepted',
    );
  });
});
