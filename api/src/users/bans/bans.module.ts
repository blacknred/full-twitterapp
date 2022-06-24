import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { BansController } from './bans.controller';
import { BansService } from './bans.service';

@Module({
  imports: [ConfigModule],
  controllers: [BansController],
  providers: [BansService],
})
export class BansModule {}
