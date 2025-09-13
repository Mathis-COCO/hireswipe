import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, IsNull } from 'typeorm';
import { Offer } from './entities/offer.entity';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { User } from 'src/users/entities/user.entity';
import { OfferCandidate } from '../users/entities/userOffer.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(OfferCandidate)
    private readonly offerCandidateRepository: Repository<OfferCandidate>,
  ) {}

  async create(createOfferDto: CreateOfferDto, userId: string): Promise<Offer> {
    const offer = this.offerRepository.create(createOfferDto);
    if (userId) {
      const user = await this.userRepository.findOne({ where: { id: userId } });
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

  /**
   * Set an offer availability. When marking unavailable, remove its candidate entries
   * and remove references from users' interactedOfferIds.
   */
  async setAvailability(
    id: string,
    isAvailable: boolean,
  ): Promise<Offer | null> {
    const offer = await this.findOne(id);
    if (!offer) return null;

    // If marking unavailable, delete offerCandidate relations and clean user interacted ids
    if (!isAvailable) {
      // delete all OfferCandidate rows for this offer using offerId column
      await this.offerCandidateRepository
        .createQueryBuilder()
        .delete()
        .where('"offerId" = :id', { id })
        .execute();

      // find users who have any interactedOfferIds (simple-array parsed by TypeORM)
      // then filter in application code to avoid SQL array/ANY mismatches with simple-array storage
      const usersWithInteraction = await this.userRepository.find({
        where: { interactedOfferIds: Not(IsNull()) },
      });

      for (const u of usersWithInteraction) {
        if (!u.interactedOfferIds || u.interactedOfferIds.length === 0) {
          continue;
        }

        // interactedOfferIds is mapped to a string[] by TypeORM for simple-array columns
        const filtered = u.interactedOfferIds.filter((x) => x !== String(id));

        // If there are changes, persist the updated array (empty array is allowed)
        if (filtered.length !== u.interactedOfferIds.length) {
          u.interactedOfferIds = filtered;
          await this.userRepository.save(u);
        }
      }
    }

    await this.offerRepository.update(id, { isAvailable });
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

  async applyToOffer(offerId: string, userId: string): Promise<void> {
    const offer = await this.offerRepository.findOne({
      where: { id: offerId },
      relations: ['candidates'],
    });
    if (!offer) throw new Error('Offer not found');

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    const alreadyCandidate = offer.candidates.some(
      (oc) => oc.user.id === userId,
    );
    if (alreadyCandidate) return;

    const offerCandidate = new OfferCandidate();
    offerCandidate.offer = offer;
    offerCandidate.user = user;
    offerCandidate.status = 'pending';

    offer.candidates.push(offerCandidate);

    await this.offerCandidateRepository.save(offerCandidate);
  }

  async updateCandidateStatus(
    offerId: string,
    candidateId: string,
    status: string,
  ) {
    const offerCandidate = await this.offerCandidateRepository.findOne({
      where: { offer: { id: offerId }, user: { id: candidateId } },
      relations: ['offer', 'user'],
    });
    if (!offerCandidate) throw new Error('Candidate not found');
    offerCandidate.status = status;
    return this.offerCandidateRepository.save(offerCandidate);
  }

  async hasRemainingOffer(userId: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) return false;

    const interactedIds = user.interactedOfferIds ?? [];
    const availableOffers = await this.offerRepository.find({
      where: { isAvailable: true },
    });

    return availableOffers.some((o) => !interactedIds.includes(String(o.id)));
  }
}
