import { Injectable, Logger } from '@nestjs/common';
import { Connection } from 'amqplib';
import { InjectAmqpConnection } from 'nestjs-amqp';
import { RedisService } from 'nestjs-redis';

@Injectable()
export class LikesService {
  private readonly logger = new Logger(LikesService.name);

  constructor(
    private readonly redisService: RedisService,
    @InjectAmqpConnection() private readonly queueService: Connection,
  ) {}

  async create() {
    const client = await this.redisService.getClient('users');
    // likes:uid sid^createdAt
    // likes:sid uid^createdAt
    // <!-- - `likes sid^uid` -->
  }

  async findAll() {}

  async remove() {}
}
