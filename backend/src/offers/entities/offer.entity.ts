/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
} from 'typeorm';
import { User } from 'src/users/user.entity';

@Entity()
export class Offer {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  salary: string;

  @Column()
  experience: string;

  @Column()
  contract: string;

  @Column({ default: false })
  teletravail: boolean;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column('text', { array: true, default: [] })
  skills: string[];

  @Column('text', { array: true, default: [] })
  avantages: string[];

  @Column({ type: 'float', nullable: true })
  latitude: number;

  @Column({ type: 'float', nullable: true })
  longitude: number;

  @Column()
  category: string;

  @Column({ nullable: true })
  imageUrl: string;

  @ManyToOne(() => User, (user: User) => user.createdOffers, { eager: true })
  createdBy: User;

  @ManyToMany(() => User, (user: User) => user.appliedOffers, { eager: true })
  @JoinTable()
  candidates: User[];

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn({ nullable: true })
  updatedAt?: Date;

  @Column({ default: true })
  isAvailable: boolean;
}
