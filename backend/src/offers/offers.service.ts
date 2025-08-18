import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Offer } from './entities/offer.entity';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { User } from 'src/users/user.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createOfferDto: CreateOfferDto, userId: string): Promise<Offer> {
    const offer = this.offerRepository.create(createOfferDto);
    if (userId) {
      const user = await this.userRepository.findOne({
        where: { id: userId },
        // relations: ['createdOffers'], // Not needed for creation
      });
      if (user) {
        offer.createdBy = user;
        // Do NOT push offer to user.createdOffers or save user here
      }
    }
    return this.offerRepository.save(offer);
  }

  async findAll(): Promise<Offer[]> {
    return this.offerRepository.find();
  }

  async findOne(id: string): Promise<Offer | null> {
    return this.offerRepository.findOne({ where: { id } });
  }

  async update(
    id: string,
    updateOfferDto: UpdateOfferDto,
  ): Promise<Offer | null> {
    await this.offerRepository.update(id, updateOfferDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.offerRepository.delete(id);
  }
}
