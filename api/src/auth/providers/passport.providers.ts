import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PassportSerializer, PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { IResponse } from 'src/__shared__/interfaces/response.interface';
import { USER_SERVICE } from '../consts';
import { IAuth } from '../interfaces/auth.interface';
import { IUser } from '../interfaces/user.interface';

// LocalAuthGuard.logIn(req) => LocalStrategy.validate() => SessionSerialiser.serializeUser()

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(USER_SERVICE) protected readonly userService: ClientProxy,
  ) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string) {
    const params = { password, email };
    const { status, ...rest } = await this.userService
      .send<IResponse<IUser>>('users/getOne', params)
      .toPromise();

    if (status !== HttpStatus.OK) {
      throw new HttpException(rest, status);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { createdAt, updatedAt, ...user } = rest.data;
    return user;
  }
}


import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}


// @Injectable()
// export class SessionSerializer extends PassportSerializer {
//   serializeUser(
//     user: Partial<IUser>,
//     done: (err: Error, payload: IAuth) => void,
//   ) {
//     done(null, { user, pushSubscriptions: [] });
//   }

//   deserializeUser(payload: IAuth, done: (err: Error, user: IAuth) => void) {
//     done(null, payload);
//   }
// }



import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('SECRET'),
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
  }
}

export default [LocalStrategy];
