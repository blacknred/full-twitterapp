import { BaseEntity } from './base.entity'

export type SortingDto<T extends BaseEntity> = {
  'sort.field': keyof T
  'sort.order': 'ASC' | 'DESC'
}

export type KeysetPaginationDto<T extends BaseEntity> = Partial<
  Omit<T, keyof BaseEntity>
> &
  SortingDto<T> & {
    limit: number
    cursor: string
  }
