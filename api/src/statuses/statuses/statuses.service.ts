import { Injectable, Logger } from '@nestjs/common';
import type { Channel, Connection, ConsumeMessage } from 'amqplib';
import type { Redis } from 'ioredis';
import { InjectAmqpConnection } from 'nestjs-amqp';
import { RedisService } from 'nestjs-redis';

import { bufferToNumberArray } from 'src/__shared__/utils';
import { FANOUT_QUEUE } from './const';

@Injectable()
export class StatusesService {
  private readonly logger = new Logger(StatusesService.name);
  private cache: Redis;
  private fanoutQueue: Channel;
  private fanoutConsumer: Channel;

  constructor(
    redisService: RedisService,
    @InjectAmqpConnection() queueService: Connection,
  ) {
    this.cache = redisService.getClient('statuses');

    queueService.createChannel().then(async (ch1) => {
      this.fanoutConsumer = ch1;
      await ch1.assertQueue(FANOUT_QUEUE, { durable: true });
      await ch1.prefetch(1);
      await ch1.consume(FANOUT_QUEUE, this.fanout.bind(this), { noAck: false });
    });

    queueService.createChannel().then(async (ch2) => {
      await ch2.assertQueue(FANOUT_QUEUE);
      this.fanoutQueue = ch2;
    });
  }

  async fanout(msg: ConsumeMessage) {
    if (msg) {
      const [uid, sid, ts, idx] = bufferToNumberArray(msg.content);
      const nextIdx = idx + 1000;
      const uids = await this.cache.zrange(`FOLLOWERS:${uid}`, idx, nextIdx);

      for (const id of uids) {
        this.cache.zadd(`FEED:${id}`, sid, ts);
      }

      if (uids.length === 1000) {
        const args = Buffer.from([uid, sid, ts, idx]);
        this.fanoutQueue.sendToQueue(FANOUT_QUEUE, args, {
          deliveryMode: true,
        });
      }
    }

    this.fanoutConsumer.ack(msg);
  }

  async create() {
    // fanout
    const uid = 1;
    const sid = 45;
    const args = Buffer.from([uid, sid, Date.now(), 0]);
    this.fanoutQueue.sendToQueue(FANOUT_QUEUE, args, {
      deliveryMode: true,
    });
  }

  async findAll() {}

  async findOne() {}

  async remove() {}
}
