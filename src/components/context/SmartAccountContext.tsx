// import SmartAccount from '@biconomy/smart-account'
import {
  BiconomySmartAccountV2,
  DEFAULT_ENTRYPOINT_ADDRESS,
} from '@biconomy/account'
import {
  ECDSAOwnershipValidationModule,
  DEFAULT_ECDSA_OWNERSHIP_MODULE,
} from '@biconomy/modules'
import { ChainId } from '@biconomy/core-types'
import { IBundler, Bundler } from '@biconomy/bundler'
import { IPaymaster, BiconomyPaymaster } from '@biconomy/paymaster'
import { usePrivy, useWallets } from '@privy-io/react-auth'
import { usePrivyWagmi } from '@privy-io/wagmi-connector'
import { getWalletClient } from '@wagmi/core'
import * as chains from '@wagmi/chains'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useWalletClient } from 'wagmi'

// Types
type Balance = {
  totalBalanceInUsd: number
  alltokenBalances: any[]
}

type ISmartAccount = {
  version: string
  smartAccountAddress: string
  isDeployed: boolean
}

type SmartAccountContextType = {
  wallet: BiconomySmartAccountV2 | null
  state: any | null // SmartAccountState
  balance: Balance
  loading: boolean
  isFetchingBalance: boolean
  selectedAccount: ISmartAccount | null
  smartAccountsArray: ISmartAccount[]
  setSelectedAccount: React.Dispatch<React.SetStateAction<ISmartAccount | null>>
  getSmartAccount: () => Promise<string>
  getSmartAccountBalance: () => Promise<string>
}

export const biconomySupportedChainIds = [
  chains.base.id,
  chains.baseGoerli.id,
  chains.polygonMumbai.id,
  chains.arbitrumGoerli.id,
]

// Context
export const SmartAccountContext = React.createContext<SmartAccountContextType>(
  {
    wallet: null,
    state: null,
    balance: {
      totalBalanceInUsd: 0,
      alltokenBalances: [],
    },
    loading: false,
    isFetchingBalance: false,
    selectedAccount: null,
    smartAccountsArray: [],
    setSelectedAccount: () => {},
    getSmartAccount: () => Promise.resolve(''),
    getSmartAccountBalance: () => Promise.resolve(''),
  },
)
export const useSmartAccountContext = () => useContext(SmartAccountContext)

const targetChainId =
  process.env.NEXT_PUBLIC_CHAIN_TARGET === 'mainnet'
    ? ChainId.BASE_MAINNET
    : ChainId.BASE_GOERLI_TESTNET

// Provider
export const BiconomySmartAccountProvider = ({ children }: any) => {
  // const { provider, address } = useWeb3AuthContext()

  const { user, ready, authenticated } = usePrivy()
  const { wallet: activeWallet, setActiveWallet } = usePrivyWagmi()
  const { wallets } = useWallets()

  const [smartAccountWallet, setSmartAccountWallet] =
    useState<BiconomySmartAccountV2 | null>(null)
  const [state, setState] = useState<any | null>(null)
  const [selectedAccount, setSelectedAccount] = useState<ISmartAccount | null>(
    null,
  )
  const [smartAccountsArray, setSmartAccountsArray] = useState<ISmartAccount[]>(
    [],
  )
  const [balance, setBalance] = useState<Balance>({
    totalBalanceInUsd: 0,
    alltokenBalances: [],
  })
  const [isFetchingBalance, setIsFetchingBalance] = useState(false)
  const [loading, setLoading] = useState(false)

  const getSmartAccount = useCallback(async () => {
    console.log('getSmartAccount')
    if (!ready || (ready && !authenticated)) return 'Not authenticated'
    if (!user || !user.wallet || !activeWallet || !wallets || !wallets.length)
      return 'No wallet found'
    if (activeWallet.address !== user.wallet.address)
      return 'Privy embedded wallet not active'

    const activeChainId = parseInt(activeWallet.chainId)
    // @ts-ignore
    if (!biconomySupportedChainIds.includes(activeChainId)) {
      // return 'Unsupported chain'
      await activeWallet.switchChain(targetChainId)
    }

    try {
      setLoading(true)

      const walletProvider = await activeWallet.getEthersProvider()
      const provider = await activeWallet.getEthersProvider()
      await activeWallet.switchChain(targetChainId)
      const walletSigner = provider.getSigner()
      // console.log('walletProvider', walletProvider)

      await activeWallet.switchChain(targetChainId)

      // const smartAccountWallet = new BiconomySmartAccountV2(walletProvider, {
      //   activeNetworkId: activeChainId,
      //   supportedNetworksIds: biconomySupportedChainIds,
      //   networkConfig: [
      //     {
      //       chainId: 80001,
      //       dappAPIKey: '59fRCMXvk.8a1652f0-b522-4ea7-b296-98628499aee3',
      //     },
      //   ],
      // })
      // console.log('wallet', wallet)

      const bundler: IBundler = new Bundler({
        //https://dashboard.biconomy.io/ get bundler urls from your dashboard
        bundlerUrl: `https://bundler.biconomy.io/api/v2/${targetChainId}/${process.env.NEXT_PUBLIC_BICONOMY_BUNDLER_API_KEY}`,
        chainId: targetChainId,
        entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
      })

      const paymaster: IPaymaster = new BiconomyPaymaster({
        //https://dashboard.biconomy.io/ get paymaster urls from your dashboard
        paymasterUrl:
          targetChainId === ChainId.BASE_MAINNET
            ? (process.env.NEXT_PUBLIC_BICONOMY_PAYMASTER_URL_MAINNET as string)
            : (process.env
                .NEXT_PUBLIC_BICONOMY_PAYMASTER_URL_TESTNET as string),
      })

      // instance of ownership module - this can alternatively be the multi chain module
      const ownerShipModule = await ECDSAOwnershipValidationModule.create({
        signer: walletSigner, // ethers signer object
        moduleAddress: DEFAULT_ECDSA_OWNERSHIP_MODULE,
      })

      const biconomySmartAccount = await BiconomySmartAccountV2.create({
        chainId: ChainId.POLYGON_MUMBAI, //or any chain of your choice
        bundler: bundler, // instance of bundler
        paymaster: paymaster, // instance of paymaster
        entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS, //entry point address for chain
        defaultValidationModule: ownerShipModule, // either ECDSA or Multi chain to start
        activeValidationModule: ownerShipModule, // either ECDSA or Multi chain to start
      })

      const biconomyAccountAddress =
        await biconomySmartAccount.getAccountAddress()

      const { data: smartAccounts } =
        await biconomySmartAccount.getSmartAccountsByOwner({
          index: 0,
          chainId: targetChainId,
          owner: activeWallet.address,
        })
      // console.log(smartAccounts)

      // Wallet initialization to fetch wallet info
      const smartAccount = await biconomySmartAccount.init()
      setSmartAccountWallet(smartAccount)
      console.info('smartAccount', smartAccount)

      // smartAccount.on('txHashGenerated', (response: any) => {
      //   console.log(
      //     'txHashGenerated event received in AddLP via emitter',
      //     response,
      //   )
      // })

      // smartAccount.on('txHashChanged', (response: any) => {
      //   console.log(
      //     'txHashChanged event received in AddLP via emitter',
      //     response,
      //   )
      // })

      // smartAccount.on('txMined', (response: any) => {
      //   console.log('txMined event received in AddLP via emitter', response)
      // })

      // smartAccount.on('error', (response: any) => {
      //   console.log('error event received in AddLP via emitter', response)
      // })

      // get all smart account versions available and update in state

      // setSmartAccountsArray(smartAccounts)
      // // set the first wallet version as default
      // if (smartAccounts.length) {
      //   smartAccount.setSmartAccountVersion(
      //     smartAccounts[0].version as SmartAccountVersion,
      //   )
      //   setSelectedAccount(smartAccounts[0])
      // }

      // get address, isDeployed and other data
      // const state = await smartAccount.getState()
      // setState(state)
      // console.info('getSmartAccountState', state)

      setLoading(false)
      return ''
    } catch (error: any) {
      setLoading(false)
      console.error({ getSmartAccount: error })
      return error.message
    }
  }, [activeWallet, wallets, user, ready, authenticated])

  const getSmartAccountBalance = useCallback(async () => {
    if (!ready || (ready && !authenticated)) return 'Not authenticated'
    if (!user || !user.wallet || !activeWallet || !wallets || !wallets.length)
      return 'No wallet found'
    if (activeWallet.address !== user.wallet.address)
      return 'Privy embedded wallet not active'
    if (!state || !smartAccountWallet) return 'Init Smart Account First'

    const activeChainId = parseInt(activeWallet.chainId)
    // @ts-ignore
    if (!biconomySupportedChainIds.includes(activeChainId))
      return 'Unsupported chain'

    try {
      setIsFetchingBalance(true)
      // ethAdapter could be used like this
      // const bal = await wallet.ethersAdapter().getBalance(state.address);
      // console.log(bal);
      // you may use EOA address my goerli SCW 0x1927366dA53F312a66BD7D09a88500Ccd16f175e
      const balanceParams = {
        chainId: activeChainId,
        eoaAddress: state.address,
        tokenAddresses: [],
      }
      const balFromSdk =
        await smartAccountWallet.getAllTokenBalances(balanceParams)
      console.info('getAllTokenBalances', balFromSdk)

      const usdBalFromSdk =
        await smartAccountWallet.getTotalBalanceInUsd(balanceParams)
      console.info('getTotalBalanceInUsd', usdBalFromSdk)

      setBalance({
        totalBalanceInUsd: usdBalFromSdk.data.totalBalance,
        alltokenBalances: balFromSdk.data,
      })
      setIsFetchingBalance(false)
      return ''
    } catch (error: any) {
      setIsFetchingBalance(false)
      console.error({ getSmartAccountBalance: error })
      return error.message
    }
  }, [
    activeWallet,
    wallets,
    user,
    ready,
    authenticated,
    state,
    smartAccountWallet,
  ])

  useEffect(() => {
    if (smartAccountWallet && selectedAccount) {
      console.log('setSmartAccountVersion', selectedAccount)
      // smartAccountWallet.setSmartAccountVersion(
      //   selectedAccount.version as SmartAccountVersion,
      // )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAccount, smartAccountWallet])

  useEffect(() => {
    // if (!ready || (ready && !authenticated)) return // 'Not authenticated'
    // if (!user || !user.wallet || !activeWallet || !wallets || !wallets.length)
    //   return // 'No wallet found'
    // if (activeWallet.address !== user.wallet.address) return // 'Privy embedded wallet not active'

    // const activeChainId = parseInt(activeWallet.chainId)
    // // @ts-ignore
    // if (!biconomySupportedChainIds.includes(activeChainId)) return // 'Unsupported chain'

    getSmartAccount()
  }, [getSmartAccount, ready, authenticated, user, activeWallet, wallets])

  return (
    <SmartAccountContext.Provider
      value={{
        wallet: smartAccountWallet,
        state,
        balance,
        loading,
        isFetchingBalance,
        selectedAccount,
        smartAccountsArray,
        setSelectedAccount,
        getSmartAccount,
        getSmartAccountBalance,
      }}
    >
      {children}
    </SmartAccountContext.Provider>
  )
}
