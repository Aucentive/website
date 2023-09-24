import { Box } from '@mui/material'
import { styled } from '@mui/material/styles'
import NextLink from 'next/link'

export const GotoLinkButton = styled(NextLink)(({ theme }) => ({
  display: 'block',
  width: 'full',
  padding: '12px 24px',
  border: '1px solid #e3e4e5',
  borderRadius: 12,
  boxShadow: '0 0 20px 1px rgba(130,130,130,0.05)',
  textAlign: 'center',
  textDecoration: 'none',
  color: 'inherit',
  transition: 'border-color 0.2s ease-in-out',
  cursor: 'pointer',
  '&:hover': {
    borderColor: theme.palette.primary.main,
  },
}))

export const GotoLinkButtonForModal = styled(Box)(({ theme }) => ({
  display: 'block',
  width: 'full',
  padding: '12px 24px',
  border: '1px solid #e3e4e5',
  borderRadius: 12,
  boxShadow: '0 0 20px 1px rgba(130,130,130,0.05)',
  textAlign: 'center',
  textDecoration: 'none',
  color: 'inherit',
  transition: 'border-color 0.2s ease-in-out',
  cursor: 'pointer',
  '&:hover': {
    borderColor: theme.palette.primary.main,
  },
}))
