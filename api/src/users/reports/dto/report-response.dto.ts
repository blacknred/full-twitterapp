import { ApiProperty } from '@nestjs/swagger';

import { statusMock } from 'src/statuses/statuses/dto/status-response.dto';
import { userMock } from 'src/users/users/dto/user-response.dto';
import { BaseResponseDto } from '../../../__shared__/dto/response.dto';
import type { Report } from '../types/report.type';

export const reporteMock: Report = {
  user: userMock,
  status: statusMock,
  createdAt: Date.now(),
  reason: 'strong reason',
};

export class ReportResponseDto extends BaseResponseDto<Report> {
  @ApiProperty({ example: reporteMock, required: false })
  data?: Report;
}
