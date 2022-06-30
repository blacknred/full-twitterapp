import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CACHE_SERVICE } from './consts';
import { GetAuthsDto } from './dto/get-auths.dto';
import { PushSubscriptionDto } from './dto/push-subscription.dto';
import { IAuth, IPushSubscription } from './interfaces/auth.interface';
import { RedisAdapter } from './utils/redis.adapter';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  // vapidPublicKey: string;

  constructor(
    private readonly configService: ConfigService,
    @Inject(CACHE_SERVICE) private readonly cacheService: RedisAdapter,
  ) {
    this.vapidPublicKey = this.configService.get('VAPID_PUBLIC_KEY');
  }

  create(auth: IAuth) {
    const data = { ...auth, vapidPublicKey: this.vapidPublicKey };
    return { data };
  }
}
