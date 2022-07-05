import { useSWRConfig } from 'swr'

import { useMutation } from '@/lib/swr'
import type { BaseEntity } from '@/types/base.entity'

export function useDeleteUser(id: BaseEntity['id']) {
  const { mutate } = useSWRConfig()

  return useMutation<boolean>(
    `users/${id}`,
    { method: 'DELETE' },
    {
      onSuccess() {
        mutate('auth')
      },
    }
  )
}
