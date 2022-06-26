import { ConfigService } from '@nestjs/config';
import type { RedisModuleAsyncOptions } from 'nestjs-redis';

export const redisProvider: RedisModuleAsyncOptions = {
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const base = {
      url: configService.get('REDIS_URL'),
      showFriendlyErrorStack: configService.get('NODE_ENV') !== 'production',
      enableAutoPipelining: true,
    };
    return ['users', 'statuses'].map((name, db) => ({ ...base, name, db }));
  },
};
