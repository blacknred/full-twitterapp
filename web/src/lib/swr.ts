import type { Key, SWRConfiguration, Fetcher } from 'swr'
import useSWR, { useSWRConfig } from 'swr'
import type { SWRMutationConfiguration } from 'swr/mutation'
import useSwrMutation from 'swr/mutation'

import { API_URL } from '@/config'
import { BaseResponseDto, ValidationErrorDto } from '@/types/response.dto'

export function errorMap(errors: ValidationErrorDto[]) {
  return errors.map(({ message, field }) => [field, message])
}

export function mutator<Dto>(init: RequestInit = {}) {
  return async (key: string, { arg }: Readonly<{ arg: Dto }>) => {
    if (arg) init.body = JSON.stringify(arg)
    if (!init.method) init.method = 'POST'
    return fetch(`${API_URL}/${key}`, init) as ReturnType<Fetcher<any>>

    // Fetch throws only network errors but not non 200-299 responses
    // However we can throw such an error manually (which will be returned from useSwr hook)
    // if (!res.ok) {
    //    const error = new Error('An error occurred while fetching the data.')
    //    // Attach extra info to the error object.
    //    const data = await res.json();
    //    error.info = errorMap(data.errors);
    //    error.status = res.status;
    //    throw error
    //  }
    // const { data, error } = useSWR('/api/user', fetcher)
    // error.info === [['email', "Not valid email"]]
    // error.status === 422
  }
}

export async function fetcher(key: string, init: RequestInit = {}) {
  return fetch(`${API_URL}/${key}`, init) as ReturnType<Fetcher<any>>
}

/**
 * SWR Mutation api hook
 *
 * @param {string} key
 * @param {object={}} init
 * @param {object=} options
 * @returns object
 */
export function useMutation<Data, Dto = never, Error = any>(
  key: Key,
  init: RequestInit = {},
  options?: SWRMutationConfiguration<BaseResponseDto<Data>, Error, Key, Dto>
) {
  const token = useSWRConfig().cache.get('auth')

  if (token) {
    init.credentials = 'same-origin'
    init.headers = { Authorization: `Bearer ${token}`, ...init.headers }
  }

  return useSwrMutation<BaseResponseDto<Data>, Error, Key, Dto>(
    key,
    mutator(init),
    {
      populateCache: false,
      revalidate: false,
      ...options,
    }
  )
}

/**
 * SWR Query api hook
 *
 * @param {string} key
 * @param {string=} slug
 * @param {object={}} query
 * @param {object={}} init
 * @param {object=} options
 * @returns object
 */
export function useQuery<
  Data,
  Dto extends Record<string, any> = {},
  Error = any
>(
  key: Key,
  query: string | Dto = '',
  init: RequestInit = {},
  options?: SWRConfiguration<BaseResponseDto<Data>, Error>
) {
  const token = useSWRConfig().cache.get('auth')
  const usp = new URLSearchParams(query)
  usp.sort()

  if (token) {
    init.credentials = 'same-origin'
    init.headers = { Authorization: `Bearer ${token}`, ...init.headers }
  }

  return useSWR<BaseResponseDto<Data>, Error>(
    [`${key}?${usp.toString()}`, init],
    fetcher,
    {
      dedupingInterval: 1000,
      ...options,
    }
  )
}
