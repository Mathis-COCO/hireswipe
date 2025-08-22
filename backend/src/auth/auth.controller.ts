import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const result = await this.authService.register(
      dto.email,
      dto.password,
      dto.role,
    );
    return {
      token: result.token,
      user: {
        id: result.user.id,
        email: result.user.email,
        role: result.user.role,
      },
    };
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
}
