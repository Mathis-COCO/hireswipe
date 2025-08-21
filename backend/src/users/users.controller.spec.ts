import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { OffersService } from '../offers/offers.service';
import { NotFoundException } from '@nestjs/common';
import { UpdateCandidateOnboardingDto } from './dto/updateCandidateOnboarding.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: Partial<UsersService>;
  let offersService: Partial<OffersService>;

  beforeEach(async () => {
    usersService = {
      updateProfile: jest.fn(),
      findById: jest.fn(),
      findInteractedOffers: jest.fn(),
      createMatchBetweenUsers: jest.fn(),
    };

    offersService = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: usersService },
        { provide: OffersService, useValue: offersService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  describe('updateProfile', () => {
    it('should call usersService.updateProfile with correct args', () => {
      const req = { user: { id: '1', role: 'candidate' } };
      const dto: UpdateCandidateOnboardingDto = { name: 'Test' } as any;
      (usersService.updateProfile as jest.Mock).mockReturnValue('updated');

      const result = controller.updateProfile(req, dto);

      expect(usersService.updateProfile).toHaveBeenCalledWith(
        '1',
        'candidate',
        dto,
      );
      expect(result).toBe('updated');
    });
  });

  describe('getProfile', () => {
    it('should call usersService.findById with correct id', () => {
      const req = { user: { id: '1' } };
      (usersService.findById as jest.Mock).mockReturnValue('profile');

      const result = controller.getProfile(req);

      expect(usersService.findById).toHaveBeenCalledWith('1');
      expect(result).toBe('profile');
    });
  });

  describe('getInteractedOffers', () => {
    it('should call usersService.findInteractedOffers with correct id', () => {
      const req = { user: { id: '1' } };
      (usersService.findInteractedOffers as jest.Mock).mockReturnValue([
        'offer1',
      ]);

      const result = controller.getInteractedOffers(req);

      expect(usersService.findInteractedOffers).toHaveBeenCalledWith('1');
      expect(result).toEqual(['offer1']);
    });
  });

  describe('getUserById', () => {
    it('should call usersService.findById with param id', () => {
      (usersService.findById as jest.Mock).mockReturnValue('user');
      const result = controller.getUserById('2');

      expect(usersService.findById).toHaveBeenCalledWith('2');
      expect(result).toBe('user');
    });
  });

  describe('handleMatch', () => {
    it('should create a match successfully', async () => {
      const req = { user: { id: 'recruiter1', role: 'recruiter' } };
      const body = { offerId: 'offer1', candidateId: 'candidate1' };

      (offersService.findOne as jest.Mock).mockResolvedValue({ id: 'offer1' });
      (usersService.findById as jest.Mock)
        .mockResolvedValueOnce({ id: 'candidate1' })
        .mockResolvedValueOnce({ id: 'recruiter1' });

      (usersService.createMatchBetweenUsers as jest.Mock).mockResolvedValue(
        undefined,
      );

      const result = await controller.handleMatch(req, body);

      expect(offersService.findOne).toHaveBeenCalledWith('offer1');
      expect(usersService.findById).toHaveBeenCalledWith('candidate1');
      expect(usersService.findById).toHaveBeenCalledWith('recruiter1');
      expect(usersService.createMatchBetweenUsers).toHaveBeenCalledWith(
        { id: 'candidate1' },
        { id: 'recruiter1' },
        { id: 'offer1' },
      );
      expect(result).toEqual({ success: true });
    });

    it('should throw NotFoundException if offer not found', async () => {
      const req = { user: { id: 'recruiter1', role: 'recruiter' } };
      const body = { offerId: 'offer1', candidateId: 'candidate1' };
      (offersService.findOne as jest.Mock).mockResolvedValue(null);

      await expect(controller.handleMatch(req, body)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException if candidate or recruiter not found', async () => {
      const req = { user: { id: 'recruiter1', role: 'recruiter' } };
      const body = { offerId: 'offer1', candidateId: 'candidate1' };

      (offersService.findOne as jest.Mock).mockResolvedValue({ id: 'offer1' });
      (usersService.findById as jest.Mock).mockResolvedValue(null);

      await expect(controller.handleMatch(req, body)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
