import { useMutation } from '@/lib/swr'

export type CreateAuthCodeDto = {
  emailOrUsername: string
}

export function useCreateAuthCode() {
  return useMutation<boolean, CreateAuthCodeDto>('auth', { method: 'POST' })
}
