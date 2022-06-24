import { ApiProperty } from '@nestjs/swagger';

import { PaginatedResponseDto } from '../../../__shared__/dto/response.dto';
import { Ban } from '../types/ban.type';
import { banMock } from './ban-response.dto';

const banPaginationMock = {
  hasMore: true,
  total: 100,
  items: [banMock],
};

export class BansResponseDto extends PaginatedResponseDto<Ban> {
  @ApiProperty({ example: banPaginationMock, required: false })
  data?: {
    hasMore: boolean;
    total: number;
    items: Ban[];
  };
}
