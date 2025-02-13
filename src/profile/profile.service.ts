import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProfileDto } from './dto/ProfileDto';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  async create(profile: ProfileDto, userId: string) {
    return this.prisma.profile.create({
      data: { ...profile, userId },
    });
  }

  async findOne(userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });
    if (!profile) throw new NotFoundException('Profile not found');
    return profile;
  }

  async update(profileDto: ProfileDto, userId: string) {
    return this.prisma.profile.update({
      where: { userId },
      data: { ...profileDto },
    });
  }

  async delete(userId: string) {
    return this.prisma.profile.delete({
      where: { userId },
    });
  }
}
