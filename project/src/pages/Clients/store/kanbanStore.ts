// src/pages/Clients/store/kanbanStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Board, Card, List } from '../types';
import { generateId } from '../../../utils/generateId';

interface ExtendedBoard extends Board {
  completedListId?: string;
}

interface KanbanState {
  boards: ExtendedBoard[];
  activeBoard: string | null;
  setActiveBoard: (boardId: string) => void;
  addBoard: (board: Board) => void;
  updateBoard: (boardId: string, updates: Partial<Board>) => void;
  deleteBoard: (boardId: string) => void;
  duplicateBoard: (boardId: string) => void;
  toggleBoardVisibility: (boardId: string) => void;
  addList: (boardId: string, list: List) => void;
  updateList: (boardId: string, listId: string, updates: Partial<List>) => void;
  deleteList: (boardId: string, listId: string) => void;
  duplicateList: (boardId: string, listId: string) => void;
  addCard: (boardId: string, listId: string, card: Card) => void;
  updateCard: (boardId: string, listId: string, cardId: string, updates: Partial<Card>) => void;
  deleteCard: (boardId: string, listId: string, cardId: string) => void;
  duplicateCard: (boardId: string, listId: string, cardId: string) => void;
  moveCard: (boardId: string, fromListId: string, toListId: string, cardId: string) => void;
  setCompletedList: (boardId: string, listId: string) => void;
  getCompletedListId: (boardId: string) => string | null;
}

// Create initial board
const initialBoardId = generateId();
const initialListId = generateId();

const initialBoard: ExtendedBoard = {
  id: initialBoardId,
  title: 'Meu Primeiro Quadro',
  lists: [
    {
      id: initialListId,
      title: 'Nova Lista',
      cards: []
    }
  ],
  hidden: false,
  completedListId: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

export const useKanbanStore = create<KanbanState>()(
  persist(
    (set, get) => ({
      boards: [initialBoard],
      activeBoard: initialBoardId,

      setActiveBoard: (boardId) => set({ activeBoard: boardId }),

      addBoard: (board) => set((state) => ({
        boards: [...state.boards, { ...board, id: generateId() }]
      })),

      updateBoard: (boardId, updates) => set((state) => ({
        boards: state.boards.map((board) =>
          board.id === boardId ? { ...board, ...updates } : board
        )
      })),

      deleteBoard: (boardId) => set((state) => ({
        boards: state.boards.filter((board) => board.id !== boardId),
        activeBoard: state.activeBoard === boardId ? null : state.activeBoard
      })),

      toggleBoardVisibility: (boardId) => set((state) => ({
        boards: state.boards.map((board) =>
          board.id === boardId ? { ...board, hidden: !board.hidden } : board
        )
      })),

      duplicateBoard: (boardId) => set((state) => {
        const board = state.boards.find((b) => b.id === boardId);
        if (!board) return state;

        const newBoard = {
          ...board,
          id: generateId(),
          title: `${board.title} (Cópia)`,
          lists: board.lists.map((list) => ({
            ...list,
            id: generateId(),
            cards: list.cards.map((card) => ({ ...card, id: generateId() }))
          }))
        };

        return { boards: [...state.boards, newBoard] };
      }),

      addList: (boardId, list) => set((state) => ({
        boards: state.boards.map((board) =>
          board.id === boardId
            ? { ...board, lists: [...board.lists, { ...list, id: generateId() }] }
            : board
        )
      })),

      updateList: (boardId, listId, updates) => set((state) => ({
        boards: state.boards.map((board) =>
          board.id === boardId
            ? {
                ...board,
                lists: board.lists.map((list) =>
                  list.id === listId ? { ...list, ...updates } : list
                )
              }
            : board
        )
      })),

      deleteList: (boardId, listId) => set((state) => ({
        boards: state.boards.map((board) =>
          board.id === boardId
            ? {
                ...board,
                lists: board.lists.filter((list) => list.id !== listId)
              }
            : board
        )
      })),

      addCard: (boardId, listId, card) => set((state) => ({
        boards: state.boards.map((board) =>
          board.id === boardId
            ? {
                ...board,
                lists: board.lists.map((list) =>
                  list.id === listId
                    ? { ...list, cards: [...list.cards, { ...card, id: generateId() }] }
                    : list
                )
              }
            : board
        )
      })),

      updateCard: (boardId, listId, cardId, updates) => set((state) => ({
        boards: state.boards.map((board) =>
          board.id === boardId
            ? {
                ...board,
                lists: board.lists.map((list) =>
                  list.id === listId
                    ? {
                        ...list,
                        cards: list.cards.map((card) =>
                          card.id === cardId ? { ...card, ...updates } : card
                        )
                      }
                    : list
                )
              }
            : board
        )
      })),

      deleteCard: (boardId, listId, cardId) => set((state) => ({
        boards: state.boards.map((board) =>
          board.id === boardId
            ? {
                ...board,
                lists: board.lists.map((list) =>
                  list.id === listId
                    ? {
                        ...list,
                        cards: list.cards.filter((card) => card.id !== cardId)
                      }
                    : list
                )
              }
            : board
        )
      })),

      moveCard: (boardId, fromListId, toListId, cardId) => set((state) => {
        const board = state.boards.find((b) => b.id === boardId);
        if (!board) return state;

        const fromList = board.lists.find((l) => l.id === fromListId);
        if (!fromList) return state;

        const card = fromList.cards.find((c) => c.id === cardId);
        if (!card) return state;

        return {
          boards: state.boards.map((board) =>
            board.id === boardId
              ? {
                  ...board,
                  lists: board.lists.map((list) => {
                    if (list.id === fromListId) {
                      return {
                        ...list,
                        cards: list.cards.filter((c) => c.id !== cardId)
                      };
                    }
                    if (list.id === toListId) {
                      return {
                        ...list,
                        cards: [...list.cards, { ...card }]
                      };
                    }
                    return list;
                  })
                }
              : board
          )
        };
      }),

      setCompletedList: (boardId, listId) => set((state) => ({
        boards: state.boards.map((board) =>
          board.id === boardId ? { ...board, completedListId: listId } : board
        )
      })),

      getCompletedListId: (boardId) => {
        const board = get().boards.find((b) => b.id === boardId);
        return board?.completedListId || null;
      },

      duplicateList: (boardId, listId) => set((state) => {
        const board = state.boards.find((b) => b.id === boardId);
        if (!board) return state;

        const list = board.lists.find((l) => l.id === listId);
        if (!list) return state;

        const newList = {
          ...list,
          id: generateId(),
          title: `${list.title} (Cópia)`,
          cards: list.cards.map((card) => ({ ...card, id: generateId() }))
        };

        return {
          boards: state.boards.map((b) =>
            b.id === boardId
              ? { ...b, lists: [...b.lists, newList] }
              : b
          )
        };
      }),

      duplicateCard: (boardId, listId, cardId) => set((state) => {
        const board = state.boards.find((b) => b.id === boardId);
        if (!board) return state;

        const list = board.lists.find((l) => l.id === listId);
        if (!list) return state;

        const card = list.cards.find((c) => c.id === cardId);
        if (!card) return state;

        const newCard = {
          ...card,
          id: generateId(),
          title: card.title,
          subtasks: card.subtasks?.map(subtask => ({ ...subtask, id: generateId() })) || []
        };

        return {
          boards: state.boards.map((b) =>
            b.id === boardId
              ? {
                  ...b,
                  lists: b.lists.map((l) =>
                    l.id === listId
                      ? { ...l, cards: [...l.cards, newCard] }
                      : l
                  )
                }
              : b
          )
        };
      })
    }),
    {
      name: 'kanban-store'
    }
  )
);
