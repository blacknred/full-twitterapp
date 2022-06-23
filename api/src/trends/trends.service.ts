import { Injectable, Logger } from '@nestjs/common';
import { Connection } from 'amqplib';
import { InjectAmqpConnection } from 'nestjs-amqp';
import { RedisService } from 'nestjs-redis';

@Injectable()
export class TrendsService {
  private readonly logger = new Logger(TrendsService.name);

  // trends hash^statuses_cnt <100
  constructor(
    private readonly redisService: RedisService,
    @InjectAmqpConnection() private readonly queueService: Connection,
  ) {}

  async create() {}

  async findAll() {}
}
