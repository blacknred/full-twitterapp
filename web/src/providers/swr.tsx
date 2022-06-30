import type { PropsWithChildren } from 'react';
import { useRef } from 'react';
import toast from "react-hot-toast";
import type { Fetcher, Key, Middleware, SWRConfiguration, SWRHook } from 'swr';
import { SWRConfig } from "swr";

import { IS_DEV } from '@/config';
import { fetcher } from '@/lib/swr';

function storageProvider() {
  const map = new Map(JSON.parse(localStorage.getItem("app-cache") || "[]"));

  window.addEventListener("beforeunload", () => {
    map.delete('auth'); // remove jwt access-token
    const appCache = JSON.stringify(Array.from(map.entries()));
    localStorage.setItem("app-cache", appCache);
  });

  return map;
}

const logger: Middleware = (useSWRNext: SWRHook) => {
  return (
    key: Key,
    fetcher: Fetcher<unknown> | null,
    config: SWRConfiguration
  ) => {
    const res = useSWRNext(key, fetcher, config);
    console.groupCollapsed("SWR Request:", key);
    console.table(res.data?.data)
    console.groupEnd()
    return res;
  };
}

export const SwrProvider = ({ children }: PropsWithChildren) => {
  const toastId = useRef<string | null>(null);

  return (
    <SWRConfig children={children} value={{
      fetcher,
      provider: storageProvider,
      revalidateOnReconnect: true,
      loadingTimeout: 10000,
      use: IS_DEV ? [logger] : [],
      onLoadingSlow() {
        toastId.current = toast.loading('Slow network...');
      },
      onSuccess() {
        if (toastId.current) {
          toast.dismiss(toastId.current);
        }
      },
      onDiscarded() {
        if (toastId.current) {
          toast.dismiss(toastId.current);
        }
      },
      onError(err) {
        if (err.status !== 403 && err.status !== 404) {
          toastId.current = toast.error(`Network error\n\n${err.message}`)
        }
      },
    }} />
  )
}
