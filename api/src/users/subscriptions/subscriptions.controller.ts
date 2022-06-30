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
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { DeleteSubscriptionDto } from './dto/delete-subscription.dto';
import { GetSubscriptionsDto } from './dto/get-subscriptions.dto';
import { SubscriptionResponseDto } from './dto/subscription-response.dto';
import { SubscriptionsResponseDto } from './dto/subscriptions-response.dto';
import { SubscriptionsService } from './subscriptions.service';

@ApiTags('Subscriptions')
@Controller('subscriptions')
@UseFilters(AllExceptionFilter)
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post()
  @WithCreatedApi(SubscriptionResponseDto, 'Create new subscription')
  async create(
    @Body() createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<SubscriptionResponseDto> {
    return this.subscriptionsService.create(createSubscriptionDto);
  }

  @Get()
  @WithAuth()
  @WithOkApi(SubscriptionsResponseDto, 'List all blocks of authorized user')
  async getAll(
    @Auth('user') { uid },
    @Query() getSubscriptionsDto: GetSubscriptionsDto,
  ): Promise<SubscriptionsResponseDto> {
    return this.subscriptionsService.findAll(uid, getSubscriptionsDto);
  }

  @Delete()
  @WithAuth()
  @WithOkApi(EmptyResponseDto, 'Delete block')
  async remove(
    @Auth('user') { uid },
    @Body() deleteSubscriptionDto: DeleteSubscriptionDto,
  ): Promise<EmptyResponseDto> {
    return this.subscriptionsService.remove(uid, deleteSubscriptionDto);
  }
}
