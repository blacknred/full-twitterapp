import type { Action, Middleware, ThunkAction } from '@reduxjs/toolkit'
import { configureStore } from '@reduxjs/toolkit'
import type { PropsWithChildren } from 'react'
import type { TypedUseSelectorHook } from 'react-redux'
import { Provider, useDispatch, useSelector } from 'react-redux'

import { IS_DEV } from '@/config'

const logger: Middleware = (store) => (next) => {
  return (action) => {
    console.groupCollapsed('dispatching', action)
    const result = next(action)
    console.table('next state', store.getState())
    console.groupEnd()
    return result
  }
}

export const store = configureStore({
  reducer: {},
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(IS_DEV ? [logger] : [])
  },
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const ReduxProvider = ({ children }: PropsWithChildren) => {
  return <Provider store={store} children={children} />
}
