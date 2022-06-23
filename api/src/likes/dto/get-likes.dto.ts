import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { IsIn, IsNumberString, IsOptional } from 'class-validator';

import {
  KeysetPaginationDto,
  SortingDto,
} from '../../__shared__/dto/request.dto';

class LikesSortingDto extends SortingDto {
  @IsIn(['uid', 'sid', 'createdAt'], {
    message: 'Must be a one of valid fields',
  })
  'sort.field': 'uid' | 'sid' | 'createdAt';
}

export class GetLikesDto extends IntersectionType(
  KeysetPaginationDto,
  LikesSortingDto,
) {
  @ApiProperty({ example: new Date().toDateString(), required: false })
  @IsNumberString({ message: 'Must be a number' })
  createdAt?: number;

  @ApiProperty({ type: 'number', example: 1 })
  @IsOptional()
  @IsNumberString({ message: 'Must be a number' })
  uid?: number;

  @ApiProperty({ type: 'number', example: 1 })
  @IsOptional()
  @IsNumberString({ message: 'Must be a number' })
  sid?: number;
}
