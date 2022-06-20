import { ConfigService } from '@nestjs/config';
import { REDIS_SERVICE } from '../consts';
import { RedisAdapter } from '../utils/redis.adapter';

export const redisProvider = {
  provide: REDIS_SERVICE,
  inject: [ConfigService],
  useFactory: (configService: ConfigService) =>
    new RedisAdapter({ url: configService.get('REDIS_URL') }),
};
