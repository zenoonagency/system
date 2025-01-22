export interface Message {
  id: string;
  content: string;
  timestamp: string;
  senderId: string;
  isAgent: boolean;
}

export interface Conversation {
  id: string;
  customerName: string;
  customerPhone: string;
  lastMessage: Message;
  isOnline: boolean;
  unreadCount: number;
  controlledByHuman: boolean;
}

export interface ConversationState {
  conversations: Conversation[];
  activeConversationId: string | null;
  messages: Record<string, Message[]>;
  setActiveConversation: (id: string | null) => void;
  addMessage: (conversationId: string, message: Omit<Message, 'id'>) => void;
  markAsRead: (conversationId: string) => void;
  takeControl: (conversationId: string) => void;
  returnControl: (conversationId: string) => void;
}