import { Controller, Delete, Get, Post, Put, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  get() {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create() {}

  @UseGuards(JwtAuthGuard)
  @Put()
  update() {}

  @UseGuards(JwtAuthGuard)
  @Delete()
  delete() {}
}
