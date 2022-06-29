import { ApiProperty } from '@nestjs/swagger';

import { BaseResponseDto } from '../../../__shared__/dto/response.dto';
import type { Report } from '../types/report.type';

export const reporteMock: Report = {
  uid: 1,
  sid: 4,
  createdAt: new Date(),
  reason: 'strong reason',
};

export class ReportResponseDto extends BaseResponseDto<Report> {
  @ApiProperty({ example: reporteMock, required: false })
  data?: Report;
}
