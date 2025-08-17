import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Offer } from './entities/offer.entity';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
  ) {}

  async create(createOfferDto: CreateOfferDto): Promise<Offer> {
    const offer = this.offerRepository.create(createOfferDto);
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
