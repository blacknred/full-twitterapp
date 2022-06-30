import { Module } from '@nestjs/common';

import { BlocksModule } from './blocks/blocks.module';
import { ReportsModule } from './reports/reports.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { UsersModule as BaseModule } from './users/users.module';

@Module({
  imports: [BaseModule, SubscriptionsModule, ReportsModule, BlocksModule],
})
export class UsersModule {}
