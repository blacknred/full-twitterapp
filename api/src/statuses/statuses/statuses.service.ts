import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, Logger } from '@nestjs/common';
import type { Channel, Connection, ConsumeMessage } from 'amqplib';
import { InjectAmqpConnection } from 'nestjs-amqp';
import { RedisService } from 'nestjs-redis';

import { bufferToNumberArray } from 'src/__shared__/utils';
import { FANOUT_QUEUE } from './const';
import { Status } from './entities/status.entity';

@Injectable()
export class StatusesService {
  private readonly logger = new Logger(StatusesService.name);
  private fanoutQueue: Channel;
  private fanoutConsumer: Channel;

  constructor(
    private readonly redisService: RedisService,
    @InjectAmqpConnection() queueService: Connection,
    @InjectRepository(Status)
    private statusRepository: EntityRepository<Status>,
  ) {
    // Fanout updates

    queueService.createChannel().then(async (ch1) => {
      this.fanoutConsumer = ch1;

      this.fanoutQueue = await queueService.createChannel();
      await this.fanoutQueue.assertQueue(FANOUT_QUEUE);

      await ch1.assertQueue(FANOUT_QUEUE, { durable: true });
      await ch1.prefetch(1);
      await ch1.consume(FANOUT_QUEUE, this.fanout.bind(this), { noAck: false });
    });

    // TODO: daily old statuses archivation with rabbitmq_delayed_message_exchange
    // TODO: handle scheduled statuses with rabbitmq_delayed_message_exchange
  }

  async fanout(msg: ConsumeMessage) {
    if (msg) {
      const cache = this.redisService.getClient('statuses');
      const [uid, sid, ts, idx] = bufferToNumberArray(msg.content);
      const pipe = cache.pipeline();

      const uids = await cache.zrange(`FOLLOWERS:${uid}`, idx, idx + 1000);

      for (const id of uids) {
        pipe.zadd(`FEED:${id}`, sid, ts);
      }

      await pipe.exec();

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
