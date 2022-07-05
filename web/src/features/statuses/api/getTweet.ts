import { useQuery } from '@/lib/swr'
import type { BaseEntity } from '@/types/base.entity'
import type { MappedTweet } from '../types/status.type'

export function useTweet(id: BaseEntity['id']) {
  return useQuery<MappedTweet>(`/tweets/${id}`)
}
