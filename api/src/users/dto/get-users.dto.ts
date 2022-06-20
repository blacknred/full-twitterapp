import {
  ApiProperty,
  IntersectionType,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { PaginationDto } from 'src/__shared__/dto/request.dto';
import { CreateUserDto } from './create-user.dto';

export class GetUsersDto extends IntersectionType(
  PartialType(PickType(CreateUserDto, ['name'] as const)),
  PaginationDto,
) {
  @ApiProperty({ example: 'test@email.com', required: false })
  email?: string;

  @ApiProperty({ example: new Date().toDateString(), required: false })
  createdAt?: string;
}
