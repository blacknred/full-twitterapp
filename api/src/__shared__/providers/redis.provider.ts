import { ConfigService } from '@nestjs/config';
import type { RedisModuleAsyncOptions } from 'nestjs-redis';

export const redisProvider: RedisModuleAsyncOptions = {
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    url: configService.get('REDIS_URL'),
    retryStrategy(times) {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
  }),
};
