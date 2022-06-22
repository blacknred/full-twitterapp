import { ConfigModule, ConfigService } from '@nestjs/config';
import { EMAIL_FROM } from '../consts';

export const smtpProvider = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    debug: configService.get('NODE_ENV') === 'development',
    transport: configService.get('SMTP_URL'),
    defaults: { from: EMAIL_FROM },
    logger: true,
  }),
};
