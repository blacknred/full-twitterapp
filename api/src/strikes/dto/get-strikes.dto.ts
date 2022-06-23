import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { IsIn, IsNumberString, IsOptional } from 'class-validator';

import {
  KeysetPaginationDto,
  SortingDto,
} from '../../__shared__/dto/request.dto';

class StrikesSortingDto extends SortingDto {
  @IsIn(['uid', 'createdAt'], {
    message: 'Must be a one of valid fields',
  })
  'sort.field': 'uid' | 'createdAt';
}

export class GetStrikesDto extends IntersectionType(
  KeysetPaginationDto,
  StrikesSortingDto,
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
