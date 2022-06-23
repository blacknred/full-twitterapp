import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { TrendsController } from './trends.controller';
import { TrendsService } from './trends.service';

@Module({
  imports: [ConfigModule],
  controllers: [TrendsController],
  providers: [TrendsService],
})
export class TrendsModule {}
