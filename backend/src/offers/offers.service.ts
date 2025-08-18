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
      });
      if (user) {
        offer.createdBy = user;
      }
    }
    return this.offerRepository.save(offer);
  }

  async findAll(): Promise<Offer[]> {
    return this.offerRepository.find();
  }

  async findAllForUser(userId: string): Promise<Offer[]> {
    return this.offerRepository.find({ where: { createdBy: { id: userId } } });
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

  async getRandomAvailableOffer(): Promise<Offer | null> {
    const now = new Date();
    const availableOffers = await this.offerRepository.find({
      where: { isAvailable: true },
    });
    const validOffers = availableOffers.filter(
      (o) => !o.createdAt || o.createdAt <= now,
    );
    if (validOffers.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * validOffers.length);
    return validOffers[randomIndex];
  }

  async getRandomAvailableOfferForCandidate(
    userId: string,
  ): Promise<Offer | null> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) return null;

    const interactedIds = user.interactedOfferIds ?? [];
    const availableOffers = await this.offerRepository.find({
      where: { isAvailable: true },
    });
    const validOffers = availableOffers.filter(
      (o) => !interactedIds.includes(String(o.id)),
    );
    if (validOffers.length === 0) return null;
    const randomOffer =
      validOffers[Math.floor(Math.random() * validOffers.length)];

    if (!interactedIds.includes(String(randomOffer.id))) {
      user.interactedOfferIds = [...interactedIds, String(randomOffer.id)];
      await this.userRepository.save(user);
    }

    return randomOffer;
  }
}
