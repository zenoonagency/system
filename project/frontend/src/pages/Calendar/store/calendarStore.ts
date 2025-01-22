import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CalendarState, CalendarEvent } from '../types';
import { generateId } from '../../../utils/generateId';

export const useCalendarStore = create<CalendarState>()(
  persist(
    (set) => ({
      events: [],

      addEvent: (eventData) =>
        set((state) => ({
          events: [
            ...state.events,
            {
              ...eventData,
              id: generateId(),
              allDay: eventData.allDay || false,
            } as CalendarEvent,
          ],
        })),

      updateEvent: (id, updates) =>
        set((state) => ({
          events: state.events.map((event) =>
            event.id === id ? { ...event, ...updates } : event
          ),
        })),

      deleteEvent: (id) =>
        set((state) => ({
          events: state.events.filter((event) => event.id !== id),
        })),
    }),
    {
      name: 'calendar-store',
    }
  )
);