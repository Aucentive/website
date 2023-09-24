import { Box, Button } from '@mui/material'
import { usePrivy } from '@privy-io/react-auth'
import { useClient } from '@xmtp/react-sdk'

import { Inbox } from '@/components/xmtp/Inbox'
// import { useXMTPClient } from '@/components/context/XMTPClientContext'
import { XMTPConnect } from '@/components/xmtp/XMTPConnect'

export const XMTPContentRouter = () => {
  const { ready, authenticated } = usePrivy()
  const { client } = useClient()

  if (!ready || (ready && !authenticated)) {
    return <></>
  }

  if (!client) {
    return <XMTPConnect />
  }

  return <Inbox />
}

// export function XMTPContentRouter() {
//   const { ready, authenticated } = usePrivy()
//   // const { client, isLoading, initClient } = useXMTPClient()

//   if (!ready || (ready && !authenticated)) {
//     return <></>
//   }

//   console.log(client, isLoading)
//   if (!client || isLoading) {
//     return (
//       <Box>
//         <Button variant="outlined" onClick={initClient}>
//           Connect to XMTP
//         </Button>
//       </Box>
//     )
//   }

//   return <Inbox />
// }
