import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsOptional } from 'class-validator';

import { PaginatedRequestDto } from '../../__shared__/dto/request.dto';

export class GetLikesDto extends PaginatedRequestDto {
  @ApiProperty({ type: 'number', example: 1 })
  @IsOptional()
  @IsNumberString({ message: 'Must be a number' })
  uid?: number;

  @ApiProperty({ type: 'number', example: 1 })
  @IsOptional()
  @IsNumberString({ message: 'Must be a number' })
  sid?: number;
}
