import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { RedisService } from 'nestjs-redis';

import { CreateBanDto } from './dto/create-ban.dto';
import { GetBansDto } from './dto/get-bans.dto';

@Injectable()
export class BansService {
  private readonly logger = new Logger(BansService.name);

  constructor(private readonly redisService: RedisService) {}

  async create({ uid }: CreateBanDto) {
    const cache = this.redisService.getClient('users');

    if (!(await cache.exists(`USER:${uid}`))) {
      throw new ConflictException({
        errors: [{ field: 'uid', message: 'User not exists' }],
      });
    }

    if (!(await cache.exists(`BLACKLIST:${uid}`))) {
      throw new ConflictException({
        errors: [{ field: 'uid', message: 'User already in blacklist' }],
      });
    }

    await cache.zadd(`BLACKLIST:${uid}`, uid, Date.now());

    return { data: {} };
  }

  async findAll(auid: number, { limit, createdAt, order }: GetBansDto) {
    const pipe = this.redisService.getClient('users').pipeline();
    const args = ['LIMIT', '0', `${limit + 1}`] as const;
    const name = `BLACKLIST:${auid}`;

    pipe.zcard(name);

    if (order === 'DESC') {
      pipe.zrevrangebyscore(name, `(${createdAt}`, '-inf', ...args);
    } else {
      pipe.zrangebyscore(name, `(${createdAt}`, '+inf', ...args);
    }

    const [total, ...uids] = await pipe.exec();
    const items = await Promise.allSettled(uids.map(([, uid]) => {}));

    return {
      data: {
        total: total[1],
        items: items.slice(0, limit),
        hasMore: items.length === limit + 1,
      },
    };
  }

  async remove(uid: number) {
    const cache = this.redisService.getClient('users');

    if (!(await cache.exists(`BLACKLIST:${uid}`))) {
      throw new NotFoundException({
        errors: [{ field: 'uid', message: 'User already in blacklist' }],
      });
    }

    await cache.zrem(`BLACKLIST:${uid}`, uid);

    return { data: null };
  }
}
