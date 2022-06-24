import { Module } from '@nestjs/common';

import { FeedsModule } from './feeds/feeds.module';
import { LikesModule } from './likes/likes.module';
import { NotificationsModule } from './notifications/notifications.module';
import { StatusesModule as BaseModule } from './statuses/statuses.module';
import { StrikesModule } from './strikes/strikes.module';
import { TrendsModule } from './trends/trends.module';

@Module({
  imports: [
    BaseModule,
    TrendsModule,
    LikesModule,
    StrikesModule,
    FeedsModule,
    NotificationsModule,
  ],
})
export class StatusesModule {}
