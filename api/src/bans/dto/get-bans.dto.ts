import { IntersectionType } from '@nestjs/swagger';
import { IsIn } from 'class-validator';

import {
  KeysetPaginationDto,
  SortingDto,
} from '../../__shared__/dto/request.dto';

class BansSortingDto extends SortingDto {
  @IsIn(['uid', 'createdAt'], {
    message: 'Must be a one of valid fields',
  })
  'sort.field': 'uid' | 'createdAt';
}

export class GetBansDto extends IntersectionType(
  KeysetPaginationDto,
  BansSortingDto,
) {}
