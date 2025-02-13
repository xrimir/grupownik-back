import { IsString, IsOptional, IsEnum } from 'class-validator';
import { AgeRange, Gender } from '@prisma/client';

export class ProfileDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  nickname?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  @IsEnum(AgeRange)
  ageRange?: AgeRange;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;
}
