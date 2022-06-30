import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
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
import { CreateStatusDto } from './dto/create-status.dto';
import { CreateStatusesDto } from './dto/create-statuses.dto';
import { DeleteStatusDto } from './dto/delete-status.dto';
import { GetStatusDto } from './dto/get-status.dto';
import { GetStatusesDto } from './dto/get-statuses.dto';
import { StatusResponseDto } from './dto/status-response.dto';
import { StatusesResponseDto } from './dto/statuses-response.dto';
import { StatusesService } from './statuses.service';

@ApiTags('Statuses')
@Controller('statuses')
@UseFilters(AllExceptionFilter)
export class StatusesController {
  constructor(private readonly statusesService: StatusesService) {}

  @Post()
  @WithCreatedApi(StatusResponseDto, 'Create new status')
  async create(
    @Body() createStatusDto: CreateStatusDto,
  ): Promise<StatusResponseDto> {
    return this.statusesService.create(createStatusDto);
  }

  @Post('bulk')
  @WithCreatedApi(StatusResponseDto, 'Create new statuses')
  async createBulk(
    @Body() createStatusDto: CreateStatusesDto,
  ): Promise<[StatusResponseDto]> {
    return this.statusesService.create(createStatusDto);
  }

  @Get()
  @WithAuth()
  @WithOkApi(StatusesResponseDto, 'List all statuses')
  async getAll(
    @Auth('user') { isAdmin },
    @Query() getStatusesDto: GetStatusesDto,
  ): Promise<StatusesResponseDto> {
    // if (!isAdmin) getStatusesDto.trended = true;
    return this.statusesService.findAll(getStatusesDto);
  }

  @Get(':id')
  @WithAuth()
  @WithOkApi(StatusResponseDto, 'Get status by id')
  async getOne(@Param() { id }: GetStatusDto): Promise<StatusResponseDto> {
    return this.statusesService.findOne(id);
  }

  @Delete()
  @WithAuth()
  @WithOkApi(EmptyResponseDto, 'Delete status')
  async remove(
    @Auth('user') { id: uid },
    @Param() { id }: DeleteStatusDto,
  ): Promise<EmptyResponseDto> {
    return this.statusesService.remove(uid, id);
  }
}
