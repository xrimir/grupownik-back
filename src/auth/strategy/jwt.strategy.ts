import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { User } from '@prisma/client';
import * as process from 'node:process';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ACCESS_SECRET ?? '',
    });
  }

  async validate(payload: { userId: string; email: string }): Promise<User> {
    const user = await this.userService.findOne(payload.email);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
