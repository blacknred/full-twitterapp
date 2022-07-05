import decode from 'jwt-decode'
import { SWRResponse } from 'swr'

import { useQuery } from '@/lib/swr'
import type { BaseResponseDto } from '@/types/response.dto'
import type { Auth } from '../types/auth.entity'

export function useAuth(): SWRResponse<BaseResponseDto<Auth>> {
  return useQuery<string>('auth', undefined, undefined, {
    // revalidation
    revalidateOnMount: false,
    revalidateOnFocus: false,
    revalidateIfStale: true,
    revalidateOnReconnect: true,
    refreshInterval: (data) => {
      if (!data) return 0
      // @ts-ignore
      return data.data.iat - Date.now() - 1000
    },
    // error
    shouldRetryOnError: true,
    errorRetryCount: 2,
    errorRetryInterval: 10000,
    //
    use: [
      (useSWRNext) => (key, fetcher, config) => {
        const res = useSWRNext(key, fetcher, config)
        console.log(res.data)

        if (!res.data) return res;

        try {
          // @ts-ignore
          // if (res.data?.data && typeof res.data.data === 'string') {
          // @ts-ignore
          res.data.data = decode<Auth>(res.data.data) as unknown as string
          // }
        } catch (e) {
        } finally {
          return res
        }
      },
    ],
    fallbackData: {
      data: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwidXNlcm5hbWUiOiJKb2huIERvZSIsImF2YXRhciI6IiIsImlkIjo0NTYsImlhdCI6MTY1NTE0NjEwOCwiZXhwIjoxNjU1MTQ5NzA4fQ.YGyf3C3UN8KYmOg2XQENnke5NI_uPRwgbedwF7oMACA',
    },
  }) as unknown as SWRResponse<BaseResponseDto<Auth>>
}
