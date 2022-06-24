import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { LikesController } from './likes.controller';
import { LikesService } from './likes.service';

@Module({
  imports: [ConfigModule],
  controllers: [LikesController],
  providers: [LikesService],
})
export class LikesModule {}
