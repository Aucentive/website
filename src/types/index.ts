export * from './email'
export * from './user'

export type FTUserData = {
  id: number
  address: string
  twitterUsername: string
  twitterName: string
  twitterPfpUrl: string
  twitterUserId: string
  lastOnline: string
  lastMessageTime: string
  holderCount: number
  holdingCount: number
  watchlistCount: number
  shareSupply: number
  displayPrice: string
  lifetimeFeesCollectedInWei: string
}

export type FTUserTokenHolder = {
  id: number
  address: string
  twitterUsername: string
  twitterName: string
  twitterPfpUrl: string
  twitterUserId: string
  lastOnline: number
  balance: string
}
