import { Controller, UseFilters } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AllExceptionFilter } from 'src/__shared__/filters/all-exception.filter';
import { FirehoseService } from './firehose.service';

@ApiTags('Firehose')
@Controller('firehose')
@UseFilters(AllExceptionFilter)
export class FirehoseController {
  constructor(private readonly firehoseService: FirehoseService) {}
}
