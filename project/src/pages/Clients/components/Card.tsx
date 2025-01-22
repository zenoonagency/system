import React, { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Tag as TagIcon,
  Phone,
  DollarSign,
  Calendar,
  Clock,
  User,
  Mail,
  Link,
  Hash,
  CheckSquare,
  Square,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  Edit2,
  Copy,
  Trash2,
  ArrowRightLeft
} from 'lucide-react';
import { useKanbanStore } from '../store/kanbanStore';
import { useTagStore } from '../../../store/tagStore';
import { useTeamStore } from '../../../pages/Team/store/teamStore';
import { useThemeStore } from '../../../store/themeStore';
import { Card as CardType } from '../types';
import { CardModal } from './CardModal';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { ConfirmationModal } from '../../../components/ConfirmationModal';
import { useToast } from '../../../hooks/useToast';
import { CardDetailModal } from './CardDetailModal';

interface CardProps {
  card: CardType;
  boardId: string;
  listId: string;
  overlay?: boolean;
}

interface TeamMember {
  id: string;
  name: string;
}

interface MoveCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMove: (targetListId: string) => void;
  lists: { id: string; title: string }[];
  currentListId: string;
}

function MoveCardModal({ isOpen, onClose, onMove, lists, currentListId }: MoveCardModalProps) {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className={`relative w-full max-w-md p-6 rounded-lg shadow-lg ${
        isDark ? 'bg-[#1e1f25] text-gray-100' : 'bg-white text-gray-900'
      }`}>
        <h3 className="text-lg font-semibold mb-4">Mover para Lista</h3>
        <div className="space-y-2">
          {lists.map((list) => (
            <button
              key={list.id}
              onClick={() => {
                onMove(list.id);
                onClose();
              }}
              disabled={list.id === currentListId}
              className={`w-full text-left px-4 py-3 rounded-md transition-colors ${
                list.id === currentListId
                  ? 'bg-gray-700/50 text-gray-400 cursor-not-allowed'
                  : isDark
                    ? 'hover:bg-gray-700/50 text-gray-300'
                    : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              {list.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const Card = React.memo(({ card, boardId, listId, overlay }: CardProps) => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  
  // Get store values with safe fallbacks
  const kanbanStore = useKanbanStore();
  const tagStore = useTagStore();
  const teamStore = useTeamStore();
  
  const tags = tagStore?.tags || [];
  const members = teamStore?.members || [];
  const { updateCard, deleteCard, duplicateCard, moveCard, boards, getCompletedListId } = kanbanStore || {};
  const { showToast } = useToast();

  const [showMenu, setShowMenu] = useState(false);
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Ensure required props and store values exist
  if (!card || !boardId || !listId || !updateCard || !deleteCard || !duplicateCard || !moveCard) {
    return null;
  }

  // Initialize card properties with default values
  const cardData = {
    ...card,
    value: card.value || 0,
    assignedTo: card.assignedTo || [],
    tagIds: card.tagIds || []
  };

  const cardTags = useMemo(() => 
    (cardData.tagIds || [])
      .map(tagId => tags.find(t => t.id === tagId))
      .filter((tag): tag is NonNullable<typeof tag> => tag !== undefined),
    [cardData.tagIds, tags]
  );

  const isCompletedList = getCompletedListId?.(boardId) === listId;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: cardData.id,
    data: {
      type: 'card',
      cardId: cardData.id,
      listId,
      boardId,
    },
  });

  const style = useMemo(() => {
    if (!transform) return undefined;
    return {
      transform: CSS.Translate.toString(transform),
      transition: isDragging ? undefined : 'transform 200ms ease',
      opacity: isDragging ? 0.5 : 1,
      zIndex: isDragging ? 999 : undefined,
    };
  }, [transform, isDragging]);

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    setShowEditModal(true);
  };

  const handleSaveEdit = (updatedCard: Partial<CardType>) => {
    updateCard(boardId, listId, cardData.id, updatedCard);
    setShowEditModal(false);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    deleteCard(boardId, listId, cardData.id);
    showToast('Card excluído com sucesso!', 'success');
  };

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    duplicateCard(boardId, listId, cardData.id);
  };

  const handleMove = (targetListId: string) => {
    if (targetListId !== listId) {
      moveCard(boardId, listId, targetListId, cardData.id);
      showToast('Card movido com sucesso!', 'success');
    }
    setShowMenu(false);
  };

  return (
    <>
      <div
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        style={style}
        onClick={() => setShowDetailModal(true)}
        className={`group relative ${
          theme === 'dark' ? 'bg-dark-600' : 'bg-white'
        } rounded-lg p-3 cursor-pointer shadow-sm hover:shadow-md transition-all ${
          overlay ? 'shadow-xl' : ''
        } ${isDragging ? 'opacity-50' : ''} ${
          isCompletedList ? 'border-2 border-green-500' : ''
        }`}
      >
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            {isCompletedList && (
              <CheckSquare className="w-5 h-5 text-green-500 flex-shrink-0" />
            )}
            <h3 className={`font-medium ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
              {cardData.title}
            </h3>
          </div>
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreVertical className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-10">
                <button
                  onClick={handleEdit}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Editar
                </button>
                <button
                  onClick={() => {
                    setShowMoveModal(true);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                >
                  <ArrowRightLeft className="w-4 h-4 mr-2" />
                  Mover para
                </button>
                <button
                  onClick={handleDuplicate}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicar
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {cardData.value > 0 && (
            <div className="flex items-center text-sm text-green-600 bg-green-50 dark:bg-green-900/20 px-2.5 py-1.5 rounded-md">
              <DollarSign className="w-4 h-4 mr-1 text-green-500" />
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(cardData.value)}
            </div>
          )}

          {cardData.phone && (
            <div className="flex items-center text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1.5 rounded-md">
              <Phone className="w-4 h-4 mr-1 text-emerald-500" />
              {cardData.phone}
            </div>
          )}

          {cardData.responsibleId && (
            <div className="flex items-center text-sm text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 px-2.5 py-1.5 rounded-md">
              <User className="w-4 h-4 mr-1 text-purple-500" />
              {members.find(m => m.id === cardData.responsibleId)?.name || 'Não atribuído'}
            </div>
          )}

          {cardTags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {cardTags.map(tag => (
                <span
                  key={tag.id}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs"
                  style={{
                    backgroundColor: `${tag.color}20`,
                    color: tag.color,
                  }}
                >
                  <TagIcon className="w-3 h-3 mr-1" />
                  {tag.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {showDetailModal && (
        <CardDetailModal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          card={cardData}
        />
      )}

      {showEditModal && (
        <CardModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSave={handleSaveEdit}
          mode="edit"
          boardId={boardId}
          listId={listId}
          card={cardData}
        />
      )}

      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
        title="Excluir Card"
        message="Tem certeza que deseja excluir este card? Esta ação não pode ser desfeita."
        confirmText="Sim, excluir"
        cancelText="Não, manter"
        confirmButtonClass="bg-[#7f00ff] hover:bg-[#7f00ff]/90"
      />

      {showMoveModal && (
        <MoveCardModal
          isOpen={showMoveModal}
          onClose={() => setShowMoveModal(false)}
          onMove={handleMove}
          lists={boards.find(b => b.id === boardId)?.lists || []}
          currentListId={listId}
        />
      )}
    </>
  );
});

Card.displayName = 'Card';

export { Card };
