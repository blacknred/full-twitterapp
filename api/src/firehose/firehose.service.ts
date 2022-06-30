import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from 'nestjs-redis';

@Injectable()
export class FirehoseService {
  private readonly logger = new Logger(FirehoseService.name);

  constructor(private readonly redisService: RedisService) {}

  async create() {
    const client = await this.redisService.getClient('statuses');
    // blacklist:uid uid^createdAt
  }
}
