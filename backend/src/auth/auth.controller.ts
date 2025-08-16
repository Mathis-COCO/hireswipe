import {
  Controller,
  Post,
  Put,
  Body,
  UnauthorizedException,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateCandidateOnboardingDto } from './dto/updateCandidateOnboarding.dto';
import { UpdateRecruiterOnboardingDto } from './dto/updateRecruiterOnboarding.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto.email, dto.password, dto.role);
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    const user = await this.authService.validateUser(dto.email, dto.password);
    if (!user) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }
    const loginResult = this.authService.login(user);
    return {
      token: loginResult.access_token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('profile')
  updateProfile(
    @Request() req: { user: { id: string; role: string } },
    @Body() dto: UpdateCandidateOnboardingDto | UpdateRecruiterOnboardingDto,
  ) {
    const userId = Number(req.user.id);
    const userRole = req.user.role;

    return this.authService.updateProfile(userId, userRole, dto);
  }
}
