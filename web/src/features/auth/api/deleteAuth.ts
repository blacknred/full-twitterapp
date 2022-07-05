import { useSWRConfig } from 'swr'

import { useMutation } from '@/lib/swr'

export function useDeleteAuth() {
  const { mutate } = useSWRConfig()

  return useMutation<boolean>(
    'auth',
    { method: 'DELETE' },
    {
      onSuccess() {
        mutate('auth')
      },
    }
  )
}
