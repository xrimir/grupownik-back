import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Param,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileDto } from './dto/ProfileDto';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post(':userId')
  create(
    @Param('userId') userId: string,
    @Body() createProfileDto: ProfileDto,
  ) {
    return this.profileService.create(createProfileDto, userId);
  }

  @Get(':userId')
  findOne(@Param('userId') userId: string) {
    return this.profileService.findOne(userId);
  }

  @Patch(':userId')
  update(
    @Param('userId') userId: string,
    @Body() updateProfileDto: ProfileDto,
  ) {
    return this.profileService.update(updateProfileDto, userId);
  }

  @Delete(':userId')
  remove(@Param('userId') userId: string) {
    return this.profileService.delete(userId);
  }
}
