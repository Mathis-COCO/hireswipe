import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Offer } from 'src/offers/entities/offer.entity';
import { OfferCandidate } from './entities/userOffer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Offer, OfferCandidate])],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
