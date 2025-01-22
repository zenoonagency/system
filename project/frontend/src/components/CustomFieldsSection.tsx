import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { CustomFieldType, CustomFieldInput, fieldTypes } from '../types/customFields';

interface CustomFieldsSectionProps {
  fields: CustomFieldInput[];
  onAddField: () => void;
  onRemoveField: (id: string) => void;
  onUpdateField: (id: string, key: keyof CustomFieldInput, value: string) => void;
}

export function CustomFieldsSection({
  fields,
  onAddField,
  onRemoveField,
  onUpdateField,
}: CustomFieldsSectionProps) {
  const renderFieldInput = (field: CustomFieldInput) => {
    switch (field.type) {
      case 'number':
        return (
          <input
            type="number"
            value={field.value}
            onChange={(e) => onUpdateField(field.id, 'value', e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7f00ff] dark:bg-gray-700 dark:text-gray-100"
          />
        );
      case 'date':
        return (
          <input
            type="date"
            value={field.value}
            onChange={(e) => onUpdateField(field.id, 'value', e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7f00ff] dark:bg-gray-700 dark:text-gray-100"
          />
        );
      case 'boolean':
        return (
          <select
            value={field.value}
            onChange={(e) => onUpdateField(field.id, 'value', e.target.value)}
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
                onUpdateField(field.id, 'value', file.name);
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
            onChange={(e) => onUpdateField(field.id, 'value', e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7f00ff] dark:bg-gray-700 dark:text-gray-100"
          />
        );
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Campos Personalizados
        </label>
        <button
          type="button"
          onClick={onAddField}
          className="text-[#7f00ff] hover:text-[#7f00ff]/80 flex items-center"
        >
          <Plus size={16} className="mr-1" />
          Adicionar Campo
        </button>
      </div>

      {fields.map((field) => (
        <div key={field.id} className="flex gap-2 items-start">
          <input
            type="text"
            placeholder="Nome do Campo"
            value={field.name}
            onChange={(e) => onUpdateField(field.id, 'name', e.target.value)}
            className="w-1/3 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7f00ff] dark:bg-gray-700 dark:text-gray-100"
          />
          <select
            value={field.type}
            onChange={(e) => onUpdateField(field.id, 'type', e.target.value as CustomFieldType)}
            className="w-1/4 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7f00ff] dark:bg-gray-700 dark:text-gray-100"
          >
            {fieldTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
          {renderFieldInput(field)}
          <button
            type="button"
            onClick={() => onRemoveField(field.id)}
            className="text-red-500 hover:text-red-600 p-2"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}