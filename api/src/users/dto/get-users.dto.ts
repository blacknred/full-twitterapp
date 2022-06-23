import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { IsBoolean, IsIn, IsNumberString, IsOptional } from 'class-validator';

import {
  KeysetPaginationDto,
  PaginatedRequestDto,
  SortingDto,
} from '../../__shared__/dto/request.dto';

class UsersSortingDto extends SortingDto {
  @IsIn(['username', 'name', 'email', 'createdAt'], {
    message: 'Must be a one of fields of the User entity',
  })
  'sort.field': 'username' | 'name' | 'email' | 'createdAt';
}

export class GetUsersDto extends PaginatedRequestDto {
  @ApiProperty({ type: 'boolean', example: true, required: false })
  @IsOptional()
  @IsBoolean({ message: 'Must be a boolean' })
  recommendations?: boolean;
}
