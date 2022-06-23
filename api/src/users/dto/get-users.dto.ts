import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { IsBoolean, IsIn, IsNumberString, IsOptional } from 'class-validator';

import {
  KeysetPaginationDto,
  SortingDto,
} from '../../__shared__/dto/request.dto';

class UsersSortingDto extends SortingDto {
  @IsIn(['username', 'name', 'email', 'createdAt'], {
    message: 'Must be a one of fields of the User entity',
  })
  'sort.field': 'username' | 'name' | 'email' | 'createdAt';
}

export class GetUsersDto extends IntersectionType(
  KeysetPaginationDto,
  UsersSortingDto,
) {
  @ApiProperty({ type: 'number', example: Date.now(), required: false })
  @IsOptional()
  @IsNumberString({ message: 'Must be a number' })
  createdAt?: number;

  @ApiProperty({ type: 'boolean', example: true, required: false })
  @IsOptional()
  @IsBoolean({ message: 'Must be a boolean' })
  recommendations?: boolean;
}
