import React, { useState } from 'react';
import { X, Calendar, Flag, CheckSquare, Square, Plus, Trash2, Phone, Tag as TagIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card, ChecklistItem } from '../types';
import { useKanbanStore } from '../store/kanbanStore';
import { useTagStore } from '../../../store/tagStore';
import { CustomFieldsSection } from '../../../components/CustomFieldsSection';
import { CustomFieldInput } from '../../../types/customFields';
import { useThemeStore } from '../../../store/themeStore';
import { generateId } from '../../../utils/generateId';

interface CardDetailModalProps {
  card: Card;
  onClose: () => void;
  listId: string;
  boardId: string;
}

export function CardDetailModal({ card, onClose, listId, boardId }: CardDetailModalProps) {
  const { theme } = useThemeStore();
  const { updateCard } = useKanbanStore();
  const { tags } = useTagStore();
  const [newTask, setNewTask] = useState('');
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description || '');
  const [value, setValue] = useState(card.value.toString());
  const [phone, setPhone] = useState(card.phone || '');
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(card.tagIds);
  const [customFields, setCustomFields] = useState<CustomFieldInput[]>(
    card.customFields
      ? Object.entries(card.customFields).map(([name, field]) => ({
          id: generateId(),
          name,
          type: field.type,
          value: field.value,
        }))
      : []
  );

  const handleSave = () => {
    const processedCustomFields = customFields.reduce((acc, field) => {
      if (field.name.trim()) {
        acc[field.name] = {
          type: field.type,
          value: field.value,
        };
      }
      return acc;
    }, {} as Record<string, { type: string; value: string }>);

    updateCard(boardId, listId, card.id, {
      title,
      description,
      value: parseFloat(value) || 0,
      phone,
      tagIds: selectedTagIds,
      customFields: processedCustomFields,
      checklist: card.checklist,
    });

    onClose();
  };

  const handleAddTask = () => {
    if (!newTask.trim()) return;

    const newChecklist = [
      ...(card.checklist || []),
      {
        id: generateId(),
        text: newTask.trim(),
        completed: false
      }
    ];

    updateCard(boardId, listId, card.id, { checklist: newChecklist });
    setNewTask('');
  };

  const toggleTask = (taskId: string) => {
    const newChecklist = card.checklist.map(item =>
      item.id === taskId ? { ...item, completed: !item.completed } : item
    );
    updateCard(boardId, listId, card.id, { checklist: newChecklist });
  };

  const deleteTask = (taskId: string) => {
    const newChecklist = card.checklist.filter(item => item.id !== taskId);
    updateCard(boardId, listId, card.id, { checklist: newChecklist });
  };

  const completedTasks = card.checklist?.filter(item => item.completed).length || 0;
  const totalTasks = card.checklist?.length || 0;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const isDark = theme === 'dark';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${isDark ? 'bg-dark-800' : 'bg-white'} rounded-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto`}>
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`text-2xl font-bold ${isDark ? 'text-gray-100' : 'text-gray-900'} bg-transparent border-b border-transparent hover:border-gray-200 focus:border-[#7f00ff] focus:outline-none w-full`}
            />
            <div className="flex items-center mt-2">
              <Phone className={`w-5 h-5 mr-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Telefone"
                className={`bg-transparent ${isDark ? 'text-gray-400' : 'text-gray-600'} border-b border-transparent hover:border-gray-200 focus:border-[#7f00ff] focus:outline-none`}
              />
            </div>
          </div>
          <button
            onClick={onClose}
            className={`${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          <div className={`${isDark ? 'bg-gray-700/50' : 'bg-gray-50'} p-4 rounded-lg`}>
            <h3 className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'} mb-2`}>
              Descrição
            </h3>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full ${isDark ? 'bg-gray-600 text-gray-100' : 'bg-white text-gray-900'} rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#7f00ff]`}
              rows={3}
            />
          </div>

          <div className={`${isDark ? 'bg-gray-700/50' : 'bg-gray-50'} p-4 rounded-lg`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-semibold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>Valor</h3>
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className={`${isDark ? 'bg-gray-600 text-gray-100' : 'bg-white text-gray-900'} rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#7f00ff]`}
                step="0.01"
              />
            </div>
          </div>

          <div className={`${isDark ? 'bg-gray-700/50' : 'bg-gray-50'} p-4 rounded-lg`}>
            <h3 className={`text-lg font-semibold ${isDark ? 'text-gray-100' : 'text-gray-900'} mb-4`}>
              Marcadores
            </h3>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => {
                    setSelectedTagIds(prev =>
                      prev.includes(tag.id)
                        ? prev.filter(id => id !== tag.id)
                        : [...prev, tag.id]
                    );
                  }}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedTagIds.includes(tag.id)
                      ? 'bg-opacity-100'
                      : 'bg-opacity-20 hover:bg-opacity-30'
                  }`}
                  style={{
                    backgroundColor: selectedTagIds.includes(tag.id) ? tag.color : undefined,
                    borderColor: tag.color,
                    borderWidth: '1px',
                    color: selectedTagIds.includes(tag.id) ? '#fff' : tag.color,
                  }}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>

          <div className={`${isDark ? 'bg-gray-700/50' : 'bg-gray-50'} p-4 rounded-lg`}>
            <h3 className={`text-lg font-semibold ${isDark ? 'text-gray-100' : 'text-gray-900'} mb-4`}>
              Campos Personalizados
            </h3>
            <CustomFieldsSection
              fields={customFields}
              onAddField={() => {
                setCustomFields([
                  ...customFields,
                  {
                    id: generateId(),
                    name: '',
                    type: 'text',
                    value: '',
                  },
                ]);
              }}
              onRemoveField={(id) => {
                setCustomFields(customFields.filter((field) => field.id !== id));
              }}
              onUpdateField={(id, key, value) => {
                setCustomFields(
                  customFields.map((field) =>
                    field.id === id ? { ...field, [key]: value } : field
                  )
                );
              }}
            />
          </div>

          <div className={`${isDark ? 'bg-gray-700/50' : 'bg-gray-50'} p-4 rounded-lg`}>
            <h3 className={`text-lg font-semibold ${isDark ? 'text-gray-100' : 'text-gray-900'} mb-4`}>
              Subtarefas {totalTasks > 0 && `(${completedTasks}/${totalTasks})`}
            </h3>

            <div className="mb-4">
              <div className={`h-2 ${isDark ? 'bg-gray-600' : 'bg-gray-200'} rounded-full`}>
                <div
                  className="h-2 bg-[#7f00ff] rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="space-y-2 mb-4">
              {card.checklist?.map((item) => (
                <div key={item.id} className={`flex items-center justify-between ${isDark ? 'bg-gray-600/50' : 'bg-gray-100'} p-2 rounded-lg`}>
                  <div className="flex items-center">
                    <button
                      onClick={() => toggleTask(item.id)}
                      className={`mr-2 ${item.completed ? 'text-[#7f00ff]' : isDark ? 'text-gray-400' : 'text-gray-500'}`}
                    >
                      {item.completed ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                    </button>
                    <span className={`${isDark ? 'text-gray-100' : 'text-gray-900'} ${item.completed ? 'line-through text-gray-400' : ''}`}>
                      {item.text}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteTask(item.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Adicionar subtarefa..."
                className={`flex-1 px-3 py-2 ${
                  isDark 
                    ? 'bg-gray-600 border-gray-500 text-gray-100' 
                    : 'bg-white border-gray-300 text-gray-900'
                } border rounded-md focus:outline-none focus:ring-2 focus:ring-[#7f00ff]`}
                onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
              />
              <button
                onClick={handleAddTask}
                className="px-3 py-2 bg-[#7f00ff] text-white rounded-md hover:bg-[#7f00ff]/90"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className={`flex justify-between items-center border-t ${isDark ? 'border-gray-700' : 'border-gray-200'} pt-4`}>
            <div className={`flex items-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              <Calendar className="w-5 h-5 mr-2" />
              {format(new Date(card.createdAt), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </div>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-[#7f00ff] text-white rounded-md hover:bg-[#7f00ff]/90"
            >
              Salvar Alterações
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
