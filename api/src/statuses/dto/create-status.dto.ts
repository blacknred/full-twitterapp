import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

export class StatusDto {
  @ApiProperty({ type: 'string', required: false })
  @IsOptional()
  @IsString({ message: 'Must be a string' })
  @MaxLength(140, { message: 'Must include no more than 140 chars' })
  text?: string;

  @ApiProperty({
    type: 'string',
    example: 'urltomediafile',
    isArray: true,
    required: false,
  })
  @IsOptional()
  @IsArray({ message: 'Must be an array' })
  @ArrayMaxSize(4)
  @IsString({ message: 'Must includes a strings', each: true })
  media?: string[];

  @ApiProperty({ type: 'number', required: false })
  @IsOptional()
  @IsNumberString({ message: 'Must be a number' })
  sid?: number;
}

export class CreateStatusDto {
  @ApiProperty({
    type: StatusDto,
    isArray: true,
  })
  @IsArray({ message: 'Must be an array' })
  @ValidateNested({ each: true })
  @Type(() => StatusDto)
  statuses: StatusDto[];
}
