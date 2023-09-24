import {
  useConversations,
  useMessages,
  useStreamConversations,
} from '@xmtp/react-sdk'
import type { CachedConversation } from '@xmtp/react-sdk'
import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline'
import {
  ConversationList,
  ConversationPreviewCard,
} from '@xmtp/react-components'

import { ConversationCard } from '@/components/xmtp/ConversationCard'
import { Notification } from '@/components/xmtp/Notification'

type ConversationsProps = {
  selectedConversation?: CachedConversation
  onConversationClick?: (conversation: CachedConversation) => void
}

const NoConversations: React.FC = () => (
  <Notification icon={<ChatBubbleLeftIcon />} title="No conversations found">
    It looks like you don&rsquo;t have any conversations yet. Create one to get
    started
  </Notification>
)

function ConversationCardWrapper({
  conversation,
  onConversationClick,
  selectedConversation,
}: ConversationsProps & { conversation: CachedConversation }) {
  const { messages, isLoading } = useMessages(conversation)

  return (
    <ConversationPreviewCard
      key={conversation.topic}
      text={
        messages.length > 0
          ? messages[messages.length - 1]?.content // last message as preview
          : conversation.topic || ''
      }
      isSelected={conversation.topic === selectedConversation?.topic}
      onClick={() => {
        if (!!onConversationClick) onConversationClick(conversation)
      }}
    />
  )
}

export function Conversations({
  onConversationClick,
  selectedConversation,
}: ConversationsProps) {
  const { conversations, isLoading } = useConversations()
  useStreamConversations()

  const previews = conversations.map((conversation) => (
    <ConversationCardWrapper
      key={conversation.topic}
      conversation={conversation}
      onConversationClick={onConversationClick}
    />
  ))

  return (
    <ConversationList
      isLoading={isLoading}
      conversations={previews}
      renderEmpty={<NoConversations />}
    />
  )
}
