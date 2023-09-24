import { useLastMessage, type CachedConversation } from '@xmtp/react-sdk'
import { ConversationPreview } from '@xmtp/react-components'

interface ConversationCardProps {
  conversation: CachedConversation
  isSelected: boolean
  onConversationClick?: (conversation: CachedConversation) => void
}

export function ConversationCard({
  conversation,
  onConversationClick,
  isSelected,
}: ConversationCardProps) {
  const lastMessage = useLastMessage(conversation.topic)

  return (
    <ConversationPreview
      key={conversation.topic}
      // @ts-ignore
      conversation={conversation}
      isSelected={isSelected}
      // @ts-ignore
      onClick={onConversationClick}
      lastMessage={lastMessage}
    />
  )
}
