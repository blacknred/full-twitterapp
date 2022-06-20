import * as Joi from '@hapi/joi';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { databaseProvider } from './__shared__/providers/database.provider';
import { redisProvider } from './__shared__/providers/redis.provider';

import { MonitoringModule } from './monitoring/monitoring.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { LikesModule } from './likes/likes.module';
import { TweetsModule } from './tweets/tweets.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().required(),
        CLIENT_ORIGIN: Joi.string().required(),
        REDIS_URL: Joi.string().required(),
        SECRET: Joi.string().required(),
        DB_URL: Joi.string().required(),
        SMTP_URL: Joi.string().required(),
        // QUEUE_URL: Joi.string().required()
      }),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'documentation'),
      serveRoot: '/docs',
    }),
    MikroOrmModule.forRootAsync(databaseProvider),
    //
    MonitoringModule,
    //
    AuthModule,
    //
    UsersModule,
    SubscriptionsModule,
    //
    LikesModule,
    TweetsModule,
  ],
  providers: [Logger, redisProvider],
})
export class AppModule {}
