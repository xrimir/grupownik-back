import {
  Body,
  Post,
  Req,
  UseGuards,
  Controller,
  UnauthorizedException,
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/LoginDto';
import { RegisterDto } from './dto/RegisterDto';
import { UserService } from '../user/user.service';
import { CustomRequest } from '../types';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: CustomRequest, @Body() _: LoginDto) {
    const { user } = req;

    if (!user) {
      throw new UnauthorizedException();
    }

    return await this.authService.login(user);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const { email, password } = registerDto;

    const existingUser = await this.userService.findOne(email);

    if (!existingUser) {
      throw new ConflictException('User already exists');
    }

    const user = await this.userService.create(email, password);

    if (!user) {
      throw new InternalServerErrorException();
    }

    return { message: ['User registered successfully'] };
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh')
  async refresh(@Req() req: CustomRequest) {
    const { user } = req;

    if (!user) {
      throw new UnauthorizedException();
    }

    const { email, id, role } = user;
    return await this.authService.getTokens(email, id, role);
  }
}
