import { useCallback } from 'react';
import { useWebSocket } from '../../../hooks/useWebSocket';
import { useConversationStore } from '../store/conversationStore';
import { Message } from '../types';
import { generateId } from '../../../utils/generateId';

export function useChat() {
  const { addMessage, activeConversationId } = useConversationStore();

  const handleWebSocketMessage = useCallback((data: any) => {
    if (data.type === 'message' && data.conversationId) {
      const message: Message = {
        id: generateId(),
        content: data.content,
        timestamp: new Date().toISOString(),
        senderId: data.senderId,
        isAgent: data.isAgent,
      };
      addMessage(data.conversationId, message);
    }
  }, [addMessage]);

  const { sendMessage, isConnected } = useWebSocket({
    onMessage: handleWebSocketMessage,
    onError: (error) => console.error('Chat WebSocket error:', error),
    onConnected: () => console.log('Chat WebSocket connected'),
    onDisconnected: () => console.log('Chat WebSocket disconnected'),
  });

  const sendChatMessage = useCallback((content: string) => {
    if (!activeConversationId || !isConnected) return;

    const messageData = {
      type: 'send_message',
      conversationId: activeConversationId,
      content,
      timestamp: new Date().toISOString(),
    };

    return sendMessage(messageData);
  }, [activeConversationId, sendMessage, isConnected]);

  return { sendChatMessage, isConnected };
}