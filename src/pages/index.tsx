import { Box, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { useLayoutEffect } from 'react'

export default function IndexPage() {
  const router = useRouter()

  router.replace('/dashboard')

  // useLayoutEffect(() => {
  //   router.replace('/dashboard')
  // }, [router])

  // return (
  //   <Box>
  //     <Typography variant="h4" fontWeight="bold" color="rgb(80, 130, 235)">
  //       Aucentive Home
  //     </Typography>
  //   </Box>
  // )
}
