import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { UsersModule } from 'src/users/users/users.module';
import { AUTH_TIMEOUT } from 'src/__shared__/consts';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import passportProviders from './providers/passport.providers';

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secretOrPrivateKey: configService.get('SECRET'),
        signOptions: {
          expiresIn: AUTH_TIMEOUT,
        },
      }),
    }),
  ],
  providers: [AuthService, ...passportProviders],
  controllers: [AuthController],
})
export class AuthModule {}
