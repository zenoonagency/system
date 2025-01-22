import React, { useState } from 'react';
import { X, Plus, Trash2, Tag as TagIcon, Calendar, Clock, User } from 'lucide-react';
import { useKanbanStore } from '../store/kanbanStore';
import { useTagStore } from '../../../store/tagStore';
import { useTeamStore } from '../../../pages/Team/store/teamStore';
import { CustomFieldType } from '../../../types/customFields';
import { useThemeStore } from '../../../store/themeStore';
import { generateId } from '../../../utils/generateId';

interface CardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (cardData: any) => void;
  mode: 'add' | 'edit';
  boardId: string;
  listId: string;
  card?: any;
}

interface CustomFieldInput {
  id: string;
  name: string;
  type: CustomFieldType;
  value: string | number | boolean | File;
}

const fieldTypes: { value: CustomFieldType; label: string }[] = [
  { value: 'text', label: 'Texto' },
  { value: 'number', label: 'Número' },
  { value: 'date', label: 'Data' },
  { value: 'boolean', label: 'Sim/Não' },
  { value: 'file', label: 'Arquivo' },
];

export function CardModal({ isOpen, onClose, onSave, mode, boardId, listId, card }: CardModalProps) {
  const { theme } = useThemeStore();
  const { tags } = useTagStore();
  const { members } = useTeamStore();
  const [title, setTitle] = useState(card?.title || '');
  const [description, setDescription] = useState(card?.description || '');
  const [value, setValue] = useState((card?.value || 0).toString());
  const [phone, setPhone] = useState(card?.phone || '');
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(card?.tagIds || []);
  const [scheduledDate, setScheduledDate] = useState(card?.scheduledDate || '');
  const [scheduledTime, setScheduledTime] = useState(card?.scheduledTime || '');
  const [responsibleId, setResponsibleId] = useState(card?.responsibleId || '');
  const [customFields, setCustomFields] = useState<CustomFieldInput[]>(
    card?.customFields
      ? Object.entries(card.customFields).map(([name, field]) => ({
          id: generateId(),
          name,
          type: field.type,
          value: field.value,
        }))
      : []
  );

  const isDark = theme === 'dark';

  const handleAddCustomField = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Impede o comportamento padrão do botão
    setCustomFields([...customFields, { id: generateId(), name: '', type: 'text', value: '' }]);
  };

  const handleRemoveCustomField = (id: string) => {
    setCustomFields(customFields.filter((field) => field.id !== id));
  };

  const handleUpdateCustomField = (id: string, key: keyof CustomFieldInput, value: string | number | boolean | File) => {
    setCustomFields(customFields.map((field) => (field.id === id ? { ...field, [key]: value } : field)));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const processedCustomFields = customFields.reduce((acc, field) => {
      if (field.name.trim()) {
        acc[field.name] = { type: field.type, value: field.value };
      }
      return acc;
    }, {} as Record<string, { type: string; value: string | number | boolean | File }>);

    const cardData = {
      title,
      description,
      value: parseFloat(value) || 0,
      phone,
      tagIds: selectedTagIds,
      customFields: processedCustomFields,
      scheduledDate,
      scheduledTime,
      responsibleId,
      checklist: [],
    };

    onSave(cardData);
    onClose();
  };

  const renderFieldInput = (field: CustomFieldInput) => {
    switch (field.type) {
      case 'number':
        return (
          <input
            type="number"
            value={field.value}
            onChange={(e) => handleUpdateCustomField(field.id, 'value', parseFloat(e.target.value))}
            className={`w-full px-3 py-2 h-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#7f00ff] ${isDark ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}`}
          />
        );
      case 'date':
        return (
          <input
            type="date"
            value={field.value as string}
            onChange={(e) => handleUpdateCustomField(field.id, 'value', e.target.value)}
            className={`w-full px-3 py-2 h-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#7f00ff] ${isDark ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}`}
          />
        );
      case 'boolean':
        return (
          <select
            value={field.value as string}
            onChange={(e) => handleUpdateCustomField(field.id, 'value', e.target.value === 'true')}
            className={`w-full px-3 py-2 h-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#7f00ff] ${isDark ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}`}
          >
            <option value="false">Não</option>
            <option value="true">Sim</option>
          </select>
        );
      case 'file':
        return (
          <input
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                handleUpdateCustomField(field.id, 'value', file);
              }
            }}
            className="w-full h-10"
          />
        );
      default:
        return (
          <input
            type="text"
            value={field.value as string}
            onChange={(e) => handleUpdateCustomField(field.id, 'value', e.target.value)}
            className={`w-full px-3 py-2 h-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#7f00ff] ${isDark ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}`}
          />
        );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg w-full max-w-2xl p-6`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-xl font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
            {mode === 'edit' ? 'Editar Cartão' : 'Novo Cartão'}
          </h2>
          <button onClick={onClose} className={`${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Título</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#7f00ff] ${isDark ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}`}
              required
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Descrição</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#7f00ff] ${isDark ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}`}
              rows={3}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Telefone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#7f00ff] ${isDark ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Valor</label>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#7f00ff] ${isDark ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}`}
              step="0.01"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`flex items-center text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                <Calendar className="w-4 h-4 mr-1" />
                Data do Agendamento
              </label>
              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#7f00ff] ${isDark ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}`}
              />
            </div>
            <div>
              <label className={`flex items-center text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                <Clock className="w-4 h-4 mr-1" />
                Horário
              </label>
              <input
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#7f00ff] ${isDark ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}`}
              />
            </div>
          </div>

          <div>
            <label className={`flex items-center text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
              <User className="w-4 h-4 mr-1" />
              Responsável
            </label>
            <select
              value={responsibleId}
              onChange={(e) => setResponsibleId(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#7f00ff] ${isDark ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}`}
            >
              <option value="">Selecione um responsável</option>
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={`flex items-center text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              <TagIcon className="w-4 h-4 mr-1" />
              Marcadores
            </label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => {
                    setSelectedTagIds((prev) => (prev.includes(tag.id) ? prev.filter((id) => id !== tag.id) : [...prev, tag.id]));
                  }}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${selectedTagIds.includes(tag.id) ? 'bg-opacity-100' : 'bg-opacity-20 hover:bg-opacity-30'}`}
                  style={{ backgroundColor: selectedTagIds.includes(tag.id) ? tag.color : `${tag.color}20`, borderColor: tag.color, borderWidth: '1px', color: selectedTagIds.includes(tag.id) ? '#fff' : tag.color }}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {customFields.map((field) => (
              <div key={field.id} className="flex items-center gap-2">
                <input
                  type="text"
                  value={field.name}
                  onChange={(e) => handleUpdateCustomField(field.id, 'name', e.target.value)}
                  placeholder="Nome"
                  className={`w-1/3 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#7f00ff] ${isDark ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}`}
                />
                <select
                  value={field.type}
                  onChange={(e) => handleUpdateCustomField(field.id, 'type', e.target.value)}
                  className={`w-1/3 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#7f00ff] ${isDark ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}`}
                >
                  {fieldTypes.map(({ value, label }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
                <div className="w-1/3">
                  {renderFieldInput(field)}
                </div>
                <button onClick={() => handleRemoveCustomField(field.id)} className="text-red-500 hover:text-red-700">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
          <button type="button" onClick={handleAddCustomField} className="flex items-center text-[#7f00ff] hover:text-[#7f00ff]/80 mt-4">
            <Plus size={20} className="mr-1" /> Adicionar Campo Personalizado
          </button>

          <div className="flex justify-end gap-2 mt-6">
            <button type="button" onClick={onClose} className={`px-4 py-2 ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'}`}>
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 bg-[#7f00ff] text-white rounded-md hover:bg-[#7f00ff]/90">
              {mode === 'edit' ? 'Salvar' : 'Criar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}