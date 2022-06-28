import { Injectable, Logger } from '@nestjs/common';
import { Connection } from 'amqplib';
import { InjectAmqpConnection } from 'nestjs-amqp';
import { RedisService } from 'nestjs-redis';

@Injectable()
export class StatusesService {
  private readonly logger = new Logger(StatusesService.name);

  constructor(
    private readonly redisService: RedisService,
    @InjectAmqpConnection() private readonly queueService: Connection,
  ) {}

  async create() {
    const client = await this.redisService.getClient('statuses');
  }

  async findAll() {}

  async findOne() {}

  async update() {}

  async remove() {}
}
