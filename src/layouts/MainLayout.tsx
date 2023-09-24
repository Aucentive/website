import { Box } from '@mui/material'

export function MainLayout({
  children,
}: React.PropsWithChildren) {
  return (
    <Box
      height="100vh"
      maxHeight="100vh"
      overflow="hidden"
      pt={8}
      pb={3}
      px={5}
    >
      {children}
    </Box>
  )
}