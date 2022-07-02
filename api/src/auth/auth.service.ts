import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from 'nestjs-redis';

import { ACCESS_TOKEN_LIFESPAN, REFRESH_TOKEN_LIFESPAN } from './consts';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {}

  public async isBlocked(id: number) {
    return this.redisService.getClient('users').zscore('BLACKLIST', `${id}`);
  }

  public createAccessCookie(id: number) {
    const payload = { id };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('SECRET'),
      expiresIn: ACCESS_TOKEN_LIFESPAN,
    });

    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${ACCESS_TOKEN_LIFESPAN}`;
  }

  public createRefreshCookie(id: number) {
    const payload = { id };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('SECRET'),
      expiresIn: REFRESH_TOKEN_LIFESPAN,
    });

    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${REFRESH_TOKEN_LIFESPAN}`;
  }

  public remove() {
    return [
      'Authentication=; HttpOnly; Path=/; Max-Age=0',
      'Refresh=; HttpOnly; Path=/; Max-Age=0',
    ];
  }
}
