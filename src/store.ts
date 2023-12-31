import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/dist/query'
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import thunk from 'redux-thunk'

import emailReducer from '@/slices/email'
import userReducer from '@/slices/user'
import { emailApi } from '@/services/email'
import { serviceApi } from '@/services/service'
import { userApi } from '@/services/user'

// Strongly recommended to blacklist any api(s) that you have configured with RTK Query.
// If the api slice reducer is not blacklisted, the api cache will be automatically persisted and
// restored which could leave you with phantom subscriptions from components that do not exist any more.
const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  blacklist: [emailApi.reducerPath, serviceApi.reducerPath, userApi.reducerPath],
}

const reducers = combineReducers({
  email: emailReducer,
  user: userReducer,
  // survey: surveyReducer,
  // API reducers
  [emailApi.reducerPath]: emailApi.reducer,
  [serviceApi.reducerPath]: serviceApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
})

const persistedReducer = persistReducer(persistConfig, reducers)

const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NEXT_PUBLIC_NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) => {
    return (
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      })
        .concat(thunk)
        // redux toolkit query middleware (auto generated)
        .concat(emailApi.middleware)
        .concat(serviceApi.middleware)
        .concat(userApi.middleware)
    )
  },
  // purge any persisted state by adding an extra reducer to the specific slice that you would like to clear
  // when calling persistor.purge(). This is especially helpful when you are looking to clear persisted state
  // on a dispatched logout action.
  // extraReducers: (builder) => {
  //   builder.addCase(PURGE, (state) => {
  //     customEntityAdapter.removeAll(state)
  //   })
  // },
})

setupListeners(store.dispatch)

export default store

export const persistor = persistStore(store)

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>

// Inferred type: { ...reducers }
export type AppDispatch = typeof store.dispatch
