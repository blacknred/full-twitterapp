import { useMutation } from '@/lib/swr'
import type { Like } from '../types/like.type'

export type CreateLikeDTO = Pick<Like, 'tweetId'>

export function useCreateLike() {
  return useMutation<Like, CreateLikeDTO>(
    'likes',
    { method: 'POST' },
    { rollbackOnError: true }
  )
}
