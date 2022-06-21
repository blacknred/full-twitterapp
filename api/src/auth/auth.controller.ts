import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  Req,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  WithCreatedApi,
  WithOkApi,
} from 'src/__shared__/decorators/with-api.decorator';
import { WithAuth } from '../__shared__/decorators/with-auth.decorator';
import { Auth } from '../__shared__/decorators/auth.decorator';
import { EmptyResponseDto } from '../__shared__/dto/response.dto';
import { AuthService } from './auth.service';
import { AuthResponseDto } from './dto/auth-response.dto';
import { AuthsResponseDto } from './dto/auths-response.dto';
import { GetAuthsDto } from './dto/get-auths.dto';
import { PushSubscriptionResponseDto } from './dto/push-subscription-response.dto';
import { PushSubscriptionDto } from './dto/push-subscription.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ValidationPipe } from './pipes/validation.pipe';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @UseGuards(LocalAuthGuard)
  @WithCreatedApi(AuthResponseDto, 'Login')
  create(@Auth() auth): AuthResponseDto {
    return this.authService.create(auth);
  }

  // @Get()
  // @WithAuth()
  // @WithOkApi(AuthsResponseDto, 'Get all sessions')
  // async getAll(@Query() getUsersDto: GetAuthsDto): Promise<AuthsResponseDto> {
  //   return this.authService.findAll(getUsersDto);
  // }

  @Get('me')
  @WithAuth()
  @WithOkApi(AuthResponseDto, 'Get session')
  getOne(@Auth('user') data): AuthResponseDto {
    return { data };
  }

  @Delete()
  @WithAuth()
  @WithOkApi(EmptyResponseDto, 'Logout')
  delete(@Req() req): EmptyResponseDto {
    req.logout(); // req.session.destroy();
    return { data: null };
  }
}
