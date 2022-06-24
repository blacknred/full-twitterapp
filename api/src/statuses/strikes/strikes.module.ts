import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { StrikesController } from './strikes.controller';
import { StrikesService } from './strikes.service';

@Module({
  imports: [ConfigModule],
  controllers: [StrikesController],
  providers: [StrikesService],
})
export class StrikesModule {}
