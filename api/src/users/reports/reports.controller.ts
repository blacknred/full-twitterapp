import { Body, Controller, Get, Post, Query, UseFilters } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Auth } from 'src/__shared__/decorators/auth.decorator';
import {
  WithCreatedApi,
  WithOkApi,
} from 'src/__shared__/decorators/with-api.decorator';
import { WithAuth } from 'src/__shared__/decorators/with-auth.decorator';
import { AllExceptionFilter } from 'src/__shared__/filters/all-exception.filter';
import { CreateStrikeDto } from './dto/create-report.dto';
import { GetStrikesDto } from './dto/get-strikes.dto';
import { StrikeResponseDto } from './dto/report-response.dto';
import { StrikesResponseDto } from './dto/strikes-response.dto';
import { ReportsService } from './reports.service';

@ApiTags('Reports')
@Controller('reports')
@UseFilters(AllExceptionFilter)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @WithCreatedApi(StrikeResponseDto, 'Create new strike')
  async create(
    @Body() createStrikeDto: CreateStrikeDto,
  ): Promise<StrikeResponseDto> {
    return this.reportsService.create(createStrikeDto);
  }

  @Get()
  @WithAuth()
  @WithOkApi(StrikesResponseDto, 'List all strikes')
  async getAll(
    @Auth('user') { id, isAdmin },
    @Query() getStrikesDto: GetStrikesDto,
  ): Promise<StrikesResponseDto> {
    if (!isAdmin) getStrikesDto.uid = id;
    return this.reportsService.findAll(getStrikesDto);
  }
}
