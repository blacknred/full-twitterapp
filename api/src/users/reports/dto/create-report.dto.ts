import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class CreateReportDto {
  @ApiProperty({ type: 'number', example: 1 })
  @IsNumberString({ message: 'Must be a number' })
  uid: number;

  @ApiProperty({ type: 'number', example: 1 })
  @IsOptional()
  @IsNumberString({ message: 'Must be a number' })
  sid?: number;

  @ApiProperty({ type: 'string', example: 'strong reason' })
  @IsString({ message: 'Must be a string' })
  reason: string;
}
