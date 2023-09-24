import { Stack } from '@mui/material'
import { useRouter } from 'next/router'

import { Navbar } from '@/components'

export function BodyLayout({ children }: React.PropsWithChildren) {
  const router = useRouter()

  const showNavbar = !router.pathname.startsWith('/auth')

  return (
    <Stack
      position="relative"
      height="100%"
      bgcolor="#fff"
      borderRadius={6}
      py={{ xs: 2, sm: 3 }}
      px={{ xs: 4, sm: 6 }}
      direction="column"
      alignItems="stretch"
      justifyContent="flex-start"
      spacing={5}
      overflow="auto"
    >
      <Navbar isHidden={!showNavbar} />
      {children}
    </Stack>
  )
}
