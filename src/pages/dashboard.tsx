import {
  IHybridPaymaster,
  PaymasterMode,
  SponsorUserOperationDto,
} from '@biconomy/paymaster'
import { Box, Button, Stack, TextField, Typography } from '@mui/material'
import { usePrivy, useWallets } from '@privy-io/react-auth'
import { usePrivyWagmi } from '@privy-io/wagmi-connector'
import axios from 'axios'
import { Contract, ethers } from 'ethers'
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
import { FTUserData, FTUserTokenHolder, ServiceStatus } from '@/types'
import Image from 'next/image'
import {
  useCreateServiceMutation,
  useGetServicesQuery,
  useMarkPaidServiceMutation,
} from '@/services/service'

export default function DashboardPage() {
  const router = useRouter()
  const { ready, authenticated, user, logout, getAccessToken } = usePrivy()
  const { wallet: activeWallet } = usePrivyWagmi()

  const { smartAccount } = useBiconomySmartAccount()

  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [claimHandleValue, setClaimHandleValue] = useState<string>('')
  const [isClaimingHandle, setIsClaimingHandle] = useState(false)

  const [isWithdrawingBalance, setIsWithdrawingBalance] = useState(false)
  const [isCreatingService, setIsCreatingService] = useState(false)
  const [isPayingForService, setIsPayingForService] = useState(false)

  const useGetUser = useGetUserQuery(
    {
      accessToken: accessToken || '',
    },
    {
      skip: !accessToken,
    },
  )

  const [createUser] = useCreateUserMutation()
  const [createService] = useCreateServiceMutation()
  const [markPaidService] = useMarkPaidServiceMutation()

  const useGetServices = useGetServicesQuery(
    {
      accessToken: accessToken || '',
    },
    {
      skip: !accessToken,
    },
  )

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

  const [createServiceData, setCreateServiceData] = useState<{
    title: string
    description: string
    payAmount: number
  }>({
    title: '',
    description: '',
    payAmount: 0,
  })

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

    setIsClaimingHandle(true)

    try {
      // console.log('userWallet', userWallet)
      const res = await createUser({
        userId: userEmail,
        address: userWallet,
        name: user.google?.name || userEmail,
        handle: `${claimHandleValue}@mail.aucentive.com`,
        accessToken,
      }).unwrap()
      // console.log(res)

      toast.success(`Success! Your handle is ${claimHandleValue}`)
      setTimeout(() => {
        router.reload()
      }, 2000)
    } catch (err) {
      console.error(err)
    } finally {
      setIsClaimingHandle(false)
    }
  }, [accessToken, claimHandleValue, user, ready, authenticated])

  const createServiceHandler = useCallback(async () => {
    if (!accessToken || !user || !ready || (ready && !authenticated)) return

    const userEmail = user.email?.address || user.google?.email
    if (!userEmail) return

    if (!ftUserTokenHolders.length) return

    setIsCreatingService(true)

    try {
      const res = await createService({
        accessToken,
        accessList: ftUserTokenHolders.map((holder) => holder.address),
        title: createServiceData.title,
        description: createServiceData.description,
        payAmount: createServiceData.payAmount,
      }).unwrap()
      console.log(res)

      setCreateServiceData({
        title: '',
        description: '',
        payAmount: 0,
      })
    } catch (err) {
      console.error(err)
    } finally {
      setIsCreatingService(false)
    }
  }, [
    accessToken,
    user,
    ready,
    authenticated,
    createServiceData,
    ftUserTokenHolders,
  ])

  const payForServiceHandler = useCallback(
    async (serviceId: string, payAmount: number) => {
      console.log('smartAccount', smartAccount)
      if (!activeWallet || !smartAccount || !accessToken) return

      setIsPayingForService(true)

      const provider = await activeWallet.getEthersProvider()
      const contract = AucentiveHub__factory.connect(
        AUCENTIVE_CONTRACT_ADDRESS_TESTNET,
        provider,
      )

      try {
        console.log('serviceId', `0x${serviceId}`)
        console.log('payAmount', payAmount)

        const erc20UsdcAuc = new Contract(
          '0x4c083c85dc4b6084c833ae614ce97dbf5286a7e2',
          [
            'function approve(address spender, uint256 amount) public returns (bool)',
          ],
          provider,
        )

        const approveTx = await erc20UsdcAuc.populateTransaction.approve(
          AUCENTIVE_CONTRACT_ADDRESS_TESTNET,
          payAmount,
        )

        const payForServiceTx =
          await contract.populateTransaction.payForService(
            `0x${serviceId}`,
            payAmount,
          )

        const tx1 = {
          to: '0x4c083c85dc4b6084c833ae614ce97dbf5286a7e2',
          data: approveTx.data,
        }

        const tx2 = {
          to: AUCENTIVE_CONTRACT_ADDRESS_TESTNET,
          data: payForServiceTx.data,
        }

        let userOp = await smartAccount.buildUserOp([tx1, tx2])
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

        await markPaidService({
          accessToken,
          serviceId,
        }).unwrap()

        toast.success(
          <div>
            <a
              href={`https://goerli.basescan.org/tx/${receipt.transactionHash}`}
              target="_blank"
            >
              Success! Here is your transaction: {receipt.transactionHash}
            </a>
          </div>,
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
        setIsPayingForService(false)
      }
    },
    [activeWallet, smartAccount, accessToken],
  )

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
        <div>
          <a
            href={`https://goerli.basescan.org/tx/${receipt.transactionHash}`}
            target="_blank"
          >
            Success! Here is your transaction: {receipt.transactionHash}
          </a>
        </div>,
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
            {!useGetServices.isFetching &&
              useGetServices.data &&
              !!useGetServices.data.payload && (
                <Box>
                  {useGetServices.data.payload.map((service) => (
                    <Box
                      key={service.id}
                      p={3}
                      m={1}
                      bgcolor="rgb(221, 214, 254)"
                      borderRadius={4}
                      display="inline-block"
                    >
                      <Typography variant="body1">
                        <b>Hash: </b>
                        {service.hash}
                      </Typography>
                      <Typography variant="body1">
                        <b>Title: </b>
                        {service.title}
                      </Typography>
                      <Typography variant="body1">
                        <b>Description: </b>
                        {service.description}
                      </Typography>
                      <Typography variant="body1">
                        <b>Payment: </b>
                        {service.payment} * 1e-6 USDC
                      </Typography>
                      {service.status === ServiceStatus.PENDING_PAYMENT ? (
                        <Button
                          variant="contained"
                          onClick={() =>
                            payForServiceHandler(service.hash, service.payment)
                          }
                          disabled={isPayingForService}
                          sx={{ mt: 1 }}
                        >
                          Pay for Service
                        </Button>
                      ) : (
                        <Typography variant="body1">
                          <b>Status: </b>
                          {ServiceStatus[service.status]}
                        </Typography>
                      )}
                    </Box>
                  ))}
                </Box>
              )}
            <Box mt={2}>
              <Typography variant="h6">Query Key Holders of FT User</Typography>
              <TextField
                type="text"
                size="small"
                variant="outlined"
                placeholder="0xdeadbeef"
                value={ftUserAddress}
                onChange={(e) => setFtUserAddress(e.target.value)}
                sx={{ minWidth: 400, mt: 1 }}
              />
            </Box>
            {ftUserData.address && (
              <Box mt={1}>
                <Stack direction="row" spacing={1}>
                  <Image
                    src={ftUserData.twitterPfpUrl}
                    alt=""
                    width={32}
                    height={32}
                  />
                  <Typography variant="body1">
                    {ftUserData.twitterName}
                  </Typography>
                </Stack>
                {/* <Stack>
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
                </Stack> */}
                <Stack spacing={1} maxWidth={550}>
                  <Typography variant="body1" fontWeight="bold">
                    Request Service for Key Holders
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    Title
                  </Typography>
                  <TextField
                    type="text"
                    size="small"
                    variant="outlined"
                    placeholder="Title"
                    value={createServiceData.title}
                    onChange={(e) =>
                      setCreateServiceData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    sx={{ minWidth: 400 }}
                  />
                  <Typography variant="body1" fontWeight="bold">
                    Description
                  </Typography>
                  <TextField
                    type="text"
                    size="small"
                    variant="outlined"
                    placeholder="Description"
                    value={createServiceData.description}
                    onChange={(e) =>
                      setCreateServiceData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    multiline
                    minRows={3}
                    sx={{ minWidth: 400 }}
                  />
                  <Typography variant="body1" fontWeight="bold">
                    Pay Amount
                  </Typography>
                  <TextField
                    type="number"
                    size="small"
                    variant="outlined"
                    placeholder="0"
                    value={createServiceData.payAmount}
                    onChange={(e) =>
                      setCreateServiceData((prev) => ({
                        ...prev,
                        payAmount: Number(e.target.value),
                      }))
                    }
                    InputProps={{ inputProps: { min: 0 } }}
                    sx={{ minWidth: 400 }}
                  />
                  <Button
                    variant="contained"
                    onClick={createServiceHandler}
                    disabled={isCreatingService}
                  >
                    Create Service
                  </Button>
                </Stack>
              </Box>
            )}
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
                disabled={isClaimingHandle}
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
