import { MikroOrmModuleAsyncOptions } from '@mikro-orm/nestjs';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const databaseProvider: MikroOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    autoLoadEntities: true,
    flushMode: 'COMMIT',
    clientUrl: configService.get('DB_URL'),
    debug: configService.get('NODE_ENV') === 'development',
    type: 'postgresql',
  }),
};
