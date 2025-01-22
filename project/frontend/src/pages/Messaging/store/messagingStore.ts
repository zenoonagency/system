import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MessagingState, Contact } from '../types';
import { generateId } from '../../../utils/generateId';

export const useMessagingStore = create<MessagingState>()(
  persist(
    (set) => ({
      batches: [],
      selectedContacts: [],

      addBatch: (context, messages, contacts) => {
        const newBatch = {
          id: generateId(),
          context,
          messages,
          contacts,
          status: 'pending' as const,
          progress: 0,
          sentCount: 0,
          failedCount: 0,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          batches: [newBatch, ...state.batches],
        }));
      },

      updateBatchProgress: (id, progress, status) => {
        set((state) => ({
          batches: state.batches.map((batch) =>
            batch.id === id
              ? {
                  ...batch,
                  progress,
                  status,
                }
              : batch
          ),
        }));
      },

      completeBatch: (id, sentCount, failedCount) => {
        set((state) => ({
          batches: state.batches.map((batch) =>
            batch.id === id
              ? {
                  ...batch,
                  status: 'completed',
                  progress: 100,
                  sentCount,
                  failedCount,
                  completedAt: new Date().toISOString(),
                }
              : batch
          ),
        }));
      },

      setSelectedContacts: (contactIds) => {
        set({ selectedContacts: contactIds });
      },

      clearSelectedContacts: () => {
        set({ selectedContacts: [] });
      },
    }),
    {
      name: 'messaging-store',
    }
  )
);