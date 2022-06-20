import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class ValidationErrorDto {
  @ApiProperty({ type: 'string', example: 'email' })
  field: string;

  @ApiProperty({ type: 'string', example: 'Must be an valid email' })
  message: string;
}

export class PaginatedDataDto<T> {
  @ApiProperty({ type: 'boolean', example: true })
  hasMore: boolean;

  @ApiProperty({ type: 'number', example: 100, required: false })
  total?: number;

  @ApiProperty({ isArray: true, example: null })
  items: T[];
}

export class BaseResponseDto<T = unknown> {
  @ApiProperty({ type: HttpStatus, example: 200 })
  status: HttpStatus;

  @ApiProperty({
    type: ValidationErrorDto,
    isArray: true,
    required: false,
  })
  errors?: ValidationErrorDto[];

  @ApiProperty({ example: null, required: false })
  data?: T;
}

export class EmptyResponseDto extends BaseResponseDto<null> {
  data: null;
}

// export class PaginatedResponseDto<T> extends BaseResponseDto<Paginated<T>> {}
