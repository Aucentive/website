import { usePrivyWagmi } from '@privy-io/wagmi-connector'
import { usePrivy, useWallets } from '@privy-io/react-auth'
import {
  AttachmentCodec,
  RemoteAttachmentCodec,
} from '@xmtp/content-type-remote-attachment'
import { ReplyCodec } from '@xmtp/content-type-reply'
import { ReactionCodec } from '@xmtp/content-type-reaction'
import { ReadReceiptCodec } from '@xmtp/content-type-read-receipt'
import { Client } from '@xmtp/xmtp-js'
import {
  createContext,
  useState,
  ReactElement,
  useEffect,
  useContext,
  useCallback,
} from 'react'
import { useWalletClient } from 'wagmi'
import { Signer } from 'ethers'

type XMTPClientContextValue = {
  client: Client | null
  isLoading: boolean
  initClient: () => Promise<void>
  setClient: (client: Client | null) => void
  canMessage: (address: string) => Promise<boolean>
}

export const XMTPClientContext = createContext<XMTPClientContextValue>({
  client: null,
  isLoading: true,
  initClient: async () => {
    return
  },
  setClient: () => {
    return
  },
  canMessage: async () => false,
})

export const useXMTPClient = () => useContext(XMTPClientContext)

export function XMTPClientProvider({
  children,
}: {
  children: ReactElement
}): ReactElement {
  const [client, setClient] = useState<Client | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const { user, ready, authenticated } = usePrivy()
  const { wallet: activeWallet, setActiveWallet } = usePrivyWagmi()
  const { wallets } = useWallets()

  const initClient = useCallback(async () => {
    if (!ready || (ready && !authenticated)) return
    if (!activeWallet || !wallets || !user || !user.wallet) return

    console.log(wallets[0].address, user.wallet.address)

    if (activeWallet.address !== user.wallet.address) {
      console.log('Privy embedded wallet not active')
      // console.log('Active wallet: ', activeWallet.address)
      // console.log('User wallet: ', user.wallet.address)

      for (const wallet of wallets) {
        if (wallet.address === user.wallet.address) {
          setActiveWallet(wallet)
          break
        }
      }
      return
    }

    const provider = await activeWallet.getEthersProvider()
    const walletSigner = provider.getSigner()

    // console.log('connecting to client', await walletSigner.getAddress())
    const client = await Client.create(walletSigner, {
      env: 'production',
    })

    // console.log('client', client)

    client.registerCodec(new AttachmentCodec())
    client.registerCodec(new RemoteAttachmentCodec())
    client.registerCodec(new ReplyCodec())
    client.registerCodec(new ReactionCodec())
    client.registerCodec(new ReadReceiptCodec())

    setClient(client)
    setIsLoading(false)
  }, [activeWallet, wallets, user, ready, authenticated])

  const clientContextValue = {
    client,
    isLoading,
    canMessage: client?.canMessage || (() => Promise.resolve(false)),
    initClient,
    setClient,
  }

  return (
    <XMTPClientContext.Provider value={clientContextValue}>
      {children}
    </XMTPClientContext.Provider>
  )
}
