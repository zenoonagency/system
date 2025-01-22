import React from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  useSensor,
  useSensors,
  PointerSensor,
} from '@dnd-kit/core';
import { KanbanList } from './KanbanList';
import { KanbanCard } from './KanbanCard';
import { useKanbanStore } from '../store/kanbanStore';
import { Card } from '../types';

export function KanbanBoard() {
  const { lists, moveCard, addList } = useKanbanStore();
  const [activeCard, setActiveCard] = React.useState<Card | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const sourceList = lists.find((list) =>
      list.cards.some((card) => card.id === active.id)
    );
    const card = sourceList?.cards.find((card) => card.id === active.id);
    if (card) {
      setActiveCard(card);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const cardId = active.id as string;
    const sourceListId = active.data.current?.listId;
    const targetListId = over.data.current?.listId;

    if (sourceListId !== targetListId) {
      moveCard(cardId, sourceListId, targetListId);
    }

    setActiveCard(null);
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-6 overflow-x-auto pb-4">
        {lists.map((list) => (
          <KanbanList key={list.id} list={list} />
        ))}
<button
  onClick={() => addList('Nova Lista')}
  className="flex-shrink-0 w-80 h-12 bg-[#F5F5F5] rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors flex items-center justify-center text-black/60 hover:text-black/80"
>
  Adicionar Lista
</button>

      </div>
      <DragOverlay>
        {activeCard && <KanbanCard card={activeCard} overlay />}
      </DragOverlay>
    </DndContext>
  );
}