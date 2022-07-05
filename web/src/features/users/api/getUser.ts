import { useQuery } from '@/lib/swr'
import type { BaseEntity } from '@/types/base.entity'
import type { User } from '../types/user.type'

export function useUser(id: BaseEntity['id']) {
  return useQuery<User>(`users/${id}`)
}
