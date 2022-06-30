import { Controller, Get, Query, UseFilters } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { WithOkApi } from 'src/__shared__/decorators/with-api.decorator';
import { AllExceptionFilter } from 'src/__shared__/filters/all-exception.filter';
import { GetTrendsDto } from './dto/get-trends.dto';
import { TrendsResponseDto } from './dto/trends-response.dto';
import { TrendsService } from './trends.service';

@ApiTags('Trends')
@Controller('trends')
@UseFilters(AllExceptionFilter)
export class TrendsController {
  constructor(private readonly trendsService: TrendsService) {}

  @Get()
  @WithOkApi(TrendsResponseDto, 'List all trends')
  async getAll(
    @Query() getTrendsDto: GetTrendsDto,
  ): Promise<TrendsResponseDto> {
    return this.trendsService.findAll(getTrendsDto);
  }
}
