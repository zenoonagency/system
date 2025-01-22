import React, { useMemo } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Calendar,
  CheckSquare,
  Clock,
  DollarSign,
  Hash,
  Link,
  Mail,
  Phone,
  Square,
  Tag as TagIcon,
  User,
  X,
} from 'lucide-react';
import { useThemeStore } from '../../../store/themeStore';
import { useTagStore } from '../../../store/tagStore';
import { useTeamStore } from '../../../pages/Team/store/teamStore';
import { Card as CardType, CustomFieldType } from '../../../types';
import { Modal } from '../../../components/Modal';

interface CardDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: CardType;
}

export const CardDetailModal: React.FC<CardDetailModalProps> = ({ isOpen, onClose, card }) => {
  const { theme } = useThemeStore();
  const tagStore = useTagStore();
  const teamStore = useTeamStore();

  const tags = tagStore?.tags || [];
  const members = teamStore?.members || [];

  const cardTags = useMemo(() => 
    (card.tagIds || [])
      .map(tagId => tags.find(t => t.id === tagId))
      .filter((tag): tag is NonNullable<typeof tag> => tag !== undefined),
    [card.tagIds, tags]
  );

  const assignedMembers = useMemo(() =>
    (card.assignedTo || [])
      .map(memberId => members.find(m => m.id === memberId))
      .filter((member): member is NonNullable<typeof member> => member !== undefined),
    [card.assignedTo, members]
  );

  const completedSubtasks = useMemo(() => 
    (card.subtasks || []).filter(subtask => subtask.completed).length,
    [card.subtasks]
  );

  const totalSubtasks = useMemo(() => 
    (card.subtasks || []).length,
    [card.subtasks]
  );

  const progress = useMemo(() => 
    totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0,
    [completedSubtasks, totalSubtasks]
  );

  const renderCustomFieldValue = (field: { type: string; value: string }) => {
    switch (field.type) {
      case 'text':
      case 'number':
      case 'email':
      case 'tel':
        return field.value;
      case 'date':
        return field.value ? format(new Date(field.value), 'dd/MM/yyyy') : '';
      case 'checkbox':
        return field.value === 'true' ? 'Sim' : 'Não';
      default:
        return field.value;
    }
  };

  const getCustomFieldIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="w-4 h-4 mr-1 text-blue-500" />;
      case 'tel':
        return <Phone className="w-4 h-4 mr-1 text-green-500" />;
      case 'url':
        return <Link className="w-4 h-4 mr-1 text-purple-500" />;
      case 'number':
        return <Hash className="w-4 h-4 mr-1 text-orange-500" />;
      case 'checkbox':
        return <CheckSquare className="w-4 h-4 mr-1 text-indigo-500" />;
      default:
        return <TagIcon className="w-4 h-4 mr-1 text-blue-400" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className={`${theme === 'dark' ? 'bg-dark-900' : 'bg-white'} rounded-lg w-full max-w-4xl p-6 max-h-[90vh] overflow-y-auto`} 
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
            Detalhes do Cartão
          </h2>
          <button onClick={onClose} className={`${theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}>
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'} mb-2`}>
              {card.title}
            </h3>
            <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              {card.description || 'Sem descrição'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-dark-800' : 'bg-gray-100'}`}>
              <div className="flex items-center gap-2 text-sm">
                <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>Valor:</span>
                <span className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(card.value || 0)}
                </span>
              </div>
            </div>

            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-dark-800' : 'bg-gray-100'}`}>
              <div className="flex items-center gap-2 text-sm">
                <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>Telefone:</span>
                <span className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                  {card.phone || 'Não informado'}
                </span>
              </div>
            </div>
          </div>

          {card.scheduledDate && (
            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-dark-800' : 'bg-gray-100'}`}>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} size={16} />
                  <span className={`text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                    {new Date(card.scheduledDate).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                {card.scheduledTime && (
                  <div className="flex items-center gap-2">
                    <Clock className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} size={16} />
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                      {card.scheduledTime}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {card.responsibleId && (
            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-dark-800' : 'bg-gray-100'}`}>
              <div className="flex items-center gap-2">
                <User className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} size={16} />
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                  {members.find(m => m.id === card.responsibleId)?.name || 'Responsável não encontrado'}
                </span>
              </div>
            </div>
          )}

          {card.tagIds?.length > 0 && (
            <div>
              <h4 className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                Marcadores
              </h4>
              <div className="flex flex-wrap gap-2">
                {card.tagIds.map(tagId => {
                  const tag = tags.find(t => t.id === tagId);
                  if (!tag) return null;
                  return (
                    <span
                      key={tag.id}
                      className="px-3 py-1 rounded-full text-sm font-medium"
                      style={{ backgroundColor: tag.color, color: '#fff' }}
                    >
                      {tag.name}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {Object.keys(card.customFields || {}).length > 0 && (
            <div>
              <h4 className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                Campos Personalizados
              </h4>
              <div className="space-y-2">
                {Object.entries(card.customFields).map(([name, field]) => (
                  <div
                    key={name}
                    className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-dark-800' : 'bg-gray-100'}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{name}:</span>
                      <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                        {field.value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {card.subtasks?.length > 0 && (
            <div>
              <h4 className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                Subtarefas ({card.subtasks.filter(task => task.completed).length}/{card.subtasks.length})
              </h4>
              <div className="space-y-2">
                {card.subtasks.map((task) => (
                  <div
                    key={task.id}
                    className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-dark-800' : 'bg-gray-100'}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={task.completed ? 'text-[#7f00ff]' : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                        {task.completed ? <CheckSquare size={16} /> : <Square size={16} />}
                      </span>
                      <span className={`text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'} ${task.completed ? 'line-through opacity-50' : ''}`}>
                        {task.title}
                      </span>
                    </div>
                    {task.description && (
                      <p className={`mt-1 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} ml-6`}>
                        {task.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
