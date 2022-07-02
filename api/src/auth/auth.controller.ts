import {
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { UserResponseDto } from 'src/users/users/dto/user-response.dto';
import { UsersService } from 'src/users/users/users.service';

import {
  WithCreatedApi,
  WithOkApi,
} from 'src/__shared__/decorators/with-api.decorator';
import { Auth } from '../__shared__/decorators/auth.decorator';
import { WithAuth } from '../__shared__/decorators/with-auth.decorator';
import { EmptyResponseDto } from '../__shared__/dto/response.dto';
import { AuthService } from './auth.service';
import { AuthResponseDto } from './dto/auth-response.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import RefreshTokenGuard from './guards/refreshTokenGuard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  @UseGuards(LocalAuthGuard)
  @WithCreatedApi(AuthResponseDto, 'Login')
  create(@Auth() data, @Res() res: Response): AuthResponseDto {
    const refresh = this.authService.createRefreshCookie(data.id);
    const access = this.authService.createAccessCookie(data.id);
    res.setHeader('Set-Cookie', [refresh, access]);

    return { data };
  }

  @Get()
  @WithAuth()
  @WithOkApi(UserResponseDto, 'Get user data')
  async getOne(@Auth() { id }): Promise<UserResponseDto> {
    return this.usersService.findOne(id);
  }

  @Patch()
  @UseGuards(RefreshTokenGuard)
  @WithOkApi(AuthResponseDto, 'Refresh access token')
  refresh(@Auth() data, @Res() res: Response) {
    const access = this.authService.createAccessCookie(data.id);
    res.setHeader('Set-Cookie', access);

    return { data };
  }

  @Delete()
  @WithAuth()
  @WithOkApi(EmptyResponseDto, 'Logout')
  delete(@Req() req): EmptyResponseDto {
    const cookie = this.authService.remove();
    req.setHeader('Set-Cookie', cookie);

    return { data: null };
  }
}
