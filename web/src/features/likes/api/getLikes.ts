import { useQuery } from '@/lib/swr'
import type { KeysetPaginationDto } from '@/types/request.dto'
import type { PaginatedDataDto } from '@/types/response.dto'
import type { Like, MappedLike } from '../types/like.type'

export type GetLikesDto = KeysetPaginationDto<Like>

export function useLikes(query?: string | GetLikesDto) {
  return useQuery<PaginatedDataDto<MappedLike>>('likes', query)
}
