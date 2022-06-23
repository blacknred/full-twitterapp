import { IntersectionType } from '@nestjs/swagger';
import { IsIn } from 'class-validator';

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
) {}
