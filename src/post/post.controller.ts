import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { PostService } from './post.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreatePostDto, DeletePostDto, UpdatePostDto } from './dto/PostDto';
import { CustomRequest } from '../types';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getAll() {
    return this.postService.getAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getById(@Param('id') id: string) {
    return await this.postService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('asset'))
  async create(
    @Req() req: CustomRequest,
    @Body() createPostDto: CreatePostDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png)$/,
        })
        .addMaxSizeValidator({
          maxSize: 10 * 1024 * 1024,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ) {
    try {
      const userId = req.user?.id ?? '';
      await this.postService.create(createPostDto, userId, file);
      return { message: ['Post created successfully'] };
    } catch (error: unknown) {
      if (typeof error === 'string') {
        throw new HttpException(error, HttpStatus.BAD_REQUEST);
      }
      if (error instanceof Error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  @HttpCode(HttpStatus.OK)
  async update(
    @Req() req: CustomRequest,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    try {
      const userId = req.user?.id ?? '';
      await this.postService.update(updatePostDto, userId);
      return { message: ['Post updated successfully'] };
    } catch (error: unknown) {
      if (typeof error === 'string') {
        throw new HttpException(error, HttpStatus.BAD_REQUEST);
      }
      if (error instanceof Error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Req() req: CustomRequest,
    @Param(new ValidationPipe({ transform: true }))
    deletePostDto: DeletePostDto,
  ) {
    try {
      const userId = req.user?.id ?? '';
      await this.postService.delete(deletePostDto, userId);
      return { message: ['Post deleted successfully'] };
    } catch (error: unknown) {
      if (typeof error === 'string') {
        throw new HttpException(error, HttpStatus.BAD_REQUEST);
      }
      if (error instanceof Error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }
  }
}
