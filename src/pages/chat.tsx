import { Box, Button, Stack, TextField, Typography } from '@mui/material'
import { usePrivy } from '@privy-io/react-auth'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

import { LoadingScreen, NavTopbar } from '@/components'
import { XMTPContentRouter } from '@/components/xmtp/ContentRouter'
import { useGetUserQuery } from '@/services/user'

export default function ChatPage() {
  const router = useRouter()
  const { ready, authenticated, logout, getAccessToken } = usePrivy()

  const [accessToken, setAccessToken] = useState<string | null>(null)

  const useGetUser = useGetUserQuery(
    {
      accessToken: accessToken || '',
    },
    {
      skip: !accessToken,
    },
  )

  useEffect(() => {
    if (ready && !authenticated) {
      router.push('/auth')
      return
    }

    // things after this line will only run if ready and authenticated
    if (!ready) return

    getAccessToken().then((token) => setAccessToken(token))
  }, [ready, authenticated, router])

  if (!ready || (ready && !authenticated)) {
    return <LoadingScreen />
  }

  return (
    <>
      <Head>
        <title>Chat · Aucentive</title>
      </Head>

      <main className="flex flex-col min-h-screen px-4 sm:px-20 py-6 sm:py-10 bg-privy-light-blue">
        <div className="flex flex-row justify-between">
          <h1 className="text-2xl font-semibold">Chat</h1>
          <button
            onClick={logout}
            className="text-sm bg-violet-200 hover:text-violet-900 py-2 px-4 rounded-md text-violet-700"
          >
            Logout
          </button>
        </div>
        <NavTopbar />

        {useGetUser.isLoading || useGetUser.isFetching ? (
          <></>
        ) : !useGetUser.isFetching &&
          useGetUser.data &&
          !!useGetUser.data.payload &&
          !!useGetUser.data.payload.address ? (
          <Box mt={4}>
            <XMTPContentRouter />
          </Box>
        ) : (
          <></>
        )}
      </main>
    </>
  )
}
