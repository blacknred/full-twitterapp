import { useMutation } from '@/lib/swr'
import type { BaseEntity } from '@/types/base.entity'
import type { User } from '../types/user.type'
import { CreateUserDto } from './createUser'

export type UpdateUserDto = Partial<CreateUserDto> & {
  bio?: string
  img?: string
  name?: string
}

export function useUpdateUser(id: BaseEntity['id']) {
  return useMutation<User, UpdateUserDto>(
    `users/${id}`,
    {
      method: 'PATCH',
    },
    { rollbackOnError: true }
  )
}
