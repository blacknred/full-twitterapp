import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { StatusesController } from './statuses.controller';
import { StatusesService } from './statuses.service';

@Module({
  imports: [ConfigModule],
  controllers: [StatusesController],
  providers: [StatusesService],
})
export class StatusesModule {}
