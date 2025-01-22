import React, { useState } from 'react';
import { X, Tag as TagIcon, Plus, Trash2 } from 'lucide-react';
import { Contact, CustomFieldType, CustomField } from '../types';
import { useTagStore } from '../../../store/tagStore';
import { generateId } from '../../../utils/generateId';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) => void;
  contact?: Contact;
}

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

export function ContactModal({ isOpen, onClose, onSave, contact }: ContactModalProps) {
  const [name, setName] = useState(contact?.name || '');
  const [phone, setPhone] = useState(contact?.phone || '');
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(contact?.tagIds || []);
  const [customFields, setCustomFields] = useState<CustomFieldInput[]>(
    contact?.customFields
      ? Object.entries(contact.customFields).map(([name, field]) => ({
          id: generateId(),
          name,
          type: field.type,
          value: field.value,
        }))
      : []
  );
  const { tags } = useTagStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const processedCustomFields: Record<string, CustomField> = {};
    customFields.forEach((field) => {
      if (field.name.trim()) {
        processedCustomFields[field.name] = {
          type: field.type,
          value: field.value,
        };
      }
    });

    onSave({
      name,
      phone: phone.replace(/\D/g, ''),
      tagIds: selectedTagIds,
      customFields: processedCustomFields,
    });
  };

  const toggleTag = (tagId: string) => {
    setSelectedTagIds((current) =>
      current.includes(tagId)
        ? current.filter((id) => id !== tagId)
        : [...current, tagId]
    );
  };

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            {contact ? 'Editar Contato' : 'Novo Contato'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nome
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7f00ff] dark:bg-gray-700 dark:text-gray-100"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Telefone
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7f00ff] dark:bg-gray-700 dark:text-gray-100"
              required
            />
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <TagIcon className="w-4 h-4 mr-1" />
              Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.id)}
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
              {contact ? 'Salvar' : 'Adicionar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}