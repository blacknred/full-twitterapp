import { Body, Controller, Post, UseFilters } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { WithCreatedApi } from 'src/__shared__/decorators/with-api.decorator';
import { AllExceptionFilter } from 'src/__shared__/filters/all-exception.filter';
import { CreateReportDto } from './dto/create-report.dto';
import { ReportResponseDto } from './dto/report-response.dto';
import { ReportsService } from './reports.service';

@ApiTags('Reports')
@Controller('reports')
@UseFilters(AllExceptionFilter)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @WithCreatedApi(ReportResponseDto, 'Create new report')
  async create(
    @Body() createReportDto: CreateReportDto,
  ): Promise<ReportResponseDto> {
    return this.reportsService.create(createReportDto);
  }
}
