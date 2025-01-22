import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ConversationState } from '../types';
import { generateId } from '../../../utils/generateId';

export const useConversationStore = create<ConversationState>()(
  persist(
    (set) => ({
      conversations: [],
      activeConversationId: null,
      messages: {},

      setActiveConversation: (id) =>
        set({ activeConversationId: id }),

      addMessage: (conversationId, message) =>
        set((state) => {
          const newMessage = { ...message, id: generateId() };
          const updatedMessages = {
            ...state.messages,
            [conversationId]: [...(state.messages[conversationId] || []), newMessage],
          };

          return {
            messages: updatedMessages,
            conversations: state.conversations.map((conv) =>
              conv.id === conversationId
                ? {
                    ...conv,
                    lastMessage: newMessage,
                    unreadCount: !message.isAgent ? conv.unreadCount + 1 : conv.unreadCount,
                  }
                : conv
            ),
          };
        }),

      markAsRead: (conversationId) =>
        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === conversationId
              ? { ...conv, unreadCount: 0 }
              : conv
          ),
        })),

      takeControl: (conversationId) =>
        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === conversationId
              ? { ...conv, controlledByHuman: true }
              : conv
          ),
        })),

      returnControl: (conversationId) =>
        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === conversationId
              ? { ...conv, controlledByHuman: false }
              : conv
          ),
        })),
    }),
    {
      name: 'conversation-store',
    }
  )
);