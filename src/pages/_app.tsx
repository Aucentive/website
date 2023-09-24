import { ThemeProvider } from '@mui/material/styles'
import { PrivyProvider } from '@privy-io/react-auth'
import { PrivyWagmiConnector } from '@privy-io/wagmi-connector'
import {
  XMTPProvider,
  attachmentContentTypeConfig,
  reactionContentTypeConfig,
  readReceiptContentTypeConfig,
  replyContentTypeConfig,
} from '@xmtp/react-sdk'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Provider as StoreProvider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { ToastContainer } from 'react-toastify'

import '@xmtp/react-components/styles.css'
import 'react-toastify/dist/ReactToastify.css'
import '@/styles/global.css'

// xmtp
import '@/components/xmtp/Inbox.css'
import '@/components/xmtp/Messages.css'
import '@/components/xmtp/NewMessage.css'
import '@/components/xmtp/Notification.css'

import { wagmiChainsConfig } from '@/config/wagmi'
import store, { persistor } from '@/store'
import customTheme from '@/theme'
import { BiconomySmartAccountProvider } from '@/components/context/SmartAccountContext'

const xmtpDbVersion = 1
const xmtpContentTypeConfigs = [
  attachmentContentTypeConfig,
  reactionContentTypeConfig,
  readReceiptContentTypeConfig,
  replyContentTypeConfig,
]

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()

  return (
    <>
      <Head>
        {/* viewport can't be in _document.tsx, per https://nextjs.org/docs/messages/no-document-viewport-meta */}
        <meta name="viewport" content="viewport-fit=cover" />
      </Head>
      <StoreProvider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <PrivyProvider
            appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ''}
            config={{
              loginMethods: ['email', 'google', 'apple'], // use embedded 'wallet'
              appearance: {
                theme: 'light',
                accentColor: '#676FFF',
                // logo: 'https://your-logo-url',
              },
              embeddedWallets: {
                // AHHHHH - NEED for XMTP's two-signing-in-a-row (create identity & enable identity)
                noPromptOnSignature: true,
              },
            }}
            onSuccess={(user, isNewUser) => {
              // const userEmail = user.email?.address || user.google?.email || null
              // if (isNewUser && userEmail) {
              //   axios.post('http://localhost:8080/user/profile')
              // }
              router.push('/dashboard')
            }}
          >
            <PrivyWagmiConnector wagmiChainsConfig={wagmiChainsConfig}>
              <BiconomySmartAccountProvider>
                <XMTPProvider
                  dbVersion={xmtpDbVersion}
                  contentTypeConfigs={xmtpContentTypeConfigs}
                >
                  <ThemeProvider theme={customTheme}>
                    <Component {...pageProps} />
                    <ToastContainer
                      position="top-right"
                      autoClose={5000}
                      hideProgressBar={false}
                      newestOnTop={false}
                      closeOnClick
                      rtl={false}
                      // pauseOnFocusLoss
                      draggable
                      pauseOnHover
                      theme="dark"
                    />
                  </ThemeProvider>
                </XMTPProvider>
              </BiconomySmartAccountProvider>
            </PrivyWagmiConnector>
          </PrivyProvider>
        </PersistGate>
      </StoreProvider>
    </>
  )
}
