import { Box, Stack, Typography } from '@mui/material'
import { usePrivy, useWallets } from '@privy-io/react-auth'
import { usePrivyWagmi } from '@privy-io/wagmi-connector'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import Head from 'next/head'

import { LoadingScreen } from '@/components'

export default function PrivyPage() {
  const router = useRouter()
  const {
    ready,
    authenticated,
    user,
    logout,
    linkEmail,
    linkGoogle,
    unlinkEmail,
    unlinkGoogle,
  } = usePrivy()
  const { wallet: activeWallet, setActiveWallet } = usePrivyWagmi()
  const { wallets } = useWallets()

  useEffect(() => {
    if (ready && !authenticated) {
      router.push('/auth')
    }
  }, [ready, authenticated, router])

  const numAccounts = user?.linkedAccounts?.length || 0
  const canRemoveAccount = numAccounts > 1

  const email = user?.email
  // const wallet = user?.wallet

  const googleSubject = user?.google?.subject || null

  if (!ready || (ready && !authenticated)) {
    return <LoadingScreen />
  }

  return (
    <>
      <Head>
        <title>Privy · Aucentive</title>
      </Head>

      <main className="flex flex-col min-h-screen px-4 sm:px-20 py-6 sm:py-10 bg-privy-light-blue">
        {ready && authenticated ? (
          <>
            <div className="flex flex-row justify-between">
              <h1 className="text-2xl font-semibold">Privy Auth</h1>
              <button
                onClick={logout}
                className="text-sm bg-violet-200 hover:text-violet-900 py-2 px-4 rounded-md text-violet-700"
              >
                Logout
              </button>
            </div>
            <div className="mt-12 flex gap-4 flex-wrap">
              {googleSubject ? (
                <button
                  onClick={() => {
                    unlinkGoogle(googleSubject)
                  }}
                  className="text-sm border border-violet-600 hover:border-violet-700 py-2 px-4 rounded-md text-violet-600 hover:text-violet-700 disabled:border-gray-500 disabled:text-gray-500 hover:disabled:text-gray-500"
                  disabled={!canRemoveAccount}
                >
                  Unlink Google
                </button>
              ) : (
                <button
                  onClick={() => {
                    linkGoogle()
                  }}
                  className="text-sm bg-violet-600 hover:bg-violet-700 py-2 px-4 rounded-md text-white"
                >
                  Link Google
                </button>
              )}

              {email ? (
                <button
                  onClick={() => {
                    unlinkEmail(email.address)
                  }}
                  className="text-sm border border-violet-600 hover:border-violet-700 py-2 px-4 rounded-md text-violet-600 hover:text-violet-700 disabled:border-gray-500 disabled:text-gray-500 hover:disabled:text-gray-500"
                  disabled={!canRemoveAccount}
                >
                  Unlink email
                </button>
              ) : (
                <button
                  onClick={linkEmail}
                  className="text-sm bg-violet-600 hover:bg-violet-700 py-2 px-4 rounded-md text-white"
                >
                  Connect email
                </button>
              )}
              {/* {wallet ? (
                <button
                  onClick={() => {
                    unlinkWallet(wallet.address)
                  }}
                  className="text-sm border border-violet-600 hover:border-violet-700 py-2 px-4 rounded-md text-violet-600 hover:text-violet-700 disabled:border-gray-500 disabled:text-gray-500 hover:disabled:text-gray-500"
                  disabled={!canRemoveAccount}
                >
                  Unlink wallet
                </button>
              ) : (
                <button
                  onClick={linkWallet}
                  className="text-sm bg-violet-600 hover:bg-violet-700 py-2 px-4 rounded-md text-white border-none"
                >
                  Connect wallet
                </button>
              )} */}
            </div>

            <p className="mt-6 font-bold uppercase text-sm text-gray-600">
              User object
            </p>
            <textarea
              value={JSON.stringify(user, null, 2)}
              className="max-w-4xl bg-slate-700 text-slate-50 font-mono p-4 text-xs sm:text-sm rounded-md mt-2"
              rows={20}
              disabled
            />

            <p className="mt-6 font-bold uppercase text-sm text-gray-600">
              Privy Wagmi wallet
            </p>
            <Stack direction="row" spacing={2} mt={2}>
              <Typography variant="body1" fontWeight="bold">
                Active Wallet
              </Typography>
              <Typography>{activeWallet?.address}</Typography>
            </Stack>
            <Stack spacing={2} mt={2}>
              {wallets.map((wallet) =>
                wallet.address != activeWallet?.address ? (
                  <Stack
                    key={wallet.address}
                    direction="row"
                    spacing={2}
                    alignItems="center"
                  >
                    <button
                      onClick={() => setActiveWallet(wallet)}
                      className="text-sm bg-violet-600 hover:bg-violet-700 py-2 px-4 rounded-md text-white"
                    >
                      Activate
                    </button>
                    <p>{wallet.address}</p>
                  </Stack>
                ) : (
                  <></>
                ),
              )}
            </Stack>
          </>
        ) : null}
      </main>
    </>
  )
}
