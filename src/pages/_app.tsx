import { ThemeProvider } from '@mui/material/styles'
import { PrivyProvider } from '@privy-io/react-auth'
import { PrivyWagmiConnector } from '@privy-io/wagmi-connector'
import axios from 'axios'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Provider as StoreProvider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { ToastContainer } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'
import '@/styles/global.css'

import { wagmiChainsConfig } from '@/config/wagmi'
import store, { persistor } from '@/store'
import customTheme from '@/theme'
import { BiconomySmartAccountProvider } from '@/components/context/SmartAccountContext'

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
              </BiconomySmartAccountProvider>
            </PrivyWagmiConnector>
          </PrivyProvider>
        </PersistGate>
      </StoreProvider>
    </>
  )
}
