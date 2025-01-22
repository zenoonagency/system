// src/pages/Clients/types.ts
export type Priority = 'low' | 'medium' | 'high';

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Card {
  id: string;
  title: string;
  description?: string;
  value: number;
  phone?: string;
  tagIds: string[];
  customFields: Record<string, { type: string; value: string }>;
  createdAt: string;
  updatedAt: string;
  scheduledDate?: string;
  scheduledTime?: string;
  responsibleId?: string;
}


export interface List {
  id: string;
  title: string;
  cards: Card[];
}

export interface Board {
  id: string;
  title: string;
  lists: List[];
  hidden?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface KanbanState {
  boards: Board[];
  activeBoard: string | null;
  addBoard: (title: string) => void;
  updateBoard: (id: string, title: string) => void;
  deleteBoard: (id: string) => void;
  duplicateBoard: (id: string) => void;
  toggleBoardVisibility: (id: string) => void;
  addList: (boardId: string, title: string) => void;
  updateList: (boardId: string, listId: string, title: string) => void;
  deleteList: (boardId: string, listId: string) => void;
  duplicateList: (boardId: string, listId: string) => void;
  addCard: (boardId: string, listId: string, card: Omit<Card, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCard: (boardId: string, listId: string, cardId: string, updates: Partial<Card>) => void;
  deleteCard: (boardId: string, listId: string, cardId: string) => void;
  duplicateCard: (boardId: string, listId: string, cardId: string) => void;
  moveCard: (cardId: string, sourceListId: string, targetListId: string) => void;
  setActiveBoard: (boardId: string | null) => void;
}
