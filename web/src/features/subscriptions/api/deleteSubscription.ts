import { useMutation } from '@/lib/swr'
import type { BaseEntity } from '@/types/base.entity'

export function useDeleteSubscription(id: BaseEntity['id']) {
  return useMutation<boolean>(`subscriptions/${id}`, { method: 'DELETE' })
}
