/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UpdateCandidateOnboardingDto } from './dto/updateCandidateOnboarding.dto';
import { UpdateRecruiterOnboardingDto } from './dto/updateRecruiterOnboarding.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(email: string, password: string, role = 'user') {
    const hashed = await bcrypt.hash(password, 10);
    const user = await this.usersService.createUser({
      email,
      password: hashed,
      role,
    });
    const loginResult = this.login(user);
    return {
      token: loginResult.access_token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;
    const match = await bcrypt.compare(password, user.password ?? '');
    if (!match) return null;
    return user;
  }

  login(user: any) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  updateProfile(
    userId: number,
    userRole: string,
    dto: UpdateCandidateOnboardingDto | UpdateRecruiterOnboardingDto,
  ) {
    if (userRole === 'candidate') {
      const candidateDto = dto as UpdateCandidateOnboardingDto;
      return this.usersService.updateUser(userId, candidateDto);
    } else if (userRole === 'recruiter') {
      const recruiterDto = dto as UpdateRecruiterOnboardingDto;
      return this.usersService.updateUser(userId, recruiterDto);
    }

    throw new BadRequestException('Role utilisateur non pris en charge');
  }
}
