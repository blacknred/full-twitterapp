import { Module } from '@nestjs/common';

import { FirehoseController } from './firehose.controller';
import { FirehoseService } from './firehose.service';

@Module({
  controllers: [FirehoseController],
  providers: [FirehoseService],
})
export class FirehoseModule {}
