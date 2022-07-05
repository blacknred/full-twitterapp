import { BaseEntity } from '@/types/base.entity'

export type User = BaseEntity & {
  username: string
  name: string
  img?: string
  //
  bio?: string
  email?: string
  //
  totalFollowers: number
  totalFollowing: number
  totalStatuses: number
  //
  relation?: {
    blockned: boolean
    followed: boolean
    totalInterFollowing: number
  }
}
