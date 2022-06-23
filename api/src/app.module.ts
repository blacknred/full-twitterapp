import * as Joi from '@hapi/joi';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from 'nestjs-redis';
import { AmqpModule } from 'nestjs-amqp';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { AuthModule } from './auth/auth.module';
import { LikesModule } from './likes/likes.module';
import { MonitoringModule } from './monitoring/monitoring.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { StatusModule } from './statuses/statuses.module';
import { UsersModule } from './users/users.module';
import { redisProvider } from './__shared__/providers/redis.provider';
import { queueProvider } from './__shared__/providers/queue.provider';
import { BansModule } from './bans/bans.module';
import { StrikesModule } from './strikes/strikes.module';
import { TrendsService } from './trends/trends.service';
import { TrendsModule } from './trends/trends.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().required(),
        CLIENT_ORIGIN: Joi.string().required(),
        REDIS_URL: Joi.string().required(),
        QUEUE_URL: Joi.string().required(),
        SMTP_URL: Joi.string().required(),
        SECRET: Joi.string().required(),
      }),
    }),
    RedisModule.forRootAsync(redisProvider),
    AmqpModule.forRootAsync(queueProvider),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'documentation'),
      serveRoot: '/docs',
    }),
    MonitoringModule,
    AuthModule,
    UsersModule,
    BansModule,
    LikesModule,
    StrikesModule,
    TrendsModule,
    //
    SubscriptionsModule,
    TweetsModule,
  ],
  providers: [Logger],
})
export class AppModule {}
