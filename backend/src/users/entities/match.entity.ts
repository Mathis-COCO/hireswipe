import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Offer } from '../../offers/entities/offer.entity';

@Entity()
export class Match {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.matches)
  user: User;

  @ManyToOne(() => Offer)
  offer: Offer;

  @CreateDateColumn()
  createdAt: Date;
}
