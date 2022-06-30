import { Injectable, Logger, MessageEvent } from '@nestjs/common';
import { Response } from 'express';
import { RedisService } from 'nestjs-redis';
import { Observable } from 'rxjs';

import { STATUS_EVENT_STREAM } from 'src/statuses/statuses/const';
import { Status } from 'src/statuses/statuses/types/status.type';
import { StatusEvent } from 'src/statuses/statuses/types/statusEvent.type';
import { SseFirehoseDto } from './dto/sse-firehose.dto';

@Injectable()
export class FirehoseService {
  private readonly logger = new Logger(FirehoseService.name);
  rate = 0.8;

  constructor(private readonly redisService: RedisService) {
    const redis = this.redisService.getClient('statuses');
    redis.subscribe([STATUS_EVENT_STREAM]);
    let it = 0;

    redis.on('message', () => it++);
    setInterval(this.overrate, 60000, it);
  }

  overrate(it: number) {
    this.rate = it / 60;
  }

  intercept(res: Response, auid: number, dto: SseFirehoseDto) {
    return new Observable<MessageEvent>((subscriber) => {
      const redis = this.redisService.getClient('statuses');

      redis.hset(`USER:${auid}`, { firehose: 'true' });
      redis.subscribe([STATUS_EVENT_STREAM]);

      res.on('close', () => {
        redis.unsubscribe();
        redis.hset(`USER:${auid}`, { firehose: 'false' });
      });

      redis.on('message', (channel, message) => {
        const { status } = JSON.parse(message) as StatusEvent;

        if (this.passedFilter(dto, status)) {
          subscriber.next({
            data: status,
            id: Date.now().toString(),
          });
        }
      });
    });
  }

  passedFilter(args: SseFirehoseDto, status: Status) {
    switch (args.filter) {
      case 'track':
        return this.trackFilter(status, args.q);
      case 'mention':
        return this.mentionFilter(status, args.uid);
      default:
        return this.sampleFilter;
    }
  }

  sampleFilter() {
    return Math.random() > this.rate;
  }

  mentionFilter(status: Status, uid: number) {
    return status.author.id === uid;
  }

  trackFilter(status: Status, q: string) {
    if (!status.text) return false;
    const list = status.text.toLowerCase().split(' ');
    const search = q.toLowerCase().split(' ');

    return search.every((x) => !x || list.includes(x));
  }
}
