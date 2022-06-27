import * as Joi from '@hapi/joi';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AmqpModule } from 'nestjs-amqp';
import { RedisModule } from 'nestjs-redis';
import { join } from 'path';
import { AdminModule } from './admin/admin.module';

import { AuthModule } from './auth/auth.module';
import { MonitoringModule } from './monitoring/monitoring.module';
import { StatusesModule } from './statuses/statuses.module';
import { UsersModule } from './users/users.module';
import { queueProvider } from './__shared__/providers/queue.provider';
import { redisProvider } from './__shared__/providers/redis.provider';

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
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'documentation'),
      serveRoot: '/docs',
    }),
    RedisModule.forRootAsync(redisProvider),
    AmqpModule.forRootAsync(queueProvider),
    UsersModule,
    StatusesModule,
    AdminModule,
    AuthModule,
    MonitoringModule,
  ],
  providers: [Logger],
})
export class AppModule {}
