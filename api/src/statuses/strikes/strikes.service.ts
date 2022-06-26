import { Injectable, Logger } from '@nestjs/common';
import { Connection } from 'amqplib';
import { InjectAmqpConnection } from 'nestjs-amqp';
import { RedisService } from 'nestjs-redis';

@Injectable()
export class StrikesService {
  private readonly logger = new Logger(StrikesService.name);

  constructor(
    private readonly redisService: RedisService,
    @InjectAmqpConnection() private readonly queueService: Connection,
  ) {}

  async create() {
    const client = await this.redisService.getClient('statuses');
    // strikes:sid reason^uid
  }

  async findAll() {}
}
