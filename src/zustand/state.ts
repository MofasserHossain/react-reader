import config from '@/config/config'
import { AccountSlice, AuthSlice, CategorySlice, ShoppingSlice } from '@/types'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { useShallow } from 'zustand/react/shallow'
import {
  accountSlice,
  authSlice,
  BookState,
  categorySlice,
  shoppingSlice,
} from './slice'
import bookSlice from './slice/book-slice'
import { layoutSlice, LayoutSlice } from './slice/layout-slice'

export type RootState = AuthSlice &
  ShoppingSlice &
  CategorySlice &
  AccountSlice &
  BookState &
  LayoutSlice

export const useAppStore = create<RootState>()(
  devtools(
    persist(
      (...a) => ({
        ...authSlice(...a),
        ...shoppingSlice(...a),
        ...categorySlice(...a),
        ...accountSlice(...a),
        ...bookSlice(...a),
        ...layoutSlice(...a),
      }),
      {
        name: 'vividlifi',
        partialize: (state) => ({
          user: state.user,
          isLoggedIn: state.isLoggedIn,
          token: state.token,
          products: state.products,
          wishList: state.wishList,
        }),
      },
    ),
    {
      enabled: config.nodeENV !== 'production',
    },
  ),
)

type PickPartial<T, K extends keyof T> = {
  [P in K]?: T[P]
}

export const useShallowStore = <K extends keyof RootState>(keys: K[]) => {
  return useAppStore(
    useShallow((state: RootState) => {
      const newState = {} as PickPartial<RootState, K>
      keys.forEach((key) => {
        newState[key] = state[key]
      })
      return newState as RootState
    }),
  )
}
