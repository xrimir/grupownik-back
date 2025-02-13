import {
  IsString,
  IsBoolean,
  IsOptional,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreatePostDto {
  @IsString()
  @MaxLength(255)
  title: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsBoolean()
  @IsOptional()
  published?: boolean;
}

export class UpdatePostDto {
  @IsUUID()
  id: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsBoolean()
  published?: boolean;
}

export class DeletePostDto {
  @IsUUID()
  id: string;
}

export class PostResponseDto {
  @IsUUID()
  id: string;

  @IsString()
  @MaxLength(255)
  title: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsBoolean()
  published: boolean;

  @IsUUID()
  authorId: string;

  createdAt: Date;
  updatedAt: Date;
}
