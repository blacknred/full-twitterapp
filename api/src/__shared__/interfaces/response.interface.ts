import { HttpStatus } from '@nestjs/common';

export type ValidationErrorDto = {
  field: string;
  message: string;
};

export interface IResponse<T = unknown> {
  status: HttpStatus;
  errors?: ValidationErrorDto[];
  data?: T;
  meta?: Record<string, unknown>;
  // message?: string;
}
