export type ValidationErrorDto = {
  field: string;
  message: string;
};

export type BaseResponse<T = unknown> = {
  errors?: ValidationErrorDto[];
  data?: T;
  message?: string;
};
