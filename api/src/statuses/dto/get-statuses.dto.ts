import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

import { PaginatedRequestDto } from '../../__shared__/dto/request.dto';

export class GetStatusesDto extends PaginatedRequestDto {
  @ApiProperty({ type: 'number', example: 1 })
  @IsOptional()
  @IsNumberString({ message: 'Must be a number' })
  uid?: number;

  @ApiProperty({ type: 'number', example: 1 })
  @IsOptional()
  @IsNumberString({ message: 'Must be a number' })
  sid?: number;

  @ApiProperty({ type: 'string', example: 'test' })
  @IsOptional()
  @IsString({ message: 'Must be a string' })
  hash?: string;

  @ApiProperty({ type: 'boolean', example: true })
  @IsOptional()
  @IsBoolean({ message: 'Must be a boolean' })
  trended?: boolean;

  // likesCnt,repostsCnt,retweetsCnt
}
