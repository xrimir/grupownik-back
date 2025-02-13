import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ProfileModule } from '../profile/profile.module';

@Module({
  imports: [PrismaModule, ProfileModule],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
