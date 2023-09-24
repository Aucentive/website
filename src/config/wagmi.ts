import * as chains from '@wagmi/chains'
import { configureChains } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'

// export const supportedChains = [chains.baseGoerli, chains.arbitrumGoerli]
export const supportedChains = [chains.baseGoerli, chains.arbitrumGoerli, chains.polygonMumbai]

export const supportedChainIds = supportedChains.map((chain) => chain.id)

export const wagmiChainsConfig = configureChains(
  supportedChains,
  [publicProvider()],
)
