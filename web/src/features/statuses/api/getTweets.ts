import { useQuery } from '@/lib/swr'
import type { PaginatedDataDto } from '@/types/response.dto'
import type { KeysetPaginationDto } from '@/types/request.dto'
import type { MappedTweet, Tweet } from '../types/status.type'

export type GetTweetsDto = KeysetPaginationDto<
  Omit<Tweet, 'text' | 'tags' | 'media'>
>

export function useTweets(query?: string | GetTweetsDto) {
  return useQuery<PaginatedDataDto<MappedTweet>>('tweets', query)
}
