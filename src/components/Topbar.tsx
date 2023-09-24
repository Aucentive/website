import { Box, Breadcrumbs, Link, Stack, Typography } from '@mui/material'
import { usePrivy } from '@privy-io/react-auth'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const breadcrumbNameMap: Record<string, string> = {
  '/dashboard': 'Dashboard',
}

export function Topbar() {
  const router = useRouter()

  const { ready, authenticated, user } = usePrivy()

  if (!ready || !authenticated || !user) {
    return (
      <Typography
        variant="h5"
        fontWeight="bold"
        color="rgb(80, 130, 235)"
        textAlign="center"
      >
        Aucentive
      </Typography>
    )
  }

  const pathnames = router.pathname.split('/').filter((x) => x)
  const showHome = pathnames[0] !== 'intro' && pathnames[0] !== 'auth'

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      py={2}
      px={{ xs: 10, md: 11 }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <NextLink href="/">
          <Typography variant="h5" fontWeight="bold" color="rgb(80, 130, 235)">
            Aucentive
          </Typography>
        </NextLink>
        <Breadcrumbs>
          {showHome && (
            <Link
              component={NextLink}
              underline="hover"
              color="inherit"
              href="/"
            >
              Home
            </Link>
          )}
          {pathnames.map((value, index) => {
            const last = index === pathnames.length - 1
            const to = `/${pathnames.slice(0, index + 1).join('/')}`

            return last ? (
              <Typography color="text.primary" key={to}>
                {breadcrumbNameMap[to]}
              </Typography>
            ) : (
              <Link
                component={NextLink}
                underline="hover"
                color="inherit"
                href={to}
                key={to}
              >
                {breadcrumbNameMap[to]}
              </Link>
            )
          })}
        </Breadcrumbs>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography variant="body2" color="#777">
            {user.email?.address || user.google?.email || ''}
          </Typography>
        </Stack>
      </Stack>
    </Box>
  )
}
