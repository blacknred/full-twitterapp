import type { User } from '@/features/users'
import type { BaseEntity } from '@/types/base.entity'

export type Subscription = Omit<BaseEntity, 'updatedAt'> & {
  userId: number
  subUserId: number
}

export type MappedSubscription = Omit<Subscription, 'userId' | 'subUserId'> & {
  user: User
  subUser: User
}
