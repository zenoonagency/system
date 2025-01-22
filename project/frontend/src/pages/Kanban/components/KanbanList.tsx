import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { KanbanCard } from './KanbanCard';
import { CardModal } from './CardModal';
import { List } from '../types';
import { MoreVertical, Plus, Trash2 } from 'lucide-react';
import { useKanbanStore } from '../store/kanbanStore';

interface KanbanListProps {
  list: List;
}

export function KanbanList({ list }: KanbanListProps) {
  const { setNodeRef } = useDroppable({
    id: list.id,
    data: { listId: list.id },
  });

  const { updateList, deleteList, addCard } = useKanbanStore();
  const [isEditing, setIsEditing] = React.useState(false);
  const [showMenu, setShowMenu] = React.useState(false);
  const [showCardModal, setShowCardModal] = React.useState(false);
  const [title, setTitle] = React.useState(list.title);

  const handleTitleSubmit = () => {
    if (title.trim()) {
      updateList(list.id, title);
      setIsEditing(false);
    }
  };

  const handleAddCard = (listId: string, card: Omit<Card, 'id'>) => {
    addCard(listId, card);
    setShowCardModal(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={{ backgroundColor: '#E7E7E7' }}
      className="flex-shrink-0 w-80 rounded-lg p-4 shadow-md"
    >
      <div className="flex justify-between items-center mb-4">
        {isEditing ? (
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleTitleSubmit}
            onKeyDown={(e) => e.key === 'Enter' && handleTitleSubmit()}
            className="bg-gray-100 text-gray-800 rounded px-2 py-1 w-full border border-gray-300"
            autoFocus
          />
        ) : (
          <h3
            className="font-semibold text-gray-900 cursor-pointer"
            onClick={() => setIsEditing(true)}
          >
            {list.title}
          </h3>
        )}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 hover:bg-gray-200 rounded-full text-gray-600 hover:text-gray-900"
          >
            <MoreVertical size={20} />
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10">
              <button
                onClick={() => {
                  setIsEditing(true);
                  setShowMenu(false);
                }}
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-t-lg"
              >
                Editar
              </button>
              <button
                onClick={() => deleteList(list.id)}
                className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100 rounded-b-lg flex items-center"
              >
                <Trash2 size={16} className="mr-2" />
                Excluir
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {list.cards.map((card) => (
          <KanbanCard key={card.id} card={card} listId={list.id} />
        ))}
      </div>

      <button
        onClick={() => setShowCardModal(true)}
        className="mt-3 w-full py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-600 hover:text-gray-800 transition-colors flex items-center justify-center"
      >
        <Plus size={20} className="mr-2" />
        Adicionar Cartão
      </button>

      {showCardModal && (
        <CardModal
          isOpen={showCardModal}
          onClose={() => setShowCardModal(false)}
          onSave={handleAddCard}
          mode="add"
          listId={list.id}
        />
      )}
    </div>
  );
}
