export type BaseResponseDto<T = unknown> = {
  message?: string
  errors?: ValidationErrorDto[]
  data?: T
}

export type PaginatedDataDto<T> = {
  hasMore: boolean
  total?: number
  items: T[]
}

export type ValidationErrorDto = {
  field: string
  message: string
}
