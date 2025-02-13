import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AssetModule } from '../asset/asset.module';

@Module({
  imports: [PrismaModule, AssetModule],
  providers: [PostService],
  controllers: [PostController],
})
export class PostModule {}
