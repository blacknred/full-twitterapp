import { BaseEntity } from '@/types/base.entity'

export type Report = BaseEntity & {
  uid: number
  sid?: number
  reason: string
}
