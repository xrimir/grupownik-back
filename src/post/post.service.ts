import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto, DeletePostDto, UpdatePostDto } from './dto/PostDto';
import { PrismaService } from '../prisma/prisma.service';
import { Post } from '@prisma/client';
import { AssetService } from '../asset/asset.service';

@Injectable()
export class PostService {
  constructor(
    private assetService: AssetService,
    private readonly prismaService: PrismaService,
  ) {}

  getAll(): Post[] {
    return [];
  }

  async findById(id: string): Promise<Post | null> {
    return this.prismaService.post.findUnique({ where: { id } });
  }

  async create(
    postDto: CreatePostDto,
    userId: string,
    asset: Express.Multer.File | null,
  ): Promise<Post> {
    const assetData = asset ? await this.assetService.saveImage(asset) : null;

    return this.prismaService.post.create({
      data: {
        title: postDto.title,
        content: postDto.content,
        authorId: userId,
        published: true,
        assets: {
          create: assetData != null ? [assetData] : [],
        },
      },
    });
  }

  async update(postDto: UpdatePostDto, userId: string): Promise<Post> {
    const existingPost = await this.findById(postDto.id);

    if (!existingPost) {
      throw new NotFoundException('Post not found');
    }

    if (existingPost.authorId !== userId) {
      throw new ForbiddenException("Cannot update another user's post");
    }

    return this.prismaService.post.update({
      where: { id: postDto.id },
      data: {
        title: postDto.title,
        content: postDto.content,
        authorId: userId,
        published: true,
      },
    });
  }

  async delete(postDto: DeletePostDto, userId: string) {
    const post = await this.findById(postDto.id);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.authorId !== userId) {
      throw new ForbiddenException("Cannot delete another user's post");
    }

    return this.prismaService.post.delete({ where: { id: postDto.id } });
  }
}
