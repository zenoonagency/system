import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { KanbanStore, List, Card } from '../types';
import { generateId } from '../../../utils/generateId';

export const useKanbanStore = create<KanbanStore>()(
  persist(
    (set) => ({
      lists: [
        {
          id: '1',
          title: 'A Fazer',
          cards: [],
        },
        {
          id: '2',
          title: 'Em Progresso',
          cards: [],
        },
        {
          id: '3',
          title: 'Concluído',
          cards: [],
        },
      ],

      addList: (title: string) =>
        set((state) => ({
          lists: [...state.lists, { id: generateId(), title, cards: [] }],
        })),

      updateList: (id: string, title: string) =>
        set((state) => ({
          lists: state.lists.map((list) =>
            list.id === id ? { ...list, title } : list
          ),
        })),

      deleteList: (id: string) =>
        set((state) => ({
          lists: state.lists.filter((list) => list.id !== id),
        })),

      addCard: (listId: string, card: Omit<Card, 'id'>) =>
        set((state) => ({
          lists: state.lists.map((list) =>
            list.id === listId
              ? {
                  ...list,
                  cards: [...list.cards, { ...card, id: generateId() }],
                }
              : list
          ),
        })),

      updateCard: (listId: string, cardId: string, updatedCard: Partial<Card>) =>
        set((state) => ({
          lists: state.lists.map((list) =>
            list.id === listId
              ? {
                  ...list,
                  cards: list.cards.map((card) =>
                    card.id === cardId ? { ...card, ...updatedCard } : card
                  ),
                }
              : list
          ),
        })),

      deleteCard: (listId: string, cardId: string) =>
        set((state) => ({
          lists: state.lists.map((list) =>
            list.id === listId
              ? {
                  ...list,
                  cards: list.cards.filter((card) => card.id !== cardId),
                }
              : list
          ),
        })),

      duplicateCard: (listId: string, cardId: string) =>
        set((state) => {
          const list = state.lists.find((l) => l.id === listId);
          const card = list?.cards.find((c) => c.id === cardId);

          if (!card) return state;

          const duplicatedCard = {
            ...card,
            id: generateId(),
            title: `${card.title} (Cópia)`,
          };

          return {
            lists: state.lists.map((list) =>
              list.id === listId
                ? {
                    ...list,
                    cards: [...list.cards, duplicatedCard],
                  }
                : list
            ),
          };
        }),

      moveCard: (cardId: string, sourceListId: string, targetListId: string) =>
        set((state) => {
          const sourceList = state.lists.find((l) => l.id === sourceListId);
          const card = sourceList?.cards.find((c) => c.id === cardId);

          if (!card) return state;

          return {
            lists: state.lists.map((list) => {
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
          };
        }),
    }),
    {
      name: 'kanban-store',
    }
  )
);
