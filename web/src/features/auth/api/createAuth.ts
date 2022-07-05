import { useSWRConfig } from 'swr'

import { useMutation } from '@/lib/swr'

export type CreateAuthDto = {
  emailOrUsername: string
  password: string
}

export function useCreateAuth() {
  const { mutate } = useSWRConfig()

  return useMutation<boolean, CreateAuthDto>(
    'auth',
    { method: 'POST' },
    {
      onSuccess() {
        mutate('auth')
      },
    }
  )
}
