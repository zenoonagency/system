export type Priority = 'Baixa' | 'Média' | 'Alta' | 'Urgente';

export interface Card {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  dueDate: string;
  customFields?: Record<string, string>;
}

export interface List {
  id: string;
  title: string;
  cards: Card[];
}

export interface KanbanStore {
  lists: List[];
  addList: (title: string) => void;
  updateList: (id: string, title: string) => void;
  deleteList: (id: string) => void;
  addCard: (listId: string, card: Omit<Card, 'id'>) => void;
  updateCard: (listId: string, cardId: string, card: Partial<Card>) => void;
  deleteCard: (listId: string, cardId: string) => void;
  duplicateCard: (listId: string, cardId: string) => void;
  moveCard: (cardId: string, sourceListId: string, targetListId: string) => void;
}