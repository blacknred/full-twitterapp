import type { User } from '@/features/users'
import type { BaseEntity } from '@/types/base.entity'

export type StatusDto = {
  text: string
  media: string[]
  tags: string[]
  authorId: number
  originId: number
}

export type Status = BaseEntity & {
  text?: string
  assets?: string[]
  author: User
  status?: Status
  //
  totalLikes: number
  totalReposts: number
  totalReplies: number
  //
  relation?: {
    liked: boolean
    reposted: boolean
  }
}

export type StatusEvent = {
  status: Status;
};