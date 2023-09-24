import { createApi } from '@reduxjs/toolkit/query/react'

import { ApiResponse, baseQuery } from '@/services'
import { ServiceStatus } from '@/types'

export const serviceApi = createApi({
  reducerPath: 'serviceApi',
  baseQuery,
  // refetchOnMountOrArgChange: 30,
  endpoints: (builder) => ({
    getServices: builder.query<
      ApiResponse<
        {
          id: string
          hash: string
          title: string
          description: string
          requester: string
          status: ServiceStatus
          createdAt: number
          payment: number
          accessList: string[]
        }[]
      >, // response body
      { accessToken: string } // request body
    >({
      query: ({ accessToken }) => ({
        url: 'service/created',
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    }),

    createService: builder.mutation<
      ApiResponse<string>,
      { accessToken: string } & {
        accessList: string[]
        title: string
        description: string
        payAmount: number
      }
    >({
      query: ({ accessToken, ...body }) => ({
        url: 'service/create',
        method: 'POST',
        body,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    }),

    markPaidService: builder.mutation<
      ApiResponse<string>,
      { accessToken: string } & {
        serviceId: string
      }
    >({
      query: ({ accessToken, ...body }) => ({
        url: 'service/webhook-pass',
        method: 'POST',
        body,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    }),
  }),
})

export const {
  useGetServicesQuery,
  useCreateServiceMutation,
  useMarkPaidServiceMutation,
} = serviceApi
