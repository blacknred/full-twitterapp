import { Module } from '@nestjs/common';

import { FeedsModule } from './feeds/feeds.module';
import { FirehoseModule } from './firehose/firehose.module';
import { LikesModule } from './likes/likes.module';
import { NotificationsModule } from './notifications/notifications.module';
import { StatusesModule as BaseModule } from './statuses/statuses.module';
import { TrendsModule } from './trends/trends.module';

@Module({
  imports: [
    BaseModule,
    TrendsModule,
    LikesModule,
    FeedsModule,
    FirehoseModule,
    NotificationsModule,
  ],
})
export class StatusesModule {}
