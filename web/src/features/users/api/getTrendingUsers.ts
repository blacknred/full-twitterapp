// import { useQuery } from '@/lib/swr'
// import type { KeysetPaginationDto, PaginatedDataDto } from '@/types'
// import type { MappedTweet, Tweet } from '../types'

// export type GetTweetsDto = KeysetPaginationDto<
//   Omit<Tweet, 'text' | 'tags' | 'media'>
// >

// export function useTweets(query?: string | GetTweetsDto) {
//   return useQuery<PaginatedDataDto<MappedTweet>>('users/trending', query)
// }
export function useTrendingUsers() {}
