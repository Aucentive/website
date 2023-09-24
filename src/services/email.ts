import { createApi } from '@reduxjs/toolkit/query/react'

import { ApiResponse, baseQuery } from '@/services'
import { EmailStatus } from '@/types'

export const emailApi = createApi({
  reducerPath: 'emailApi',
  baseQuery,
  // refetchOnMountOrArgChange: 30,
  endpoints: (builder) => ({
    getSentEmails: builder.query<
      ApiResponse<
        {
          id: string
          hash: string
          sender: string
          recipient: string
          subject: string
          status: EmailStatus
          createdAt: string
        }[]
      >, // response body
      { accessToken: string } // request body
    >({
      query: ({ accessToken }) => ({
        url: 'email/sent',
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    }),

    sendEmail: builder.mutation<
      ApiResponse<string>,
      { accessToken: string } & {
        from: string
        to: string
        subject: string
        text: string
        html: string
      }
    >({
      query: ({ accessToken, ...body }) => ({
        url: 'email/send',
        method: 'POST',
        body,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    }),
  }),
})

export const { useGetSentEmailsQuery, useSendEmailMutation } = emailApi
