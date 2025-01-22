// src/pages/Clients/components/KanbanBoard.tsx
import React, { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  useSensor,
  useSensors,
  PointerSensor,
} from '@dnd-kit/core';
import { List } from './List';
import CardComponent from './Card'; // Certifique-se de que o componente está sendo importado corretamente
import { useKanbanStore } from '../store/kanbanStore';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card as CardType } from '../types';

export function KanbanBoard() {
  const { boards, activeBoard, moveCard, addList } = useKanbanStore();
  const [activeCard, setActiveCard] = useState<CardType | null>(null);
  const [showAddList, setShowAddList] = useState(false);
  const [newListTitle, setNewListTitle] = useState('');
  const board = boards.find((b) => b.id === activeBoard);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const sourceList = board?.lists.find((list) =>
      list.cards.some((card) => card.id === active.id)
    );
    const card = sourceList?.cards.find((card) => card.id === active.id);
    if (card) {
      setActiveCard(card);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || !board) return;

    const cardId = active.id as string;
    const sourceListId = active.data.current?.listId;
    const targetListId = over.data.current?.listId;

    if (sourceListId && targetListId && sourceListId !== targetListId) {
      moveCard(cardId, sourceListId, targetListId);
    }

    setActiveCard(null);
  };

  const handleAddList = () => {
    if (newListTitle.trim() && board) {
      addList(board.id, newListTitle.trim());
      setNewListTitle('');
      setShowAddList(false);
    }
  };

  if (!board) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500 dark:text-gray-400">
          Selecione um quadro para começar
        </p>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-6 overflow-x-auto p-6 flex-grow">
        {board.lists.map((list) => (
          <List key={list.id} boardId={board.id} list={list} />
        ))}

        {showAddList ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-shrink-0 w-80 bg-dark-100 dark:bg-dark-800/50 rounded-lg p-4"
          >
            <input
              type="text"
              value={newListTitle}
              onChange={(e) => setNewListTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddList()}
              placeholder="Digite o título da lista..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7f00ff] dark:bg-gray-700 dark:text-gray-100"
              autoFocus
            />
            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={() => setShowAddList(false)}
                className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddList}
                className="px-3 py-1.5 text-sm bg-[#7f00ff] text-white rounded-md hover:bg-[#7f00ff]/90"
              >
                Adicionar
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => setShowAddList(true)}
            className="flex-shrink-0 w-40 h-10 bg-gray-100 dark:bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-[#7f00ff] dark:hover:border-[#7f00ff] transition-colors flex items-center justify-center text-gray-600 dark:text-gray-400"
          >
            <Plus className="w-5 h-5 mr-2" />
            Adicionar
          </motion.button>
        )}
      </div>
      <DragOverlay>
        {activeCard && (
          <CardComponent
            card={activeCard}
            boardId={board.id}
            listId=""
            overlay
          />
        )}
      </DragOverlay>
    </DndContext>
  );
}
