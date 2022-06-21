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
  vapidPublicKey: string;

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

  async findAll({ limit = 10, offset = 0, ...rest }: GetAuthsDto) {
    // TODO: list all sessions
    // 1. ZRANGE with sorted sets
    // --scan --pattern 'abc:*'
    const total = await this.cacheService.dbsizeAsync();
    const [cursor, items] = await this.cacheService.scanAsync(+offset, [
      'COUNT',
      `${limit}`,
      'MATCH',
      'sess:*',
    ]);

    return {
      data: { hasMore: cursor > 0, total, items },
    };
  }

  createPush(
    subscriptions: IPushSubscription[],
    subscriptionDto: PushSubscriptionDto,
  ) {
    const dto = JSON.stringify(subscriptionDto);

    if (subscriptions.every((sub) => JSON.stringify(sub) !== dto)) {
      subscriptions.push(subscriptionDto);
    }

    return { data: subscriptionDto };
  }

  deletePush(
    subscriptions: IPushSubscription[],
    subscriptionDto: PushSubscriptionDto,
  ) {
    const dto = JSON.stringify(subscriptionDto);
    const index = subscriptions.findIndex((sub) => JSON.stringify(sub) === dto);

    if (index > -1) {
      subscriptions.splice(index, 1);
    }

    return { data: null };
  }
}
