import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { IsIn } from 'class-validator';
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
}
