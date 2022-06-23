import { ApiProperty } from '@nestjs/swagger';

import { PaginatedResponseDto } from '../../__shared__/dto/response.dto';
import { Like } from '../types/like.type';
import { likeMock } from './like-response.dto';

const likePaginationMock = {
  hasMore: true,
  total: 100,
  items: [likeMock],
};

export class LikesResponseDto extends PaginatedResponseDto<Like> {
  @ApiProperty({ example: likePaginationMock, required: false })
  data?: {
    hasMore: boolean;
    total: number;
    items: Like[];
  };
}
