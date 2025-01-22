// src/pages/Clients/store/kanbanStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { KanbanState, Board, Card } from '../types';
import { generateId } from '../../../utils/generateId';

export const useKanbanStore = create<KanbanState>()(
  persist(
    (set, get) => ({
      boards: [],
      activeBoard: null,

      addBoard: (title) =>
        set((state) => ({
          boards: [
            ...state.boards,
            {
              id: generateId(),
              title,
              lists: [],
              hidden: false,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
        })),

      updateBoard: (id, title) =>
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === id
              ? {
                  ...board,
                  title,
                  updatedAt: new Date().toISOString(),
                }
              : board
          ),
        })),

      deleteBoard: (id) =>
        set((state) => ({
          boards: state.boards.filter((board) => board.id !== id),
          activeBoard: state.activeBoard === id ? null : state.activeBoard,
        })),

      duplicateBoard: (id) =>
        set((state) => {
          const board = state.boards.find((b) => b.id === id);
          if (!board) return state;

          const newBoard = {
            ...board,
            id: generateId(),
            title: `${board.title} (Cópia)`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          return {
            boards: [...state.boards, newBoard],
          };
        }),

      toggleBoardVisibility: (id) =>
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === id ? { ...board, hidden: !board.hidden } : board
          ),
        })),

      addList: (boardId, title) =>
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId
              ? {
                  ...board,
                  lists: [
                    ...board.lists,
                    {
                      id: generateId(),
                      title,
                      cards: [],
                    },
                  ],
                }
              : board
          ),
        })),

      updateList: (boardId, listId, title) =>
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId
              ? {
                  ...board,
                  lists: board.lists.map((list) =>
                    list.id === listId ? { ...list, title } : list
                  ),
                }
              : board
          ),
        })),

      deleteList: (boardId, listId) =>
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId
              ? {
                  ...board,
                  lists: board.lists.filter((list) => list.id !== listId),
                }
              : board
          ),
        })),

      duplicateList: (boardId, listId) =>
        set((state) => {
          const board = state.boards.find((b) => b.id === boardId);
          const list = board?.lists.find((l) => l.id === listId);
          if (!board || !list) return state;

          const newList = {
            ...list,
            id: generateId(),
            title: `${list.title} (Cópia)`,
            cards: list.cards.map((card) => ({
              ...card,
              id: generateId(),
            })),
          };

          return {
            boards: state.boards.map((b) =>
              b.id === boardId
                ? { ...b, lists: [...b.lists, newList] }
                : b
            ),
          };
        }),

      addCard: (boardId, listId, cardData) =>
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId
              ? {
                  ...board,
                  lists: board.lists.map((list) =>
                    list.id === listId
                      ? {
                          ...list,
                          cards: [
                            ...list.cards,
                            {
                              ...cardData,
                              id: generateId(),
                              tagIds: cardData.tagIds || [],
                              checklist: cardData.checklist || [],
                              customFields: cardData.customFields || {},
                              createdAt: new Date().toISOString(),
                              updatedAt: new Date().toISOString(),
                            },
                          ],
                        }
                      : list
                  ),
                }
              : board
          ),
        })),

      updateCard: (boardId, listId, cardId, updates) =>
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId
              ? {
                  ...board,
                  lists: board.lists.map((list) =>
                    list.id === listId
                      ? {
                          ...list,
                          cards: list.cards.map((card) =>
                            card.id === cardId
                              ? {
                                  ...card,
                                  ...updates,
                                  updatedAt: new Date().toISOString(),
                                }
                              : card
                          ),
                        }
                      : list
                  ),
                }
              : board
          ),
        })),

      deleteCard: (boardId, listId, cardId) =>
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId
              ? {
                  ...board,
                  lists: board.lists.map((list) =>
                    list.id === listId
                      ? {
                          ...list,
                          cards: list.cards.filter((card) => card.id !== cardId),
                        }
                      : list
                  ),
                }
              : board
          ),
        })),

      duplicateCard: (boardId, listId, cardId) =>
        set((state) => {
          const board = state.boards.find((b) => b.id === boardId);
          const list = board?.lists.find((l) => l.id === listId);
          const card = list?.cards.find((c) => c.id === cardId);
          if (!board || !list || !card) return state;

          const newCard = {
            ...card,
            id: generateId(),
            title: `${card.title} (Cópia)`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
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
                    ),
                  }
                : b
            ),
          };
        }),

      moveCard: (cardId, sourceListId, targetListId) =>
        set((state) => {
          const board = state.boards.find((b) => b.id === state.activeBoard);
          if (!board) return state;

          const sourceList = board.lists.find((l) => l.id === sourceListId);
          const card = sourceList?.cards.find((c) => c.id === cardId);

          if (!card) return state;

          return {
            boards: state.boards.map((b) =>
              b.id === state.activeBoard
                ? {
                    ...b,
                    lists: b.lists.map((list) => {
                      if (list.id === sourceListId) {
                        return {
                          ...list,
                          cards: list.cards.filter((c) => c.id !== cardId),
                        };
                      }
                      if (list.id === targetListId) {
                        return {
                          ...list,
                          cards: [...list.cards, card],
                        };
                      }
                      return list;
                    }),
                  }
                : b
            ),
          };
        }),

      setActiveBoard: (boardId) =>
        set({
          activeBoard: boardId,
        }),
    }),
    {
      name: 'kanban-store',
    }
  )
);
