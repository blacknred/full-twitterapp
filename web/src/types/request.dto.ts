export type SortingDto = {
  order: 'ASC' | 'DESC'
}

export type KeysetPaginationDto = {
  limit: number
  createdAt: number
}

export type PaginatedRequestDto = SortingDto & KeysetPaginationDto

// pagination: createdAt=20045455, limit=20
// sort: order=ASC|DESC
// filters: uid?, sid?
