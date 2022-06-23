import { ApiProperty } from '@nestjs/swagger';

import { PaginatedResponseDto } from 'src/__shared__/dto/response.dto';
import { Status } from '../types/status.type';
import { statusMock } from './status-response.dto';

const statusPaginationMock = {
  hasMore: true,
  total: 100,
  items: [statusMock],
};

export class StatusesResponseDto extends PaginatedResponseDto<Status> {
  @ApiProperty({ example: statusPaginationMock, required: false })
  data?: {
    hasMore: boolean;
    total: number;
    items: Status[];
  };
}
