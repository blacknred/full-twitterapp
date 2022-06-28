import { ApiProperty } from '@nestjs/swagger';

import { userPaginationMock } from 'src/users/users/dto/users-response.dto';
import type { User } from 'src/users/users/types/user.type';
import { PaginatedResponseDto } from '../../../__shared__/dto/response.dto';

export class SubscriptionsResponseDto extends PaginatedResponseDto<User> {
  @ApiProperty({ example: userPaginationMock, required: false })
  data?: {
    hasMore: boolean;
    total: number;
    items: User[];
  };
}
