import { Injectable, Logger, MessageEvent } from '@nestjs/common';
import { Response } from 'express';
import { RedisService } from 'nestjs-redis';
import { Observable } from 'rxjs';

import { StatusEvent } from 'src/statuses/statuses/types/statusEvent.type';
import { SseFirehoseDto } from './dto/sse-firehose.dto';

@Injectable()
export class FirehoseService {
  private readonly logger = new Logger(FirehoseService.name);

  constructor(private readonly redisService: RedisService) {}

  intercept(res: Response, auid: number, dto: SseFirehoseDto) {
    return new Observable<MessageEvent>((subscriber) => {
      const redis = this.redisService.getClient('statuses');

      redis.hset(`USER:${auid}`, { firehose: 'true' });

      redis.subscribe(['streaming:status:']);

      res.on('close', () => redis.unsubscribe);

      redis.on('message', (channel, message) => {
        const event = JSON.parse(message) as StatusEvent;

        subscriber.next({
          data: event.status,
          id: Date.now().toString(),
        });
      });
    });
  }
}
