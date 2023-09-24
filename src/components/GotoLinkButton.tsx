import { Box } from '@mui/material'
import { styled } from '@mui/material/styles'
import NextLink from 'next/link'

export const GotoLinkButton = styled(NextLink)(({ theme }) => ({
  display: 'block',
  width: 'full',
  minWidth: 80,
  padding: '8px 12px',
  color: 'rgb(109 40 217)',
  border: '1px solid rgb(109 40 217)',
  borderRadius: 12,
  boxShadow: '0 0 20px 1px rgba(130,130,130,0.05)',
  textAlign: 'center',
  textDecoration: 'none',
  transition: 'all 0.2s ease-in-out',
  cursor: 'pointer',
  '&:not(.active):hover': {
    // borderColor: theme.palette.primary.main,
    color: 'rgb(109 40 217)',
    borderColor: 'rgb(139 92 246)',
    backgroundColor: 'rgb(221 214 254)',
  },
  '&.active': {
    color: '#fff',
    borderColor: 'rgb(139 92 246)',
    backgroundColor: 'rgb(139 92 246)',
  }
}))

export const GotoLinkButtonForModal = styled(Box)(({ theme }) => ({
  display: 'block',
  width: 'full',
  minWidth: 80,
  padding: '8px 12px',
  color: 'rgb(109 40 217)',
  border: '1px solid rgb(109 40 217)',
  borderRadius: 12,
  boxShadow: '0 0 20px 1px rgba(130,130,130,0.05)',
  textAlign: 'center',
  textDecoration: 'none',
  transition: 'all 0.2s ease-in-out',
  cursor: 'pointer',
  '&:not(.active):hover': {
    // borderColor: theme.palette.primary.main,
    color: 'rgb(109 40 217)',
    borderColor: 'rgb(139 92 246)',
    backgroundColor: 'rgb(221 214 254)',
  },
  '&.active': {
    color: '#fff',
    borderColor: 'rgb(139 92 246)',
    backgroundColor: 'rgb(139 92 246)',
  }
}))
