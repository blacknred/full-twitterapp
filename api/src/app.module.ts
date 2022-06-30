import * as Joi from '@hapi/joi';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AmqpModule } from 'nestjs-amqp';
import { RedisModule } from 'nestjs-redis';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { join } from 'path';

import { AuthModule } from './auth/auth.module';
import { MonitoringModule } from './monitoring/monitoring.module';
import { StatusesModule } from './statuses/statuses.module';
import { FirehoseModule } from './firehose/firehose.module';
import { UsersModule } from './users/users.module';
import { queueProvider } from './__shared__/providers/queue.provider';
import { redisProvider } from './__shared__/providers/redis.provider';
import { databaseProvider } from './__shared__/providers/database.provider';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().required(),
        SECRET: Joi.string().required(),
        CLIENT_ORIGIN: Joi.string().required(),
        POSTGRES_URL: Joi.string().required(),
        REDIS_URL: Joi.string().required(),
        RABBITMQ_URL: Joi.string().required(),
        SMTP_URL: Joi.string().required(),
      }),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'documentation'),
      serveRoot: '/docs',
    }),
    MikroOrmModule.forRootAsync(databaseProvider),
    RedisModule.forRootAsync(redisProvider),
    AmqpModule.forRootAsync(queueProvider),
    UsersModule,
    StatusesModule,
    FirehoseModule,
    AuthModule,
    MonitoringModule,
  ],
  providers: [Logger],
})
export class AppModule {}
