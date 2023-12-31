import { Box, SxProps} from '@mui/material'
import { PropsWithChildren } from 'react'

export function ShadowedBox(props: PropsWithChildren & { sx?: SxProps }) {
  return (
    <Box
			py={1.5}
			px={2}
			borderRadius={2}
			border="1px solid #fafafa"
			boxShadow="0 0 20px 1px rgba(130, 130, 130, 0.05)"
      sx={props.sx}
		>
			{props.children}
		</Box>
  )
}
