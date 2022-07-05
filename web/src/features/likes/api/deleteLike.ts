import { useMutation } from '@/lib/swr'
import type { BaseEntity } from '@/types/base.entity'

export function useDeleteLike(id: BaseEntity['id']) {
  return useMutation<boolean>(`likes/${id}`, { method: 'DELETE' })
}
