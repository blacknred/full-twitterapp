import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  IsArray,
  IsDateString,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateStatusDto {
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
  links?: string[];

  @ApiProperty({ type: 'number', required: false })
  @IsOptional()
  @IsNumberString({ message: 'Must be a number' })
  sid?: number;

  @ApiProperty({ type: 'number', required: false })
  @IsOptional()
  @IsDateString(null, { message: 'Must be a date string' })
  createAt?: string;
}
