import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Put,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { Offer } from './entities/offer.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(
    @Body() createOfferDto: CreateOfferDto,
    @Request() req: { user: { id: string } },
  ): Promise<Offer> {
    const userId = req.user.id;
    return this.offersService.create(createOfferDto, userId);
  }

  @Get()
  findAll(): Promise<Offer[]> {
    return this.offersService.findAll();
  }

  @Get('/user/:id')
  findAllForUser(@Param('id') userId: string): Promise<Offer[]> {
    return this.offersService.findAllForUser(userId);
  }

  @Get('/me')
  @UseGuards(AuthGuard('jwt'))
  findAllForMe(@Request() req: { user: { id: string } }): Promise<Offer[]> {
    return this.offersService.findAllForUser(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Offer | null> {
    return this.offersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOfferDto: UpdateOfferDto,
  ): Promise<Offer | null> {
    return this.offersService.update(id, updateOfferDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.offersService.remove(id);
  }

  @Get('random')
  async getRandomOffer(): Promise<Offer | null> {
    return this.offersService.getRandomAvailableOffer();
  }

  @Get('random/candidate')
  @UseGuards(AuthGuard('jwt'))
  async getRandomOfferForCandidate(
    @Request() req: { user: { id: string } },
  ): Promise<Offer | null> {
    return this.offersService.getRandomAvailableOfferForCandidate(req.user.id);
  }

  @Get('remaining/candidate')
  @UseGuards(AuthGuard('jwt'))
  async hasRemainingOffer(
    @Request() req: { user: { id: string } },
  ): Promise<{ hasRemaining: boolean }> {
    const hasRemaining = await this.offersService.hasRemainingOffer(
      req.user.id,
    );
    return { hasRemaining };
  }

  @Post(':id/apply')
  @UseGuards(AuthGuard('jwt'))
  async applyToOffer(
    @Param('id') offerId: string,
    @Request() req: { user: { id: string } },
  ): Promise<{ success: boolean; message: string }> {
    await this.offersService.applyToOffer(offerId, req.user.id);
    return { success: true, message: 'Candidature enregistrée.' };
  }

  @Put(':offerId/candidates/:candidateId/status')
  async updateCandidateStatus(
    @Param('offerId') offerId: string,
    @Param('candidateId') candidateId: string,
    @Body('status') status: string,
  ) {
    return this.offersService.updateCandidateStatus(
      offerId,
      candidateId,
      status,
    );
  }

  @Put(':id/availability')
  @UseGuards(AuthGuard('jwt'))
  async setAvailability(
    @Param('id') id: string,
    @Body('isAvailable') isAvailable: boolean,
  ): Promise<Offer | null> {
    return this.offersService.setAvailability(id, isAvailable);
  }
}
