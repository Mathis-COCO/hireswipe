import { Module } from '@nestjs/common';
import { OffersService } from './offers.service';
import { OffersController } from './offers.controller';
import { Offer } from './entities/offer.entity';
import { User } from 'src/users/user.entity'; // Correction de l'import
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Offer, User])],
  controllers: [OffersController],
  providers: [OffersService],
})
export class OffersModule {}
