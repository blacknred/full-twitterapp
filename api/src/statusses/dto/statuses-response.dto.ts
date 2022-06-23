import { ApiProperty } from '@nestjs/swagger';
import { PaginatedResponseDto } from 'src/__shared__/dto/response.dto';
import { IUser, Status } from '../types/status.type';
import { userMock } from './status-response.dto';

const userPaginationMock = {
  hasMore: true,
  total: 100,
  items: [userMock],
};

export class StatusesResponseDto extends PaginatedResponseDto<Status> {
  @ApiProperty({ example: userPaginationMock, required: false })
  data?: {
    hasMore: boolean;
    total: number;
    items: Status[];
  };
}
