import { ConfigService } from '@nestjs/config';
import type { RedisModuleAsyncOptions } from 'nestjs-redis';

export const redisProvider: RedisModuleAsyncOptions = {
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => [
    {
      name: 'users',
      url: configService.get('REDIS_URL'),
      db: 0,
    },
    {
      name: 'statuses',
      url: configService.get('REDIS_URL'),
      db: 1,
    },
  ],
};
