import { Injectable, Logger } from '@nestjs/common';
import { Connection } from 'amqplib';
import { InjectAmqpConnection } from 'nestjs-amqp';
import { RedisService } from 'nestjs-redis';

@Injectable()
export class SubscriptionsService {
  private readonly logger = new Logger(SubscriptionsService.name);

  constructor(
    private readonly redisService: RedisService,
    @InjectAmqpConnection() private readonly queueService: Connection,
  ) {}

  async create() {}

  async findAll() {}

  async remove() {}
}
