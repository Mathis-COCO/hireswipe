/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { Offer } from 'src/offers/entities/offer.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password?: string;

  @Column({ default: 'candidat' })
  role: string;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ nullable: true })
  age?: number;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  jobTitle?: string;

  @Column({ nullable: true })
  candidateLocationAddress?: string;

  @Column({ nullable: true })
  workExperiences?: string;

  @Column({ nullable: true })
  education?: string;

  @Column('simple-array', { nullable: true })
  hardSkills?: string[];

  @Column('simple-array', { nullable: true })
  softSkills?: string[];

  @Column({ type: 'jsonb', nullable: true })
  languages?: Array<{ language: string; level: string }>;

  @Column({ nullable: true })
  salary?: number;

  @Column('simple-array', { nullable: true })
  contractTypes?: string[];

  @Column('simple-array', { nullable: true })
  workModes?: string[];

  @Column({ nullable: true })
  profilePhoto?: string;

  @Column({ nullable: true })
  bio?: string;

  @Column({ nullable: true })
  companyName?: string;

  @Column({ nullable: true })
  companySize?: string;

  @Column({ nullable: true })
  website?: string;

  @Column({ nullable: true })
  linkedinUrl?: string;

  @Column({ nullable: true })
  sector?: string;

  @Column({ nullable: true })
  companyAddress?: string;

  @Column({ nullable: true })
  pitch?: string;

  @Column({ nullable: true })
  values?: string;

  @Column('simple-array', { nullable: true })
  benefits?: string[];

  @Column({ nullable: true })
  companyLogo?: string;

  @Column({ nullable: true })
  companyDescription?: string;

  @Column({ nullable: true })
  workEnvironment?: string;

  @OneToMany(() => Offer, (offer: Offer) => offer.createdBy)
  createdOffers: Offer[];

  @ManyToMany(() => Offer, (offer: Offer) => offer.candidates)
  appliedOffers: Offer[];
}
