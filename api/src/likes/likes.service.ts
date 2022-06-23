import { Injectable, Logger } from '@nestjs/common';
import { Connection } from 'amqplib';
import { InjectAmqpConnection } from 'nestjs-amqp';
import { RedisService } from 'nestjs-redis';

@Injectable()
export class LikesService {
  private readonly logger = new Logger(LikesService.name);

  // likes:uid sid^createdAt
  // likes:sid uid^createdAt
  // <!-- - `likes sid^uid` -->
  constructor(
    private readonly redisService: RedisService,
    @InjectAmqpConnection() private readonly queueService: Connection,
  ) {}

  async create() {}

  async findAll() {}

  async remove() {}
}
