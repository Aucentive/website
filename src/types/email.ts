export enum EmailStatus {
  PENDING_REGISTRATION, // email is pending recipient's registration on platform (to generate address)
  RECEIVED, // email is received (first stage)
  EVALUATING, // email is delivered and being evaluated by recipient (second stage, after some money is deposited)
  ACCEPTED, // email is accepted (replied to)
  REJECTED, // email is rejected (expired or insufficient funds)
  FLAGGED // email is flagged (e.g. spam)
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
