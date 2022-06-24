import { ApiProperty } from '@nestjs/swagger';

import { PaginatedResponseDto } from '../../../__shared__/dto/response.dto';
import { Strike } from '../types/strike.type';
import { strikeMock } from './strike-response.dto';

const strikePaginationMock = {
  hasMore: true,
  total: 100,
  items: [strikeMock],
};

export class StrikesResponseDto extends PaginatedResponseDto<Strike> {
  @ApiProperty({ example: strikePaginationMock, required: false })
  data?: {
    hasMore: boolean;
    total: number;
    items: Strike[];
  };
}
