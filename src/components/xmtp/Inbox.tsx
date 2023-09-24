import { useCallback, useState } from 'react'
import { type CachedConversation } from '@xmtp/react-sdk'
import {
  // ArrowRightOnRectangleIcon,
  PlusCircleIcon,
} from '@heroicons/react/24/outline'

import { Conversations } from './Conversations'
import { Messages } from './Messages'
import { NewMessage } from './NewMessage'
import { NoSelectedConversationNotification } from './NoSelectedConversationNotification'
import { Box } from '@mui/material'

export function Inbox() {
  const [selectedConversation, setSelectedConversation] = useState<
    CachedConversation | undefined
  >(undefined)
  const [isNewMessage, setIsNewMessage] = useState(false)

  const handleConversationClick = useCallback((convo: CachedConversation) => {
    setSelectedConversation(convo)
    setIsNewMessage(false)
  }, [])

  const handleStartNewConversation = useCallback(() => {
    setIsNewMessage(true)
  }, [])

  const handleStartNewConversationSuccess = useCallback(
    (convo?: CachedConversation) => {
      setSelectedConversation(convo)
      setIsNewMessage(false)
    },
    [],
  )

  return (
    <Box p={2} maxWidth={900} borderRadius={12} bgcolor="rgb(221, 214, 254)">
      <div className="Inbox">
        <div className="InboxHeader">
          {/* <div className="InboxHeader__xmtp">
          <img src="/xmtp-icon.png" alt="XMTP logo" width="32" />
        </div> */}
          <div className="InboxHeader__actions">
            <button
              className="Button"
              type="button"
              onClick={handleStartNewConversation}
            >
              <PlusCircleIcon width={24} /> New message
            </button>
            {/* <button
            className="Button Button--secondary"
            type="button"
            onClick={handleDisconnect}
          >
            <ArrowRightOnRectangleIcon width={24} /> Disconnect
          </button> */}
          </div>
        </div>
        <div className="InboxConversations">
          <div className="InboxConversations__list">
            <Conversations
              onConversationClick={handleConversationClick}
              selectedConversation={selectedConversation}
            />
          </div>
          <div className="InboxConversations__messages">
            {isNewMessage ? (
              <NewMessage onSuccess={handleStartNewConversationSuccess} />
            ) : selectedConversation ? (
              <Messages conversation={selectedConversation} />
            ) : (
              <NoSelectedConversationNotification
                onStartNewConversation={handleStartNewConversation}
              />
            )}
          </div>
        </div>
      </div>
    </Box>
  )
}
