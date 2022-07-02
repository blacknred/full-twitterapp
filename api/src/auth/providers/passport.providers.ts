import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';
import { Strategy } from 'passport-local';
import type { Request } from 'express';

import { UsersService } from 'src/users/users/users.service';
import { Auth } from '../types/auth.type';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UsersService) {
    super({ usernameField: 'emailOrUsername' });
  }

  async validate(emailOrUsername: string, password: string): Promise<any> {
    const params = { password, emailOrUsername };
    const user = await this.userService.findValidatedOne(params);

    if (!user) throw new UnauthorizedException();
    return user;
  }
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService, private authService: AuthService) {
    super({
      // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req?.cookies?.Authentication,
      ]),
      secretOrKey: configService.get('SECRET'),
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: Auth) {
    if (this.authService.isBlocked(payload.id)) {
      throw new UnauthorizedException();
    }
    return payload;
  }
}

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(configService: ConfigService, private userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req?.cookies?.Refresh,
      ]),
      secretOrKey: configService.get('SECRET'),
    });
  }

  async validate(payload: Auth) {
    return this.userService.findOne(payload.id);
  }
}

export default [LocalStrategy, JwtStrategy];
