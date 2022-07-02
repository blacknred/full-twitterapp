import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { UsersModule } from 'src/users/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import passportProviders from './providers/passport.providers';

@Module({
  imports: [ConfigModule, UsersModule, PassportModule, JwtModule.register({})],
  providers: [AuthService, ...passportProviders],
  controllers: [AuthController],
})
export class AuthModule {}
