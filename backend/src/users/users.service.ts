import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UpdateCandidateOnboardingDto } from './dto/updateCandidateOnboarding.dto';
import { UpdateRecruiterOnboardingDto } from './dto/updateRecruiterOnboarding.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findById(id: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { id: id },
    });
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
    const user = await this.userRepository.findOne({
      where: { id: id },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }

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
}
