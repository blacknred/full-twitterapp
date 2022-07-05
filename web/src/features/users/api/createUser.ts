import { useMutation } from '@/lib/swr'
import type { User } from '../types/user.type'

export type CreateUserDto = Pick<User, 'username'> & {
  email: string
  password: string
}

export function useCreateUser() {
  return useMutation<User, CreateUserDto>('users', { method: 'POST' })
}
