import { useMutation } from '@/lib/swr'
import type { BaseEntity } from '@/types/base.entity'
import type { Tweet } from '../types/status.type'

export type CreateTweetDto = Omit<Tweet, keyof BaseEntity | 'authorId'>

export function useCreateTweet() {
  return useMutation<Tweet, CreateTweetDto>('tweets', { method: 'POST' })
}
