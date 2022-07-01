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
  @ArrayMaxSize(4, { message: 'Must includes 4 assets at max' })
  @IsString({ message: 'Must includes an url strings', each: true })
  assets?: string[];

  @ApiProperty({ type: 'number', required: false })
  @IsOptional()
  @IsNumberString({ message: 'Must be a number' })
  sid?: number;

  @ApiProperty({ type: 'number', required: false })
  @IsOptional()
  @IsDateString(null, { message: 'Must be a date string' })
  createAt?: string;
}
