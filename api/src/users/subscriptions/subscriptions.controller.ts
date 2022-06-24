import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UseFilters,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Auth } from 'src/__shared__/decorators/auth.decorator';
import {
  WithCreatedApi,
  WithOkApi,
} from 'src/__shared__/decorators/with-api.decorator';
import { WithAuth } from 'src/__shared__/decorators/with-auth.decorator';
import { EmptyResponseDto } from 'src/__shared__/dto/response.dto';
import { AllExceptionFilter } from 'src/__shared__/filters/all-exception.filter';
import { BanResponseDto } from './dto/ban-response.dto';
import { BansResponseDto } from './dto/bans-response.dto';
import { CreateBanDto } from './dto/create-ban.dto';
import { DeleteBanDto } from './dto/delete-ban.dto';
import { GetBansDto } from './dto/get-bans.dto';
import { SubscriptionsService } from './subscriptions.service';

@ApiTags('Subscriptions')
@Controller('subscriptions')
@UseFilters(AllExceptionFilter)
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post()
  @WithCreatedApi(BanResponseDto, 'Create new ban')
  async create(@Body() createBanDto: CreateBanDto): Promise<BanResponseDto> {
    return this.subscriptionsService.create(createBanDto);
  }

  @Get()
  @WithAuth()
  @WithOkApi(BansResponseDto, 'List all bans of authorized user')
  async getAll(
    @Auth('user') { id: uid },
    @Query() getBansDto: GetBansDto,
  ): Promise<BansResponseDto> {
    return this.subscriptionsService.findAll({ uid, ...getBansDto });
  }

  @Delete()
  @WithAuth()
  @WithOkApi(EmptyResponseDto, 'Delete ban')
  async remove(
    @Auth('user') { id },
    @Body() deleteBanDto: DeleteBanDto,
  ): Promise<EmptyResponseDto> {
    return this.subscriptionsService.remove(id, deleteBanDto);
  }
}
