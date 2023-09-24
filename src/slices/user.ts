import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import type { RootState } from '@/store'
import type { UserProfile } from '@/types'
import { userApi } from '@/services/user'

export interface UserState {
  profile: UserProfile
}

// Define the initial state using that type
const initialState: UserState = {
  profile: {
    id: '',
    name: '',
    handle: '',
    address: '',
    baselineThreshold: '',
  },
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // updateUserProfile: (state, action: PayloadAction<UserProfile>) => {
    //   // Use spread operator to not erase any existing fields
    //   state.profile = action.payload
    // },
  },
  extraReducers: (builder) => {
    // update user data on `getUser` fetch is successful
    builder.addMatcher(
      userApi.endpoints.getUser.matchFulfilled,
      (state, action) => {
        if (action.payload.error) return

        const userData = action.payload.payload
        if (!userData) return

        state.profile = userData
      },
    )
  },
})

// export const { updateUserProfile } = userSlice.actions

export const selectUserProfile = (state: RootState) => state.user.profile

export default userSlice.reducer
