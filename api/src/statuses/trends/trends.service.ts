import { Injectable, Logger } from '@nestjs/common';
import { Connection } from 'amqplib';
import { InjectAmqpConnection } from 'nestjs-amqp';
import { RedisService } from 'nestjs-redis';

import { GetTrendsDto } from './dto/get-trends.dto';
import { Trend } from './types/trend.type';

@Injectable()
export class TrendsService {
  private readonly logger = new Logger(TrendsService.name);

  constructor(
    private readonly redisService: RedisService,
    @InjectAmqpConnection() private readonly queueService: Connection,
  ) {
    // TODO: hourly old trends filter with rabbitmq_delayed_message_exchange
  }

  async findAll({ limit, createdAt, order }: GetTrendsDto) {
    const pipe = this.redisService.getClient('statuses').pipeline();
    const args = ['WITHSCORES', 'LIMIT', '0', `${limit + 1}`] as const;
    const name = 'TRENDS';

    pipe.zcard(name);

    if (order === 'DESC') {
      pipe.zrevrangebyscore(name, `(${createdAt}`, '-inf', ...args);
    } else {
      pipe.zrangebyscore(name, `(${createdAt}`, '+inf', ...args);
    }

    const [total, rest] = await pipe.exec();

    const items: Trend[] = [];
    for (let i = 0; i < rest[1].length; i += 2) {
      items.push({ tag: rest[i], count: rest[i + 1] });
    }

    return {
      data: {
        total: total[1],
        items: items.slice(0, limit),
        hasMore: items.length === limit + 1,
      },
    };
  }
}
