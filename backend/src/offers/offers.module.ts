import { Module } from '@nestjs/common';
import { OffersService } from './offers.service';
import { OffersController } from './offers.controller';
import { Offer } from './entities/offer.entity';
import { User } from 'src/users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfferCandidate } from 'src/users/entities/userOffer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Offer, User, OfferCandidate])],
  controllers: [OffersController],
  providers: [OffersService],
})
export class OffersModule {}
