import {
  IHybridPaymaster,
  PaymasterMode,
  SponsorUserOperationDto,
} from '@biconomy/paymaster'
import { Box, Button, Stack, TextField, Typography } from '@mui/material'
import { usePrivy, useWallets } from '@privy-io/react-auth'
import { usePrivyWagmi } from '@privy-io/wagmi-connector'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import { LoadingScreen, NavTopbar } from '@/components'
import { useBiconomySmartAccount } from '@/components/context/SmartAccountContext'
import { AUCENTIVE_CONTRACT_ADDRESS_TESTNET } from '@/config'
import { useCreateUserMutation, useGetUserQuery } from '@/services/user'
import {
  useCheckEmailPassMutation,
  useGetSentEmailsQuery,
  useSendEmailMutation,
} from '@/services/email'
import { EmailStatus, ServiceStatus } from '@/types'
import { AucentiveHub__factory } from '@/types-typechain'

export default function EmailPage() {
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
  const { wallets } = useWallets()

  const { smartAccount } = useBiconomySmartAccount()

  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [claimHandleValue, setClaimHandleValue] = useState<string>('')

  const [sendEmailData, setSendEmailData] = useState<{
    from?: string
    to?: string
    subject?: string
    text?: string
  }>({})

  const [payServiceAmount, setPayServiceAmount] = useState<
    Record<string, number>
  >({})

  const useGetUser = useGetUserQuery(
    {
      accessToken: accessToken || '',
    },
    {
      skip: !accessToken,
    },
  )

  const [useCreateUser, createUserRes] = useCreateUserMutation()
  const [sendEmail, sendEmailRes] = useSendEmailMutation()
  const [checkEmailPass, checkEmailPassRes] = useCheckEmailPassMutation()

  const useGetSentEmails = useGetSentEmailsQuery(
    {
      accessToken: accessToken || '',
    },
    {
      skip: !accessToken,
    },
  )

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

  const sendEmailHandler = useCallback(async () => {
    if (!accessToken || !user || !ready || (ready && !authenticated)) return

    const userEmail = user.email?.address || user.google?.email
    if (!userEmail) return

    if (!sendEmailData.to || !sendEmailData.subject || !sendEmailData.text)
      return

    try {
      let recipientEmail = sendEmailData.to.replace('@mail.aucentive.com', '')
      recipientEmail = `${recipientEmail}@mail.aucentive.com`

      const res = await sendEmail({
        accessToken,
        from: userEmail,
        to: recipientEmail,
        subject: sendEmailData.subject,
        text: sendEmailData.text,
        html: sendEmailData.text,
      }).unwrap()
      console.log(res)
    } catch (err) {
      console.error(err)
    }
  }, [accessToken, user, ready, authenticated, sendEmailData])

  const payForServiceHandle = useCallback(
    async (serviceId: string, payAmount: number) => {
      console.log('smartAccount', smartAccount)
      if (!activeWallet || !smartAccount) return

      const provider = await activeWallet.getEthersProvider()
      const contract = AucentiveHub__factory.connect(
        AUCENTIVE_CONTRACT_ADDRESS_TESTNET,
        provider,
      )

      try {
        console.log('serviceId', serviceId)
        console.log('payAmount', payAmount)
        const withdrawTx = await contract.populateTransaction.payForService(
          serviceId,
          payAmount,
        )
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
      }
    },
    [activeWallet, smartAccount],
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

  const userEmail = user?.email?.address || user?.google?.email || null

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
          !!accessToken &&
          useGetUser.data &&
          !!useGetUser.data.payload &&
          !!useGetUser.data.payload.address ? (
          <>
            {/* <Stack direction="row" spacing={2} alignItems="center" mt={4}>
              <Typography variant="body1">Balance: 0</Typography>
              <Button variant="contained" onClick={withdrawBalanceHandle}>
                Withdraw Balance
              </Button>
            </Stack> */}
            <Typography
              variant="body1"
              mt={6}
              fontWeight="bold"
              textTransform="uppercase"
              className="text-gray-600"
            >
              Emails
            </Typography>
            <Box>
              <Typography variant="h5">Sent Emails</Typography>
              <Box mt={2}>
                <Typography variant="body1">
                  {useGetSentEmails.data?.payload?.map((email) => {
                    return (
                      <Box
                        key={email.id}
                        bgcolor="#eee"
                        p={3}
                        borderRadius={8}
                        display="inline-block"
                      >
                        <Stack spacing={1}>
                          <Typography variant="body1">
                            ID: {email.id}
                          </Typography>
                          <Typography variant="body1">
                            Status: {EmailStatus[email.status]}
                          </Typography>
                          <Typography variant="body1">
                            Recipient: {email.recipient}
                          </Typography>
                          <Typography variant="body1">
                            Subject: {email.subject}
                          </Typography>
                          {email.status !== 4 && email.status !== 5 && (
                            <>
                              <TextField
                            type="number"
                            value={payServiceAmount[email.id] || 0}
                            onChange={(e) =>
                              setPayServiceAmount((prev) => ({
                                ...prev,
                                [email.id]: Number(e.target.value),
                              }))
                            }
                            InputProps={{ inputProps: { min: 0 } }}
                            sx={{ display: 'block' }}
                          />
                          <Button
                            variant="contained"
                            size="medium"
                            onClick={() =>
                              payForServiceHandle(`0x${email.hash}`, 0)
                            }
                          >
                            Pay For Email
                          </Button>
                          <Button
                            variant="contained"
                            size="medium"
                            onClick={() =>
                              checkEmailPass({
                                accessToken,
                                serviceId: email.id,
                                payAmount: '0',
                              })
                            }
                          >
                            Check Email
                          </Button>
                            </>
                          )}
                        </Stack>
                      </Box>
                    )
                  })}
                </Typography>
              </Box>
            </Box>
            {userEmail && (
              <Box mt={4}>
                <Typography variant="h5">Send Email</Typography>
                <Box
                  mt={2}
                  maxWidth={550}
                  p={3}
                  bgcolor="#eee"
                  borderRadius={2}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Typography variant="body1" fontWeight="bold">
                      From:{' '}
                    </Typography>
                    <Typography>{userEmail}</Typography>
                  </Stack>
                  <Stack direction="column" spacing={1} mt={2}>
                    <Typography variant="body1" fontWeight="bold">
                      To:{' '}
                    </Typography>
                    <TextField
                      type="text"
                      size="small"
                      variant="outlined"
                      placeholder="jdub@jdub.com"
                      value={sendEmailData.to}
                      onChange={(e) =>
                        setSendEmailData((prev) => ({
                          ...prev,
                          to: e.target.value,
                        }))
                      }
                    />
                  </Stack>
                  <Stack direction="column" spacing={1} mt={2}>
                    <Typography variant="body1" fontWeight="bold">
                      Subject
                    </Typography>
                    <TextField
                      type="text"
                      size="small"
                      variant="outlined"
                      placeholder="Type subject here"
                      value={sendEmailData.subject}
                      onChange={(e) =>
                        setSendEmailData((prev) => ({
                          ...prev,
                          subject: e.target.value,
                        }))
                      }
                    />
                  </Stack>
                  <Stack direction="column" spacing={1} mt={3}>
                    <Typography variant="body1" fontWeight="bold">
                      Text
                    </Typography>
                    <TextField
                      type="text"
                      size="medium"
                      variant="outlined"
                      placeholder="text"
                      multiline
                      minRows={5}
                      value={sendEmailData.text}
                      onChange={(e) =>
                        setSendEmailData((prev) => ({
                          ...prev,
                          text: e.target.value,
                        }))
                      }
                    />
                  </Stack>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={sendEmailHandler}
                    sx={{ mt: 2 }}
                  >
                    Send Email
                  </Button>
                </Box>
              </Box>
            )}
          </>
        ) : (
          <></>
        )}
      </main>
    </>
  )
}
