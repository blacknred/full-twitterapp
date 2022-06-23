import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { IsIn, IsNumberString, IsOptional } from 'class-validator';

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

export class GetStatusesDto extends IntersectionType(
  KeysetPaginationDto,
  UsersSortingDto,
) {
  @ApiProperty({ example: new Date().toDateString(), required: false })
  createdAt?: string;

  @ApiProperty({ type: 'number', example: 1 })
  @IsOptional()
  @IsNumberString({ message: 'Must be a number' })
  uid?: number;

  @ApiProperty({ type: 'number', example: 1 })
  @IsOptional()
  @IsNumberString({ message: 'Must be a number' })
  sid?: number;
}
