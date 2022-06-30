import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { BlocksController } from './blocks.controller';
import { BlocksService } from './blocks.service';

@Module({
  imports: [ConfigModule],
  controllers: [BlocksController],
  providers: [BlocksService],
})
export class BlocksModule {}
