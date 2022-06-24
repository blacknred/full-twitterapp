import { Injectable, Logger } from '@nestjs/common';
import { Connection } from 'amqplib';
import { InjectAmqpConnection } from 'nestjs-amqp';
import { RedisService } from 'nestjs-redis';

@Injectable()
export class BansService {
  private readonly logger = new Logger(BansService.name);

  constructor(
    private readonly redisService: RedisService,
    @InjectAmqpConnection() private readonly queueService: Connection,
  ) {}

  async create() {
    const client = await this.redisService.getClient('users');
    // blacklist:uid uid^createdAt
  }

  async findAll() {}

  async remove() {}
}
