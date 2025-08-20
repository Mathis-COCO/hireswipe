import { Offer } from 'src/offers/entities/offer.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class OfferCandidate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Offer, (offer) => offer.candidates, { onDelete: 'CASCADE' })
  offer: Offer;

  @ManyToOne(() => User, (user) => user.appliedOffers, {
    onDelete: 'CASCADE',
    eager: true,
  })
  user: User;

  @Column({ default: 'pending' })
  status: string;
}
