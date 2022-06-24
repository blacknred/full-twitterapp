import { Module } from '@nestjs/common';

import { BansModule } from './bans/bans.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { UsersModule as BaseModule } from './users/users.module';

@Module({
  imports: [BaseModule, BansModule, SubscriptionsModule],
})
export class UsersModule {}
