import { ApiProperty } from '@nestjs/swagger';
import { PaginatedResponseDto } from 'src/__shared__/dto/response.dto';
import { IUser } from '../types/subscription.type';
import { userMock } from './subscription-response.dto';

const userPaginationMock = {
  hasMore: true,
  total: 100,
  items: [userMock],
};

export class UsersResponseDto extends PaginatedResponseDto<IUser> {
  @ApiProperty({ example: userPaginationMock, required: false })
  data?: {
    hasMore: boolean;
    total: number;
    items: IUser[];
  };
}
