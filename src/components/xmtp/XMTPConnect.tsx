import { LinkIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { usePrivy, useWallets } from '@privy-io/react-auth'
import { usePrivyWagmi } from '@privy-io/wagmi-connector'
import { useClient } from '@xmtp/react-sdk'
import { useCallback } from 'react'

import { Notification } from '@/components/xmtp/Notification'

type XMTPConnectButtonProps = {
  label: string
}

const XMTPConnectButton: React.FC<XMTPConnectButtonProps> = ({ label }) => {
  const { initialize } = useClient()
  const { user, ready, authenticated } = usePrivy()
  const { wallet: activeWallet, setActiveWallet } = usePrivyWagmi()
  const { wallets } = useWallets()

  const handleConnect = useCallback(async () => {
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

    void initialize({
      signer: walletSigner,
      options: {
        env: 'production',
      },
    })
  }, [activeWallet, wallets, user, ready, authenticated])

  return (
    <button className="Button" type="button" onClick={handleConnect}>
      {label}
    </button>
  )
}

export const XMTPConnect: React.FC = () => {
  const { isLoading, error } = useClient()

  if (error) {
    return (
      <Notification
        icon={<ExclamationTriangleIcon />}
        title="Could not connect to XMTP"
        cta={<XMTPConnectButton label="Try again" />}
      >
        Something went wrong
      </Notification>
    )
  }

  if (isLoading) {
    return (
      <Notification icon={<LinkIcon />} title="Connecting to XMTP">
        Awaiting signatures...
      </Notification>
    )
  }

  return (
    <Notification
      icon={<LinkIcon />}
      title="XMTP not connected"
      cta={<XMTPConnectButton label="Connect" />}
    >
      Connect to XMTP to continue
    </Notification>
  )
}
