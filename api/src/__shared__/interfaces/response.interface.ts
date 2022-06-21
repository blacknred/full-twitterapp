export type ValidationErrorDto = {
  field: string;
  message: string;
};

export interface IResponse<T = unknown> {
  errors?: ValidationErrorDto[];
  data?: T;
  message?: string;
}
