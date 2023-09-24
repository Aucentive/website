import { fetchBaseQuery } from '@reduxjs/toolkit/dist/query'

import { RootState } from '@/store'

export type ApiResponse<T = any> =
  | { error: string; payload: null }
  | { error: null; payload: T }

export const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  prepareHeaders: (headers, { getState }) => {
    // const state = getState() as RootState
    // const { jwtToken } = state.user

    // if (jwtToken) headers.set('Authorization', `Bearer ${jwtToken}`)

    headers.set('Accept', 'application/json')
    headers.set('Content-Type', 'application/json')

    return headers
  },
  credentials: 'include', // allows server to set cookies
})
