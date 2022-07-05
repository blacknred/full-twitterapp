import { useMutation } from '@/lib/swr'
import type { BaseEntity } from '@/types/base.entity'

export function useDeleteTweet(id: BaseEntity['id']) {
  return useMutation<boolean>(`tweets/${id}`, { method: 'DELETE' })
}
