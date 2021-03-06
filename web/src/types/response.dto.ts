export type ValidationErrorDto = {
  field: string
  message: string
}

export type PaginatedDataDto<T> = {
  hasMore: boolean
  total?: number
  items: T[]
}

export type BaseResponseDto<T = unknown> = {
  message?: string
  errors?: ValidationErrorDto[]
  data?: T
}

export type EmptyResponseDto = BaseResponseDto<null>

export type PaginatedResponseDto<T> = BaseResponseDto<PaginatedDataDto<T>>
