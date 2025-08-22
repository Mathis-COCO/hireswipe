import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Repository, DataSource, In } from 'typeorm';
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
    return this.dataSource.transaction(async (manager) => {
      try {
        const matchForCandidate = manager.create(Match, {
          user: candidate,
          offer,
        });
        const matchForRecruiter = manager.create(Match, {
          user: recruiter,
          offer,
        });
        const savedCandidateMatch = await manager.save(matchForCandidate);
        const savedRecruiterMatch = await manager.save(matchForRecruiter);
        // small debug log to ensure saves happened
        // eslint-disable-next-line no-console
        console.log('[UsersService] saved matches', {
          candidateMatchId: savedCandidateMatch.id,
          recruiterMatchId: savedRecruiterMatch.id,
        });
        return [savedCandidateMatch, savedRecruiterMatch];
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('[UsersService] createMatchBetweenUsers error', err);
        throw err;
      }
    });
  }

  /**
   * Return the list of users the given user has matches with.
   * For each Match where user = userId, we try to find the counterpart user
   * either via offer.createdBy or another Match for the same offer.
   */
  async getMatchesForUser(userId: string) {
    // 1) find offers this user has matches for
    const userMatches = await this.matchRepository.find({
      where: { user: { id: userId } },
      relations: ['offer'],
    });

    const offerIds = userMatches.map((m) => (m.offer as unknown as { id: any }).id).filter(Boolean);
    if (offerIds.length === 0) return [];

    // 2) find all matches for those offers and include user + offer.createdBy
    const matchesForOffers = await this.matchRepository.find({
      where: { offer: { id: In(offerIds) } },
      relations: ['user', 'offer', 'offer.createdBy'],
    });

    // 3) collect counterpart users (user.id !== userId)
    const usersMap = new Map<string, any>();
    for (const match of matchesForOffers) {
      const u = match.user;
      if (!u || u.id === userId) continue;
      if (!usersMap.has(u.id)) {
        usersMap.set(u.id, {
          id: u.id,
          email: u.email,
          firstName: (u as any).firstName ?? null,
          lastName: (u as any).lastName ?? null,
          role: u.role,
          profilePhoto: (u as any).profilePhoto ?? null,
          offerId: (match.offer as any).id,
        });
      }
    }

    return Array.from(usersMap.values());
  }
}
