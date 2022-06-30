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
  ) {
    // TODO: hourly old trends filter with rabbitmq_delayed_message_exchange
  }

  async findAll() {
    const pipe = await this.redisService.getClient('statuses').pipeline();
    
  }
}
