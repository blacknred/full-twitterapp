import { useMutation } from '@/lib/swr'
import type { Subscription } from '../types/subscription.entity'

export type CreateSubscriptionDto = Pick<Subscription, 'userId'>

export function useCreateSubscription() {
  return useMutation<Subscription, CreateSubscriptionDto>(
    'subscriptions',
    { method: 'POST' },
    { rollbackOnError: true }
  )
}
