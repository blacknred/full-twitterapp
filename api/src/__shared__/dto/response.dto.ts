import { ApiProperty } from '@nestjs/swagger';
import { IResponse } from '../interfaces/response.interface';

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

export class BaseResponseDto<T = unknown> implements IResponse {
  @ApiProperty({
    type: ValidationErrorDto,
    isArray: true,
    required: false,
  })
  errors?: ValidationErrorDto[];

  @ApiProperty({ required: false })
  data?: T;

  @ApiProperty({ type: 'string', required: false })
  message?: string;
}

export class EmptyResponseDto extends BaseResponseDto<null> {
  data: null;
}

export class PaginatedResponseDto<T> extends BaseResponseDto<
  PaginatedDataDto<T>
> {}
