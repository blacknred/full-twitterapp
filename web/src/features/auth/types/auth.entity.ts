import type { User } from '@/features/users'

export type Auth = Pick<User, 'id' | 'username' | 'img'> & {
  iat: number
}
