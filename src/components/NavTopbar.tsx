import { Stack } from '@mui/material'
import { useRouter } from 'next/router'

import { GotoLinkButton } from '@/components'

export function NavTopbar() {
  const router = useRouter()

  const { pathname } = router

  return (
    <Stack direction="row" spacing={1} mt={2} mb={4}>
      <GotoLinkButton
        href="/dashboard"
        className={pathname == '/dashboard' ? 'active' : ''}
      >
        Dashboard
      </GotoLinkButton>
      <GotoLinkButton
        href="/chat"
        className={pathname == '/chat' ? 'active' : ''}
      >
        Chat
      </GotoLinkButton>
      <GotoLinkButton
        href="/email"
        className={pathname == '/email' ? 'active' : ''}
      >
        Email
      </GotoLinkButton>
      <GotoLinkButton
        href="/privy"
        className={pathname == '/privy' ? 'active' : ''}
      >
        Privy
      </GotoLinkButton>
    </Stack>
  )
}
