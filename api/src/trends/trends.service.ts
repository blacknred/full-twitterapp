import { Injectable, Logger } from '@nestjs/common';
import { Connection } from 'amqplib';
import { InjectAmqpConnection } from 'nestjs-amqp';
import { RedisService } from 'nestjs-redis';

@Injectable()
export class TrendsService {
  private readonly logger = new Logger(TrendsService.name);

  constructor(
    private readonly redisService: RedisService,
    @InjectAmqpConnection() private readonly queueService: Connection,
  ) {}

  async create() {
    // trends hash^statuses_cnt <100 cut
  }

  async findAll() {}
}
