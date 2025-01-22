import React, { useState } from 'react';
import { TeamList } from './components/TeamList';
import { TeamMemberModal } from './components/TeamMemberModal';
import { useTeamStore } from './store/teamStore';
import { Plus } from 'lucide-react';

export function Team() {
  const [showModal, setShowModal] = useState(false);
  const { addMember } = useTeamStore();

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
          Gerenciamento de Equipe
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center px-4 py-2 bg-[#7f00ff] text-white rounded-md hover:bg-[#7f00ff]/90 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Adicionar Membro
        </button>
      </div>

      <TeamList />

      {showModal && (
        <TeamMemberModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSave={(member) => {
            addMember(member);
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}