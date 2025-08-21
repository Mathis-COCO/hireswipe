import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UpdateCandidateOnboardingDto } from './dto/updateCandidateOnboarding.dto';
import { UpdateRecruiterOnboardingDto } from './dto/updateRecruiterOnboarding.dto';
import { Match } from './entities/match.entity';
import { Offer } from '../offers/entities/offer.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,
    private dataSource: DataSource,
  ) {}

  async findById(id: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { id } });
    return user ?? null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { email } });
    return user ?? null;
  }

  async createUser(data: Partial<User>): Promise<User> {
    const user = this.userRepository.create(data);
    return this.userRepository.save(user);
  }

  async updateUser(id: string, updateDto: Partial<User>): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User with ID ${id} not found.`);
    Object.assign(user, updateDto);
    return this.userRepository.save(user);
  }

  updateProfile(
    userId: string,
    userRole: string,
    dto: UpdateCandidateOnboardingDto | UpdateRecruiterOnboardingDto,
  ) {
    if (userRole === 'candidat') {
      const candidateDto = dto as UpdateCandidateOnboardingDto;
      return this.updateUser(userId, candidateDto);
    } else if (userRole === 'entreprise') {
      const recruiterDto = dto as UpdateRecruiterOnboardingDto;
      return this.updateUser(userId, recruiterDto);
    }
    throw new BadRequestException('Rôle utilisateur non pris en charge');
  }

  async findInteractedOffers(userId: string): Promise<any[]> {
    const user = await this.findById(userId);
    if (!user) throw new NotFoundException(`User with ID ${userId} not found.`);
    return user.interactedOfferIds ?? [];
  }

  async createMatchBetweenUsers(
    candidate: User,
    recruiter: User,
    offer: Offer,
  ) {
    await this.dataSource.transaction(async (manager) => {
      const matchForCandidate = manager.create(Match, {
        user: candidate,
        offer,
      });
      const matchForRecruiter = manager.create(Match, {
        user: recruiter,
        offer,
      });
      await manager.save(matchForCandidate);
      await manager.save(matchForRecruiter);
    });
  }
}
