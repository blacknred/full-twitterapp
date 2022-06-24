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
    // status:id hash
    // statuses:uid sid^createdAt
    //
    // #hashes go to statuses:hash sid^createdAt
    // @mentions go to notifications:uid sid^createdAt
    // get followers and enlarge their feed:uid
    //
    // retweets:sid sid^createdAt
  }

  async findAll() {}

  async findOne() {}

  async update() {}

  async remove() {}
}
