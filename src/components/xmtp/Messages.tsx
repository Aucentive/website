import { useMessages, useSendMessage, useStreamMessages } from '@xmtp/react-sdk'
import type { CachedConversation } from '@xmtp/react-sdk'
import {
  AddressInput,
  Messages as MessagesList,
  MessageInput,
} from '@xmtp/react-components'
import { useClient } from '@xmtp/react-sdk'
import { useCallback, useEffect, useRef, useState } from 'react'

// import { useXMTPClient } from '@/components/context/XMTPClientContext'

interface ConversationMessagesProps {
  conversation: CachedConversation
}

export function Messages({ conversation }: ConversationMessagesProps) {
  const [isSending, setIsSending] = useState(false)
  const messageInputRef = useRef<HTMLTextAreaElement>(null)
  const { messages, isLoading } = useMessages(conversation)
  const { client } = useClient()

  // console.log(isLoading, messages)

  // message:
  // content: "gm fam 💫"
  // contentBytes: undefined
  // contentFallback: undefined
  // contentType: "xmtp.org/text:1.0"
  // conversationTopic: "/xmtp/0/m-d31e06fbbf2abf5e93d5fd608fd54668910bb63b9664b61ba0d805693a07517c/proto"
  // hasLoadError: false
  // hasSendError: false
  // id: 22
  // isSending: false
  // senderAddress: "0x937C0d4a6294cdfa575de17382c7076b579DC176"
  // sentAt: Sun Sep 24 2023 04:44:50 GMT-0400 (Eastern Daylight Time) {}
  // status: "processed"
  // uuid: "20adc755-b9b3-4eb2-a2a7-e01c88739b48"
  // walletAddress: "0x20253402D34711F4ae9a06F369dcC6A72516439A"
  // xmtpID: "ff7e35ba9eecf4ad7ef11785143afec3f28ff45b1505b0fdb1a52ba4cdad351f"

  useStreamMessages(conversation)
  const { sendMessage } = useSendMessage()

  const handleSendMessage = useCallback(
    async (message: string) => {
      setIsSending(true)
      await sendMessage(conversation, message)
      setIsSending(false)
      // ensure focus of input by waiting for a browser tick
      setTimeout(() => messageInputRef.current?.focus(), 0)
    },
    [conversation, sendMessage],
  )

  useEffect(() => {
    messageInputRef.current?.focus()
  }, [conversation])

  return (
    <>
      <AddressInput
        value={conversation.peerAddress}
        // avatarUrlProps={{ address: conversation.peerAddress }}
      />
      <MessagesList
        // conversation={conversation}
        isLoading={isLoading}
        // @ts-ignore
        messages={messages
          .filter((message) => message.content !== undefined)
          .map((message) => ({
            ...message,
            contentTopic: {},
            sent: message.sentAt,
          }))
          .reverse()}
        clientAddress={client?.address || '0x0'}
      />
      <div className="MessageInputWrapper">
        <MessageInput
          isDisabled={isSending}
          onSubmit={handleSendMessage}
          ref={messageInputRef}
        />
      </div>
    </>
  )
}
