import * as crypto from 'crypto'

export * from './misc'

export const sha256 = (msg: string) =>
  crypto.createHash('sha256').update(msg).digest('hex')
