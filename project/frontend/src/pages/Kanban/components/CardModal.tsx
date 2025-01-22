import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Card, Priority } from '../types';
import { generateId } from '../../../utils/generateId';

interface CardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (listId: string, card: Omit<Card, 'id'>) => void;
  initialCard?: Card;
  mode: 'add' | 'edit';
  listId: string;
}

interface CustomField {
  id: string;
  name: string;
  value: string;
}

const priorities: Priority[] = ['Baixa', 'Média', 'Alta', 'Urgente'];

export function CardModal({ isOpen, onClose, onSave, initialCard, mode, listId }: CardModalProps) {
  const [title, setTitle] = useState(initialCard?.title || '');
  const [description, setDescription] = useState(initialCard?.description || '');
  const [priority, setPriority] = useState<Priority>(initialCard?.priority || 'Média');
  const [dueDate, setDueDate] = useState(initialCard?.dueDate || new Date().toISOString().split('T')[0]);
  const [customFields, setCustomFields] = useState<CustomField[]>([]);

  if (!isOpen) return null;

  const handleAddCustomField = () => {
    setCustomFields([...customFields, { id: generateId(), name: '', value: '' }]);
  };

  const handleRemoveCustomField = (id: string) => {
    setCustomFields(customFields.filter(field => field.id !== id));
  };

  const handleUpdateCustomField = (id: string, key: 'name' | 'value', value: string) => {
    setCustomFields(customFields.map(field => 
      field.id === id ? { ...field, [key]: value } : field
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(listId, {
      title,
      description,
      priority,
      dueDate,
      customFields: customFields.reduce((acc, field) => ({
        ...acc,
        [field.name]: field.value
      }), {})
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {mode === 'add' ? 'Novo Cartão' : 'Editar Cartão'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#7f00ff] focus:ring focus:ring-[#7f00ff]/20"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#7f00ff] focus:ring focus:ring-[#7f00ff]/20"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prioridade
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#7f00ff] focus:ring focus:ring-[#7f00ff]/20"
            >
              {priorities.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prazo
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#7f00ff] focus:ring focus:ring-[#7f00ff]/20"
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-gray-700">
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
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#7f00ff] focus:ring focus:ring-[#7f00ff]/20"
                />
                <input
                  type="text"
                  placeholder="Valor"
                  value={field.value}
                  onChange={(e) => handleUpdateCustomField(field.id, 'value', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#7f00ff] focus:ring focus:ring-[#7f00ff]/20"
                />
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
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#7f00ff] text-white rounded-md hover:bg-[#7f00ff]/90"
            >
              {mode === 'add' ? 'Criar' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
