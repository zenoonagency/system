import React, { useRef } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CheckSquare } from 'lucide-react';

const Card = ({ cardData, theme, isCompletedList, setShowDetailModal }) => {
  const ref = useRef(null);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    isDragging,
    isDropped,
    style,
  } = useDraggable({
    id: cardData.id,
    data: {
      card: cardData,
    },
    disabled: isCompletedList,
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      onClick={() => setShowDetailModal(true)}
      className={`group relative ${
        theme === 'dark' ? 'bg-dark-600' : 'bg-white'
      } rounded-lg p-3 cursor-pointer shadow-sm hover:shadow-md transition-all ${
        isDropped ? 'shadow-xl' : ''
      } ${isDragging ? 'opacity-50' : ''} ${
        isCompletedList ? 'border-2 border-green-500 bg-opacity-50' : ''
      }`}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          {isCompletedList && (
            <CheckSquare className="w-5 h-5 text-green-500 flex-shrink-0" />
          )}
          <h3 className={`font-medium ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'} ${
            isCompletedList ? 'line-through' : ''
          }`}>
            {cardData.title}
          </h3>
        </div>
        <div className="relative">
          {/* ... existing code ... */}
        </div>
      </div>
    </div>
  );
};

export default Card; 