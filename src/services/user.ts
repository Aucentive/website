import { createApi } from '@reduxjs/toolkit/query/react'

import { ApiResponse, baseQuery } from '@/services'
import type { UserProfile } from '@/types/user'

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery,
  refetchOnMountOrArgChange: true, // 30
  endpoints: (builder) => ({
    getUser: builder.query<
      ApiResponse<UserProfile>,
      { accessToken: string }
    >({
      // User is auto-parsed by server using the JWT token in the Headers
      // (passed in from the custom extended `baseQuery`)
      query: ({ accessToken, ...params }) => ({
        url: 'user/profile',
        params,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    }),

    // getHandle: builder.query<
    //   ApiResponse<string | null>,
    //   { appPubkey: string; handle: string }
    // >({
    //   query: (params) => ({
    //     url: 'user/handle',
    //     params,
    //   }),
    // }),

    createUser: builder.mutation<
      ApiResponse<boolean>,
      {
        name: string
        address: string // on-chain address
        handle: string
        userId: string // user's email
        accessToken: string
      }
    >({
      query: ({ accessToken, ...body }) => ({
        url: 'user/profile',
        method: 'POST',
        body,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    }),
  }),
})

export const { useGetUserQuery, useCreateUserMutation } = userApi
