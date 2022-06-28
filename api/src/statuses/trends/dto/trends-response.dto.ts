import { ApiProperty } from '@nestjs/swagger';

import { PaginatedResponseDto } from '../../../__shared__/dto/response.dto';
import { Trend } from '../types/trend.type';

export const trendMock: Trend = {
  tag: 'test',
  count: 100,
};

const trendPaginationMock = {
  hasMore: true,
  total: 100,
  items: [trendMock],
};

export class TrendsResponseDto extends PaginatedResponseDto<Trend> {
  @ApiProperty({ example: trendPaginationMock, required: false })
  data?: {
    hasMore: boolean;
    total: number;
    items: Trend[];
  };
}
