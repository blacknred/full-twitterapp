import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Connection } from 'amqplib';
import { InjectAmqpConnection } from 'nestjs-amqp';
import { RedisService } from 'nestjs-redis';

import { CreateBanDto } from './dto/create-ban.dto';
import { GetBansDto } from './dto/get-bans.dto';

@Injectable()
export class BansService {
  private readonly logger = new Logger(BansService.name);

  constructor(
    private readonly redisService: RedisService,
    @InjectAmqpConnection() private readonly queueService: Connection,
  ) {}

  async create({ uid }: CreateBanDto) {
    const users = this.redisService.getClient('users');

    if (!(await users.exists(`USER:${uid}`))) {
      throw new ConflictException({
        errors: [{ field: 'uid', message: 'User not exists' }],
      });
    }

    if (!(await users.exists(`BLACKLIST:${uid}`))) {
      throw new ConflictException({
        errors: [{ field: 'uid', message: 'User already in blacklist' }],
      });
    }

    await users.zadd(`BLACKLIST:${uid}`, uid, Date.now());

    return { data: {} };
  }

  async findAll(auid: number, { limit, createdAt, order }: GetBansDto) {
    const pipe = this.redisService.getClient('users').pipeline();
    const args = ['LIMIT', '0', `${limit}`] as const;
    const name = `BLACKLIST:${auid}`;

    pipe.zcard(name);

    if (order === 'DESC') {
      pipe.zrevrangebyscore(name, `(${createdAt}`, '-inf', ...args);
    } else {
      pipe.zrangebyscore(name, `(${createdAt}`, '+inf', ...args);
    }

    const [total, ...uids] = await pipe.exec();
    const items = await Promise.allSettled(uids.map((uid) => {}));

    return { data: { total, items } };
  }

  async remove(uid: number) {
    const users = this.redisService.getClient('users');

    if (!(await users.exists(`BLACKLIST:${uid}`))) {
      throw new NotFoundException({
        errors: [{ field: 'uid', message: 'User already in blacklist' }],
      });
    }

    await users.zrem(`BLACKLIST:${uid}`, uid);

    return { data: null };
  }
}
