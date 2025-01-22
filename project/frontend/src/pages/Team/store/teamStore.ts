import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TeamState, TeamMember } from '../types';
import { generateId } from '../../../utils/generateId';

export const useTeamStore = create<TeamState>()(
  persist(
    (set) => ({
      members: [],

      addMember: (member: Omit<TeamMember, 'id'>) => {
        const newMember: TeamMember = {
          ...member,
          id: generateId(),
        };
        set((state) => ({
          members: [...state.members, newMember],
        }));
      },

      updateMember: (id: string, updates: Partial<TeamMember>) =>
        set((state) => ({
          members: state.members.map((member) =>
            member.id === id ? { ...member, ...updates } : member
          ),
        })),

      deleteMember: (id: string) =>
        set((state) => ({
          members: state.members.filter((member) => member.id !== id),
        })),
    }),
    {
      name: 'team-store',
    }
  )
);