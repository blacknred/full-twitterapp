import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsNumber, Min } from 'class-validator';

export class SortingDto {
  @ApiProperty({
    type: 'string',
    example: 'DESC',
    enum: ['ASC', 'DESC'],
  })
  @Type(() => String)
  @IsIn(['ASC', 'DESC'], { message: 'Must be an ASC or DESC' })
  order: 'ASC' | 'DESC';
}

export class KeysetPaginationDto {
  @ApiProperty({ type: 'number', example: 10 })
  @Type(() => Number)
  @Min(1)
  limit: number;

  @ApiProperty({ type: 'number', example: 22342423442 })
  @Type(() => Number)
  @IsNumber(null, { message: 'Must be a number' })
  createdAt: number;
}

export class PaginatedRequestDto extends IntersectionType(
  KeysetPaginationDto,
  SortingDto,
) {}
