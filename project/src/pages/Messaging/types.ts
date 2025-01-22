export interface Contact {
  id: string;
  name: string;
  phone: string;
  tagIds?: string[];
}

export interface MessageBatch {
  id: string;
  context: string;
  messages: string[];
  contacts: Contact[];
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  progress: number;
  sentCount: number;
  failedCount: number;
  createdAt: string;
  completedAt?: string;
}

export interface MessagingState {
  batches: MessageBatch[];
  selectedContacts: string[];
  addBatch: (context: string, messages: string[], contacts: Contact[]) => void;
  updateBatchProgress: (id: string, progress: number, status: MessageBatch['status']) => void;
  completeBatch: (id: string, sentCount: number, failedCount: number) => void;
  removeBatch: (id: string) => void;
  setSelectedContacts: (contactIds: string[]) => void;
  clearSelectedContacts: () => void;
}