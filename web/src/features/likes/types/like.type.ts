import type { Status } from '@/features/statuses'
import type { User } from '@/features/users'
import type { BaseEntity } from '@/types/base.entity'

export type LikeDto = {
  userId: string
  tweetId: string
}

export type Like = {
  user?: User;
  status?: Status;
};
