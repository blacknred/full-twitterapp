import { MikroOrmModuleAsyncOptions } from '@mikro-orm/nestjs';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const databaseProvider: MikroOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    clientUrl: configService.get('MONGODB_URL'),
    debug: configService.get('NODE_ENV') === 'development',
    autoLoadEntities: true,
    flushMode: 1,
    ensureIndexes: true,
    type: 'mongo',
  }),
};
