import React from 'react'
import { Html, Head, Main, NextScript } from 'next/document'

const meta = {
  title: 'Aucentive',
  description: '',
}

export default function AppDocument() {
  return (
    <Html lang="en">
      <Head>
        <meta name="robots" content="follow, index" />
        <meta name="description" content={meta.description} />
        {/* PWA primary color */}
        {/* <meta name='theme-color' content={theme.palette.primary.main} /> */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
