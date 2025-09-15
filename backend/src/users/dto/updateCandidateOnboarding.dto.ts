/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsOptional, IsString, IsNumber, IsArray } from 'class-validator';

export class UpdateCandidateOnboardingDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsNumber()
  age?: number;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  jobTitle?: string;

  @IsOptional()
  @IsString()
  candidateLocationAddress?: string;

  @IsOptional()
  @IsNumber()
  latitude?: string;

  @IsOptional()
  @IsNumber()
  longitude?: string;

  @IsOptional()
  @IsString()
  workExperiences?: string;

  @IsOptional()
  @IsString()
  education?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  hardSkills?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  softSkills?: string[];

  @IsOptional()
  @IsArray()
  languages?: Array<{ language: string; level: string }>;

  @IsOptional()
  @IsNumber()
  salary?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  contractTypes?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  workModes?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  licenseList?: string[];

  @IsOptional()
  @IsString()
  mobility?: string;

  @IsOptional()
  @IsString()
  profilePhoto?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  linkedinUrl?: string;

  @IsOptional()
  @IsString()
  experience?: string;
}
