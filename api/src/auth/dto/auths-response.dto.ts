import { ApiProperty } from '@nestjs/swagger';
import { PaginatedResponseDto } from 'src/__shared__/dto/response.dto';
import { IAuth } from '../interfaces/auth.interface';
import { authMock } from './auth-response.dto';

const authPaginationMock = {
  hasMore: true,
  total: 100,
  items: [authMock],
};

export class AuthsResponseDto extends PaginatedResponseDto<IAuth> {
  @ApiProperty({ example: authPaginationMock, nullable: true })
  data: {
    hasMore: boolean;
    total: number;
    items: IAuth[];
  };
}
