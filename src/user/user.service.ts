import { Injectable } from '@nestjs/common';
import { AgeRange, Gender, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { ProfileService } from '../profile/profile.service';
import { ProfileDto } from '../profile/dto/ProfileDto';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly profileService: ProfileService,
  ) {}

  async findOne(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email: email } });
  }

  async create(email: string, password: string): Promise<User> {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    const profileData: ProfileDto = {
      firstName: '',
      lastName: '',
      nickname: `user_${Math.random().toString(36).substring(7)}`,
      bio: '',
      ageRange: AgeRange.AGE_18_25,
      gender: Gender.OTHER,
    };

    await this.profileService.create(profileData, user.id);

    return user;
  }
}
