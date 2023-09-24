import {
  IHybridPaymaster,
  PaymasterMode,
  SponsorUserOperationDto,
} from '@biconomy/paymaster'
import { Box, Button, Stack, TextField, Typography } from '@mui/material'
import { usePrivy, useWallets } from '@privy-io/react-auth'
import { usePrivyWagmi } from '@privy-io/wagmi-connector'
import axios from 'axios'
import { ethers } from 'ethers'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import { LoadingScreen, NavTopbar } from '@/components'
import { useBiconomySmartAccount } from '@/components/context/SmartAccountContext'
import { XMTPContentRouter } from '@/components/xmtp/ContentRouter'
import { AUCENTIVE_CONTRACT_ADDRESS_TESTNET } from '@/config'
import { useCreateUserMutation, useGetUserQuery } from '@/services/user'
import { AucentiveHub__factory } from '@/types-typechain'
import { FTUserData, FTUserTokenHolder } from '@/types'
import Image from 'next/image'

export default function DashboardPage() {
  const router = useRouter()
  const {
    ready,
    authenticated,
    user,
    logout,
    linkEmail,
    linkGoogle,
    // linkWallet,
    unlinkEmail,
    unlinkGoogle,
    // unlinkWallet,
    // createWallet,
    getAccessToken,
  } = usePrivy()
  const { wallet: activeWallet, setActiveWallet } = usePrivyWagmi()
  // const { wallets } = useWallets()

  const { smartAccount } = useBiconomySmartAccount()

  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [claimHandleValue, setClaimHandleValue] = useState<string>('')

  const [sendEmailData, setSendEmailData] = useState<{
    from?: string
    to?: string
    subject?: string
    text?: string
  }>({})

  const [isWithdrawingBalance, setIsWithdrawingBalance] = useState(false)

  const useGetUser = useGetUserQuery(
    {
      accessToken: accessToken || '',
    },
    {
      skip: !accessToken,
    },
  )

  const [useCreateUser, createUserRes] = useCreateUserMutation()

  const [ftUserAddress, setFtUserAddress] = useState<string>('')
  const [ftUserData, setFtUserData] = useState<FTUserData>({
    id: 0,
    address: '',
    twitterUsername: '',
    twitterName: '',
    twitterPfpUrl: '',
    twitterUserId: '',
    lastOnline: '',
    lastMessageTime: '',
    holderCount: 0,
    holdingCount: 0,
    watchlistCount: 0,
    shareSupply: 0,
    displayPrice: '',
    lifetimeFeesCollectedInWei: '',
  })

  const [ftUserTokenHolders, setFtUserTokenHolders] = useState<
    FTUserTokenHolder[]
  >([])

  const claimHandleHandler = useCallback(async () => {
    if (
      !accessToken ||
      !claimHandleValue ||
      !user ||
      !ready ||
      (ready && !authenticated)
    )
      return

    const userEmail = user.email?.address || user.google?.email
    const userWallet = user.wallet?.address
    if (!userEmail || !userWallet) return

    try {
      console.log('userWallet', userWallet)
      const res = await useCreateUser({
        userId: userEmail,
        address: userWallet,
        name: user.google?.name || userEmail,
        handle: `${claimHandleValue}@mail.aucentive.com`,
        accessToken,
      }).unwrap()
      console.log(res)
    } catch (err) {
      console.error(err)
    }
  }, [accessToken, claimHandleValue, user, ready, authenticated])

  const withdrawBalanceHandler = useCallback(async () => {
    console.log('smartAccount', smartAccount)
    if (!activeWallet || !smartAccount) return

    setIsWithdrawingBalance(true)

    const provider = await activeWallet.getEthersProvider()
    const contract = AucentiveHub__factory.connect(
      AUCENTIVE_CONTRACT_ADDRESS_TESTNET,
      provider,
    )

    try {
      const withdrawTx = await contract.populateTransaction.withdrawBalance()
      console.log(withdrawTx.data)

      const tx1 = {
        to: AUCENTIVE_CONTRACT_ADDRESS_TESTNET,
        data: withdrawTx.data,
      }

      let userOp = await smartAccount.buildUserOp([tx1])
      console.log('userOp', userOp)

      const biconomyPaymaster =
        smartAccount.paymaster as IHybridPaymaster<SponsorUserOperationDto>

      let paymasterServiceData: SponsorUserOperationDto = {
        mode: PaymasterMode.SPONSORED,
        smartAccountInfo: {
          name: 'BICONOMY',
          version: '2.0.0',
        },
      }

      const paymasterAndDataResponse =
        await biconomyPaymaster.getPaymasterAndData(
          userOp,
          paymasterServiceData,
        )
      console.log('paymasterAndDataResponse', paymasterAndDataResponse)

      userOp.paymasterAndData = paymasterAndDataResponse.paymasterAndData
      const userOpResponse = await smartAccount.sendUserOp(userOp)
      console.log('userOpHash', userOpResponse)

      const { receipt } = await userOpResponse.wait(1)
      console.log('txHash', receipt.transactionHash)

      toast.success(
        `Success! Here is your transaction: ${receipt.transactionHash} `,
        {
          position: 'top-right',
          autoClose: 18000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
        },
      )
    } catch (err: any) {
      console.error(err)
      console.log(err)
    } finally {
      setIsWithdrawingBalance(false)
    }
  }, [activeWallet, smartAccount])

  useEffect(() => {
    if (ready && !authenticated) {
      router.push('/auth')
      return
    }

    // things after this line will only run if ready and authenticated
    if (!ready) return

    getAccessToken().then((token) => setAccessToken(token))
  }, [ready, authenticated, router])

  useEffect(() => {
    const getFtUserTokenHolders = async () => {
      if (!ethers.utils.isAddress(ftUserAddress)) return

      try {
        setFtUserData
        const resUser = await axios.get<FTUserData>(
          `https://prod-api.kosetto.com/users/${ftUserAddress}`,
        )
        setFtUserData(resUser.data)

        const resHolders = await axios.get<{
          users: FTUserTokenHolder[]
        }>(`https://prod-api.kosetto.com/users/${ftUserAddress}/token-holdings`)
        setFtUserTokenHolders(resHolders.data.users)
      } catch (err) {
        console.error(err)
      }
    }
    getFtUserTokenHolders()
  }, [ftUserAddress])

  if (!ready || (ready && !authenticated)) {
    return <LoadingScreen />
  }

  return (
    <>
      <Head>
        <title>Dashboard · Aucentive</title>
      </Head>

      <main className="flex flex-col min-h-screen px-4 sm:px-20 py-6 sm:py-10 bg-privy-light-blue">
        <div className="flex flex-row justify-between">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <button
            onClick={logout}
            className="text-sm bg-violet-200 hover:text-violet-900 py-2 px-4 rounded-md text-violet-700"
          >
            Logout
          </button>
        </div>
        <NavTopbar />
        {/* <div className="mt-12 flex gap-4 flex-wrap"> */}
        {/* {googleSubject ? (
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
          )} */}
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
        {/* </div> */}

        {useGetUser.isLoading || useGetUser.isFetching ? (
          <></>
        ) : !useGetUser.isFetching &&
          useGetUser.data &&
          !!useGetUser.data.payload &&
          !!useGetUser.data.payload.address ? (
          <>
            <Stack direction="row" spacing={2} alignItems="center">
              {/* <Typography variant="body1">Balance: 0</Typography> */}
              <Button
                variant="contained"
                onClick={withdrawBalanceHandler}
                disabled={isWithdrawingBalance}
              >
                Withdraw All USDC Balance
              </Button>
            </Stack>
            <Typography
              variant="body1"
              mt={6}
              fontWeight="bold"
              textTransform="uppercase"
              className="text-gray-600"
            >
              Friend Tech
            </Typography>
            <Box mt={2}>
              <Typography variant="h6">Query Key Holders of FT User</Typography>
              <TextField
                type="text"
                size="small"
                variant="outlined"
                placeholder="0xdeadbeef"
                value={ftUserAddress}
                onChange={(e) => setFtUserAddress(e.target.value)}
                sx={{ minWidth: 400 }}
              />
            </Box>
            {ftUserData.address && (
              <Box mt={1}>
                {/* <Stack direction="row" spacing={1}>
                  <Image
                    src={ftUserData.twitterPfpUrl}
                    alt=""
                    width={32}
                    height={32}
                  />
                  <Typography variant="body1">
                    {ftUserData.twitterName}
                  </Typography>
                </Stack> */}
                <Stack>
                  {ftUserTokenHolders.map((holder) => (
                    <Stack direction="row" spacing={2} key={holder.address}>
                      <Image
                        src={holder.twitterPfpUrl}
                        alt=""
                        width={32}
                        height={32}
                      />
                      <Typography variant="body1" fontWeight="bold">
                        {holder.twitterName}
                      </Typography>
                      <Typography variant="body1">{holder.address}</Typography>
                    </Stack>
                  ))}
                </Stack>
              </Box>
            )}
            <Box mt={4}>
              <XMTPContentRouter />
            </Box>
          </>
        ) : (
          <Box mt={2}>
            <Typography variant="h5">Claim Handle</Typography>
            <Stack direction="row" spacing={2} alignItems="center" mt={4}>
              <TextField
                type="text"
                size="medium"
                variant="outlined"
                placeholder="Enter handle to claim"
                value={claimHandleValue}
                onChange={(e) => setClaimHandleValue(e.target.value)}
              />
              <Typography variant="body1">@mail.aucentive.com</Typography>
              <Button
                variant="contained"
                size="large"
                onClick={claimHandleHandler}
              >
                Claim
              </Button>
            </Stack>
          </Box>
        )}
      </main>
    </>
  )
}
