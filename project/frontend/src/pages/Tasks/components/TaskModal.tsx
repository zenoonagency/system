import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Task, Priority } from '../types';
import { CustomFieldType } from '../../../types/customFields';
import { generateId } from '../../../utils/generateId';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  task?: Task;
}

const priorities: Priority[] = ['low', 'medium', 'high'];
const fieldTypes: { value: CustomFieldType; label: string }[] = [
  { value: 'text', label: 'Texto' },
  { value: 'number', label: 'Número' },
  { value: 'date', label: 'Data' },
  { value: 'boolean', label: 'Sim/Não' },
  { value: 'file', label: 'Arquivo' },
];

interface CustomFieldInput {
  id: string;
  name: string;
  type: CustomFieldType;
  value: string;
}

export function TaskModal({ isOpen, onClose, onSave, task }: TaskModalProps) {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [priority, setPriority] = useState<Priority>(task?.priority || 'medium');
  const [dueDate, setDueDate] = useState(task?.dueDate || new Date().toISOString().split('T')[0]);
  const [customFields, setCustomFields] = useState<CustomFieldInput[]>(
    task?.customFields
      ? Object.entries(task.customFields).map(([name, field]) => ({
          id: generateId(),
          name,
          type: field.type,
          value: field.value,
        }))
      : []
  );

  const handleAddCustomField = () => {
    setCustomFields([
      ...customFields,
      {
        id: generateId(),
        name: '',
        type: 'text',
        value: '',
      },
    ]);
  };

  const handleRemoveCustomField = (id: string) => {
    setCustomFields(customFields.filter((field) => field.id !== id));
  };

  const handleUpdateCustomField = (
    id: string,
    key: keyof CustomFieldInput,
    value: string
  ) => {
    setCustomFields(
      customFields.map((field) =>
        field.id === id ? { ...field, [key]: value } : field
      )
    );
  };

  const renderFieldInput = (field: CustomFieldInput) => {
    switch (field.type) {
      case 'number':
        return (
          <input
            type="number"
            value={field.value}
            onChange={(e) => handleUpdateCustomField(field.id, 'value', e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7f00ff] dark:bg-gray-700 dark:text-gray-100"
          />
        );
      case 'date':
        return (
          <input
            type="date"
            value={field.value}
            onChange={(e) => handleUpdateCustomField(field.id, 'value', e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7f00ff] dark:bg-gray-700 dark:text-gray-100"
          />
        );
      case 'boolean':
        return (
          <select
            value={field.value}
            onChange={(e) => handleUpdateCustomField(field.id, 'value', e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7f00ff] dark:bg-gray-700 dark:text-gray-100"
          >
            <option value="">Selecione</option>
            <option value="true">Sim</option>
            <option value="false">Não</option>
          </select>
        );
      case 'file':
        return (
          <input
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                handleUpdateCustomField(field.id, 'value', file.name);
              }
            }}
            className="flex-1"
          />
        );
      default:
        return (
          <input
            type="text"
            value={field.value}
            onChange={(e) => handleUpdateCustomField(field.id, 'value', e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7f00ff] dark:bg-gray-700 dark:text-gray-100"
          />
        );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const processedCustomFields = customFields.reduce((acc, field) => {
      if (field.name.trim()) {
        acc[field.name] = {
          type: field.type,
          value: field.value,
        };
      }
      return acc;
    }, {} as Record<string, { type: string; value: string }>);

    onSave({
      title,
      description,
      priority,
      dueDate,
      completed: false,
      checklist: [],
      customFields: processedCustomFields,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            {task ? 'Editar Tarefa' : 'Nova Tarefa'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Título
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7f00ff] dark:bg-gray-700 dark:text-gray-100"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Descrição
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7f00ff] dark:bg-gray-700 dark:text-gray-100"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Prioridade
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7f00ff] dark:bg-gray-700 dark:text-gray-100"
            >
              {priorities.map((p) => (
                <option key={p} value={p}>
                  {p === 'low' ? 'Baixa' : p === 'medium' ? 'Média' : 'Alta'}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Data de Vencimento
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7f00ff] dark:bg-gray-700 dark:text-gray-100"
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Campos Personalizados
              </label>
              <button
                type="button"
                onClick={handleAddCustomField}
                className="text-[#7f00ff] hover:text-[#7f00ff]/80 flex items-center"
              >
                <Plus size={16} className="mr-1" />
                Adicionar Campo
              </button>
            </div>

            {customFields.map((field) => (
              <div key={field.id} className="flex gap-2 items-start">
                <input
                  type="text"
                  placeholder="Nome do Campo"
                  value={field.name}
                  onChange={(e) => handleUpdateCustomField(field.id, 'name', e.target.value)}
                  className="w-1/3 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7f00ff] dark:bg-gray-700 dark:text-gray-100"
                />
                <select
                  value={field.type}
                  onChange={(e) => handleUpdateCustomField(field.id, 'type', e.target.value as CustomFieldType)}
                  className="w-1/4 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7f00ff] dark:bg-gray-700 dark:text-gray-100"
                >
                  {fieldTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
                {renderFieldInput(field)}
                <button
                  type="button"
                  onClick={() => handleRemoveCustomField(field.id)}
                  className="text-red-500 hover:text-red-600 p-2"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#7f00ff] text-white rounded-md hover:bg-[#7f00ff]/90"
            >
              {task ? 'Salvar' : 'Criar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}