import { CircularProgress, Stack, Typography } from '@mui/material'

export function LoadingScreen() {
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      position="fixed"
      top={0}
      right={0}
      bottom={0}
      left={0}
      height="100vh"
      width="100vw"
      bgcolor="#EFF1FD"
      zIndex={99999}
    >
      <Typography
        variant="h4"
        fontWeight="bold"
        pb={4}
        color="rgb(124, 58, 237)" // #7C3AED
      >
        Aucentive
      </Typography>
      <CircularProgress size={60} thickness={5} sx={{ mt: 2, mb: 10 }} />
    </Stack>
  )
}
