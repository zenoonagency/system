// src/pages/Clients/components/List.tsx
import React, { useState, useMemo } from 'react';
import { useDroppable } from '@dnd-kit/core';
import CardComponent from './Card'; // Certifique-se de que o componente está sendo importado corretamente
import { List as ListType } from '../types';
import { MoreVertical, Plus, Edit2, Copy, Trash2 } from 'lucide-react';
import { useKanbanStore } from '../store/kanbanStore';
import { motion } from 'framer-motion';
import { CardModal } from './CardModal';

interface ListProps {
  boardId: string;
  list: ListType;
}

export function List({ boardId, list }: ListProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [title, setTitle] = useState(list.title);
  const { updateList, deleteList, duplicateList, addCard } = useKanbanStore();

  // Calcular o valor total dos cartões usando useMemo
  const totalValue = useMemo(() => {
    return list.cards.reduce((total, card) => total + (card.value || 0), 0);
  }, [list.cards]);

  const { setNodeRef } = useDroppable({
    id: list.id,
    data: { 
      listId: list.id,
      boardId 
    },
  });

  const handleTitleSubmit = () => {
    if (title.trim() && title !== list.title) {
      updateList(boardId, list.id, title);
    }
    setIsEditing(false);
  };

  const handleAddCard = (cardData: any) => {
    if (!boardId) {
      console.error('Nenhum quadro selecionado');
      return;
    }

    addCard(boardId, list.id, {
      ...cardData,
      value: parseFloat(cardData.value) || 0,
      tagIds: cardData.tagIds || [],
      checklist: cardData.checklist || [],
      customFields: cardData.customFields || {},
    });
    setShowCardModal(false);
  };

  return (
    <div
      ref={setNodeRef}
      className="flex-shrink-0 w-96 bg-gray-100 dark:bg-dark-600/50 rounded-lg p-3 flex flex-col overflow-x-hidden"
    >
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          {isEditing ? (
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={(e) => e.key === 'Enter' && handleTitleSubmit()}
              className="flex-1 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-[#7f00ff] dark:bg-dark-700 dark:text-gray-100"
              autoFocus
            />
          ) : (
            <h3
              className="font-medium text-gray-900 dark:text-gray-100 cursor-pointer"
              onClick={() => setIsEditing(true)}
            >
              {list.title}
            </h3>
          )}
          <span className="ml-2 text-sm font-medium text-[#7f00ff]">
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(totalValue)}
          </span>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
          >
            <MoreVertical className="w-5 h-5 text-gray-500" />
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-10">
              <button
                onClick={() => {
                  setIsEditing(true);
                  setShowMenu(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Editar
              </button>
              <button
                onClick={() => {
                  duplicateList(boardId, list.id);
                  setShowMenu(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
              >
                <Copy className="w-4 h-4 mr-2" />
                Duplicar
              </button>
              <button
                onClick={() => {
                  if (confirm('Tem certeza que deseja excluir esta lista?')) {
                    deleteList(boardId, list.id);
                  }
                  setShowMenu(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Excluir
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2 overflow-y-auto overflow-x-hidden" style={{ maxHeight: '600px' }}> {/* Tamanho fixo com rolagem */}
        {list.cards.map((card) => (
          <CardComponent // Use o nome correto do componente importado
            key={card.id}
            card={card}
            boardId={boardId}
            listId={list.id}
          />
        ))}
      </div>

      <button
        onClick={() => setShowCardModal(true)}
        className="mt-2 w-full py-2 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-md text-gray-600 dark:text-gray-300 transition-colors flex items-center justify-center"
      >
        <Plus className="w-5 h-5 mr-2" />
        Adicionar Cartão
      </button>

      {showCardModal && (
        <CardModal
          isOpen={showCardModal}
          onClose={() => setShowCardModal(false)}
          onSave={handleAddCard}
          mode="add"
          boardId={boardId}
          listId={list.id}
        />
      )}
    </div>
  );
}
