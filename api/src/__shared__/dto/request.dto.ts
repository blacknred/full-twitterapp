import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class SortingDto {
  @ApiProperty({ type: 'string', required: false, example: 'createdAt' })
  @Type(() => String)
  @IsString({ message: 'Must be a string' })
  'sort.field': string;

  @ApiProperty({
    type: 'string',
    example: 'DESC',
    enum: ['ASC', 'DESC'],
  })
  @Type(() => String)
  @IsIn(['ASC', 'DESC'], { message: 'Must be an ASC or DESC' })
  'sort.order': 'ASC' | 'DESC';
}

export class KeysetPaginationDto {
  @ApiProperty({ type: 'number', example: 10 })
  @Type(() => Number)
  @Min(1)
  limit: number;

  @ApiProperty({ type: 'number', example: 22342423442 })
  @Type(() => Number)
  @IsNumber(null, { message: 'Must be a number' })
  cursor: number;
}
