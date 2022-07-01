export type ValidationErrorDto = {
  field: string;
  message: string;
};

export type BaseResponse<T = unknown> = {
  message?: string;
  errors?: ValidationErrorDto[];
  data?: T;
};
