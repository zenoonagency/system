import React, { useState, useEffect, useRef } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Card as CardType } from '../types';
import { MoreVertical, Edit2, Copy, Trash2, Phone, DollarSign, User, Calendar, ChevronDown, ChevronUp, CheckSquare, Square, Tag } from 'lucide-react';
import { useKanbanStore } from '../store/kanbanStore';
import { CardModal } from './CardModal';
import { useTagStore } from '../../../store/tagStore';
import { useThemeStore } from '../../../store/themeStore';
import { useTeamStore } from '../../../pages/Team/store/teamStore';
import { format } from 'date-fns';
import { CardDetailModal } from './CardDetailModal';

interface CardProps {
  card: CardType;
  boardId: string;
  listId: string;
  overlay?: boolean;
}

const Card: React.FC<CardProps> = ({ card, boardId, listId, overlay }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [showSubtasks, setShowSubtasks] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { updateCard, deleteCard, duplicateCard } = useKanbanStore();
  const { tags } = useTagStore();
  const { theme } = useThemeStore();
  const { members } = useTeamStore();

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: card.id,
    data: {
      listId,
      boardId,
    },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  const handleEdit = (updatedCard: Omit<CardType, 'id'|'createdAt'|'updatedAt'>) => {
    updateCard(boardId, listId, card.id, {
      ...updatedCard,
      createdAt: card.createdAt,
      updatedAt: new Date().toISOString()
    });
    setShowEditModal(false);
  };

  const handleCopyPhoneNumber = () => {
    navigator.clipboard.writeText(card.phone);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2000);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setShowMenu(false);
    }
  };

  useEffect(() => {
    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const toggleTask = (taskId: string) => {
    const newChecklist = card.checklist.map(item =>
      item.id === taskId ? { ...item, completed: !item.completed } : item
    );
    updateCard(boardId, listId, card.id, { checklist: newChecklist });
  };

  const iconColor = 'text-[#7f00ff]';
  const textColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-700';

  const cardContent = (
    <div 
      className={`relative p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer group ${theme === 'dark' ? 'bg-dark-800' : 'bg-white'}`}
      style={{ userSelect: 'none', border: '1px solid rgba(0, 0, 0, 0.1)', transition: 'transform 0.2s' }}
      onClick={() => setShowDetailModal(true)}
    >
      <div className="flex justify-between items-center mb-3">
        <h4 className={`text-lg font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'} transition-colors duration-300`}>
          {card.title}
        </h4>
        <div className="flex items-center space-x-2">
          {card.tagIds.length > 0 && (
            <div className="flex items-center space-x-1">
              {card.tagIds.map((tagId) => {
                const tag = tags.find((t) => t.id === tagId);
                if (!tag) return null;
                return (
                  <span
                    key={tag.id}
                    className="inline-flex items-center margin-right-1 px-2 py-0.5 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: `${tag.color}20`,
                      color: tag.color,
                      border: `1px solid ${tag.color}`,
                      transition: 'background-color 0.3s, color 0.3s',
                    }}
                  >
                    {tag.name}
                  </span>
                );
              })}
            </div>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className={`p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-300 ${textColor}`}
          >
            <MoreVertical className="w-5 h-5" />
          </button>
          {showMenu && (
            <div
              ref={menuRef}
              className="absolute right-10 top-10 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-10 transition-transform transform origin-top-right scale-95"
              style={{ transition: 'transform 0.2s ease-out' }}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowEditModal(true);
                  setShowMenu(false);
                }}
                className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center transition-colors duration-300"
              >
                <Edit2 className="w-5 h-5 mr-2" />
                Editar
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  duplicateCard(boardId, listId, card.id);
                  setShowMenu(false);
                }}
                className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center transition-colors duration-300"
              >
                <Copy className="w-5 h-5 mr-2" />
                Duplicar
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm('Tem certeza que deseja excluir este cartão?')) {
                    deleteCard(boardId, listId, card.id);
                  }
                  setShowMenu(false);
                }}
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center transition-colors duration-300"
              >
                <Trash2 className="w-5 h-5 mr-2" />
                Excluir
              </button>
            </div>
          )}
        </div>
      </div>
      {card.description && (
        <p className={`text-base ${textColor} mb-3 transition-colors duration-300 line-clamp-3`}>
          {card.description}
        </p>
      )}
      {card.phone && (
        <div className={`flex items-center text-base ${textColor} mb-2 transition-colors duration-300`}>
          <Phone className={`w-5 h-5 mr-2 ${iconColor}`} />
          <span onClick={handleCopyPhoneNumber} className="cursor-pointer hover:underline">
            {card.phone}
          </span>
        </div>
      )}
      {card.value > 0 && (
        <div className={`flex items-center text-base font-medium ${textColor} mb-2 transition-colors duration-300`}>
          <DollarSign className={`w-5 h-5 mr-2 ${iconColor}`} />
          {new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(card.value)}
        </div>
      )}
      {members && (
        <div className={`flex items-center text-base ${textColor} mb-2 transition-colors duration-300`}>
          <User className={`w-5 h-5 mr-2 ${iconColor}`} />
          {members.find((member) => member.id === card.responsibleId)?.name || 'Não definido'}
        </div>
      )}
      {card.scheduledDate && (
        <div className={`flex items-center text-base ${textColor} mb-2 transition-colors duration-300`}>
          <Calendar className={`w-5 h-5 mr-2 ${iconColor}`} />
          Agendado para: {format(new Date(card.scheduledDate), 'dd/MM/yyyy')}
        </div>
      )}
      <div className={`text-base ${textColor} transition-colors duration-300`}>
        {Object.entries(card.customFields).map(([name, field]) => (
          <div key={name} className="flex items-center mb-1 p-2 bg-gray-100 dark:bg-gray-700 rounded-md">
            <Tag className={`w-5 h-5 mr-2 ${iconColor}`} />
            <strong className="mr-1">{name}:</strong> <span>{field.value}</span>
          </div>
        ))}
      </div>
      {card.checklist && card.checklist.length > 0 && (
        <div className="mt-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowSubtasks(!showSubtasks);
            }}
            className={`flex items-center text-base ${textColor} transition-colors duration-300`}
          >
            {showSubtasks ? <ChevronUp className="w-5 h-5 mr-2" /> : <ChevronDown className="w-5 h-5 mr-2" />}
            Subtarefas ({card.checklist.filter(item => item.completed).length}/{card.checklist.length})
          </button>
          {showSubtasks && (
            <ul className="mt-2 space-y-1 transition-all duration-300">
              {card.checklist.map((item) => (
                <li key={item.id} className="flex items-center text-base">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTask(item.id);
                    }}
                    className={`mr-2 ${item.completed ? iconColor : textColor}`}
                  >
                    {item.completed ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                  </button>
                  <span className={`${item.completed ? 'line-through text-gray-400' : theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      {showNotification && (
        <div className="mt-2 text-sm text-green-600 transition-colors duration-300">
          Número copiado!
        </div>
      )}
    </div>
  );

  if (overlay) {
    return cardContent;
  }

  return (
    <>
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        {cardContent}
      </div>

      {showEditModal && (
        <CardModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSave={handleEdit}
          boardId={boardId}
          listId={listId}
          mode="edit"
          card={card}
        />
      )}

      {showDetailModal && (
        <CardDetailModal
          card={card}
          onClose={() => setShowDetailModal(false)}
          boardId={boardId}
          listId={listId}
        />
      )}
    </>
  );
};

export default Card;
