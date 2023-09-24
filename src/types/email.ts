export enum EmailStatus {
  PENDING_REGISTRATION, // email is pending recipient's registration on platform (to generate address)
  RECEIVED, // email is received (first stage)
  PAID, // email is received & paid (second stage), not yet delivered
  EVALUATING, // email is delivered and being evaluated by recipient (second stage, after some money is deposited)
  ACCEPTED, // email is accepted (replied to)
  REJECTED, // email is rejected (expired or insufficient funds)
  FLAGGED // email is flagged (e.g. spam)
}

export enum ServiceStatus {
  PENDING_PAYMENT, // pending payment from sender (could be from anyone)
  PENDING_COMPLETION, // pending work/reply from recipient (so, already sent to user)
  CANCELLED, // cancelled
  INVALIDATED, // invalidated by system
  FAILED, // failed to deliver (for whatever reason)
  COMPLETED // recipient has replied to email or executed services
}

// export type EmailData = {
//   id: string
//   sender: string
//   recipient: string
//   contentText: string
//   contextHtml: string
//   attachments: any[]
//   status: EmailStatus
//   createdAt: number
// }
