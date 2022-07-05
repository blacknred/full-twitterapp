import { useQuery } from '@/lib/swr'
import type { KeysetPaginationDto } from '@/types/request.dto'
import type { PaginatedDataDto } from '@/types/response.dto'
import type { MappedSubscription, Subscription } from '../types/subscription.entity'

export type GetSubscriptionsDto = KeysetPaginationDto<Subscription>

export function useSubscriptions(query?: string | GetSubscriptionsDto) {
  return useQuery<PaginatedDataDto<MappedSubscription>>('subscriptions', query)
}
useSubscriptions()