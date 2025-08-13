/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsOptional, IsString, IsArray, IsUrl } from 'class-validator';

export class UpdateRecruiterOnboardingDto {
  @IsOptional()
  @IsString()
  companyName?: string;

  @IsOptional()
  @IsString()
  companySize?: string;

  @IsOptional()
  @IsUrl()
  website?: string;

  @IsOptional()
  @IsUrl()
  linkedinUrl?: string;

  @IsOptional()
  @IsString()
  sector?: string;

  @IsOptional()
  @IsString()
  companyAddress?: string;

  @IsOptional()
  @IsString()
  pitch?: string;

  @IsOptional()
  @IsString()
  values?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  benefits?: string[];

  @IsOptional()
  @IsString()
  companyLogo?: string;

  @IsOptional()
  @IsString()
  companyDescription?: string;

  @IsOptional()
  @IsString()
  workEnvironment?: string;
}
