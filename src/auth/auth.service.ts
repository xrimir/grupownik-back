import { Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { Role, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as process from 'node:process';
import { TokenPayload } from './types/token';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validate(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findOne(email);

    if (!user) {
      throw new NotFoundException();
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    return isPasswordValid ? user : null;
  }

  async login(user: User): Promise<TokenPayload> {
    const { email, id, role } = user;
    return await this.getTokens(email, id, role);
  }

  async getTokens(
    email: string,
    userId: string,
    role: Role,
  ): Promise<TokenPayload> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          role,
          email,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: process.env.JWT_ACCESS_EXPIRE_DATE,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          role,
          email,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: process.env.JWT_REFRESH_EXPIRE_DATE,
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
