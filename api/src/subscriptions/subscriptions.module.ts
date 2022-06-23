import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { BansController } from './subscriptions.controller';
import { BansService } from './subscriptions.service';

@Module({
  imports: [ConfigModule],
  controllers: [BansController],
  providers: [BansService],
})
export class BansModule {}
