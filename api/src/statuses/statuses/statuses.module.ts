import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { Status } from './entities/status.entity';
import { StatusesController } from './statuses.controller';
import { StatusesService } from './statuses.service';

@Module({
  imports: [ConfigModule, MikroOrmModule.forFeature([Status])],
  controllers: [StatusesController],
  providers: [StatusesService],
})
export class StatusesModule {}
