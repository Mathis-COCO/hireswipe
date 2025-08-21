import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Offer } from 'src/offers/entities/offer.entity';
import { OfferCandidate } from './entities/userOffer.entity';
import { Match } from './entities/match.entity';
import { OffersService } from 'src/offers/offers.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Offer, OfferCandidate, Match])],
  providers: [UsersService, OffersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
