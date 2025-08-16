import { Controller, Put, Body, Request, UseGuards, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UpdateCandidateOnboardingDto } from './dto/updateCandidateOnboarding.dto';
import { UpdateRecruiterOnboardingDto } from './dto/updateRecruiterOnboarding.dto';
import { UsersService } from './users.service';

@Controller('user')
export class UsersController {
  constructor(private userService: UsersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Put('profile')
  updateProfile(
    @Request() req: { user: { id: string; role: string } },
    @Body() dto: UpdateCandidateOnboardingDto | UpdateRecruiterOnboardingDto,
  ) {
    const userId = Number(req.user.id);
    const userRole = req.user.role;

    return this.userService.updateProfile(userId, userRole, dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/me')
  getProfile(@Request() req: { user: { id: string } }) {
    const userId = Number(req.user.id);
    return this.userService.findById(userId);
  }
}
