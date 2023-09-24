import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import type { RootState } from '@/store'

export interface AppState {
  user: {
    jwtToken: string
  }
}

const initialState: AppState = {
  user: {
    jwtToken: '',
  },
}

export const emailSlice = createSlice({
  name: 'email',
  initialState,
  reducers: {
    setUserJwtToken: (state, action: PayloadAction<string>) => {
      state.user.jwtToken = action.payload
    },
  },
})

export const { setUserJwtToken } = emailSlice.actions

export const selectUserJwtToken = (state: RootState) =>
  state.email.user.jwtToken

export default emailSlice.reducer
