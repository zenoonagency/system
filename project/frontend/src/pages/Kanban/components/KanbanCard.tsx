import React, { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card } from '../types';
import { Calendar, Flag, MoreVertical, Copy, Trash2, Edit } from 'lucide-react';
import { useKanbanStore } from '../store/kanbanStore';
import { CardModal } from './CardModal';

interface KanbanCardProps {
  card: Card;
  listId?: string;
  overlay?: boolean;
}

const priorityColors = {
  Baixa: 'text-green-400',
  Média: 'text-yellow-400',
  Alta: 'text-orange-400',
  Urgente: 'text-red-400',
};

export function KanbanCard({ card, listId, overlay }: KanbanCardProps) {
  const { updateCard, deleteCard, duplicateCard } = useKanbanStore();
  const [showMenu, setShowMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: card.id,
    data: { listId },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  const handleEdit = (updatedCard: Omit<Card, 'id'>) => {
    if (listId) {
      updateCard(listId, card.id, updatedCard);
    }
    setShowEditModal(false);
  };

  const handleDelete = () => {
    if (listId) {
      deleteCard(listId, card.id);
    }
  };

  const handleDuplicate = () => {
    if (listId) {
      duplicateCard(listId, card.id);
    }
  };

  const cardContent = (
    <div className="relative group">
      <div
        className="p-4 rounded-lg shadow cursor-move hover:bg-gray-200 transition-colors"
        style={{ backgroundColor: '#F5F5F5' }}
      >
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-medium text-black">{card.title}</h4>
          {!overlay && (
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
                className="p-1 hover:bg-gray-200 rounded-full text-gray-600 hover:text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical size={16} />
              </button>
              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowEditModal(true);
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-t-lg flex items-center"
                  >
                    <Edit size={16} className="mr-2" />
                    Editar
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDuplicate();
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <Copy size={16} className="mr-2" />
                    Duplicar
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete();
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100 rounded-b-lg flex items-center"
                  >
                    <Trash2 size={16} className="mr-2" />
                    Excluir
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        {card.description && (
          <p className="text-sm text-black mb-3">{card.description}</p>
        )}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-black">
            <Calendar size={14} className="mr-1" />
            <span>
              {format(new Date(card.dueDate), "d 'de' MMM", { locale: ptBR })}
            </span>
          </div>
          <div className="flex items-center">
            <Flag size={14} className={`${priorityColors[card.priority]} mr-1`} />
            <span className={priorityColors[card.priority]}>{card.priority}</span>
          </div>
        </div>
        {card.customFields && Object.entries(card.customFields).length > 0 && (
          <div className="mt-2 pt-2 border-t border-gray-200">
            {Object.entries(card.customFields).map(([name, value]) => (
              <div key={name} className="text-sm text-gray-600">
                <span className="font-medium">{name}:</span> {value}
              </div>
            ))}
          </div>
        )}
      </div>

      {showEditModal && (
        <CardModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSave={handleEdit}
          initialCard={card}
          mode="edit"
        />
      )}
    </div>
  );

  if (overlay) {
    return cardContent;
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {cardContent}
    </div>
  );
}