import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (contact: any) => void;
  contact?: any;
}

export function ContactModal({ isOpen, onClose, onSave, contact }: ContactModalProps) {
  const [name, setName] = useState(contact?.name || '');
  const [email, setEmail] = useState(contact?.email || '');
  const [phone, setPhone] = useState(contact?.phone || '');
  const [customFields, setCustomFields] = useState(contact?.customFields || []);

  const handleUpdateCustomField = (id: string, key: string, value: any) => {
    setCustomFields(fields =>
      fields.map(field =>
        field.id === id ? { ...field, [key]: value } : field
      )
    );
  };

  const handleAddCustomField = () => {
    setCustomFields(fields => [
      ...fields,
      {
        id: Date.now().toString(),
        type: 'text',
        value: ''
      }
    ]);
  };

  const handleRemoveCustomField = (id: string) => {
    setCustomFields(fields => fields.filter(field => field.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      email,
      phone,
      customFields
    });
    onClose();
  };

  const renderFieldInput = (field: any) => {
    switch (field.type) {
      case 'number':
        return (
          <Input
            type="number"
            value={field.value}
            onChange={(e) => handleUpdateCustomField(field.id, 'value', e.target.value)}
          />
        );
      case 'date':
        return (
          <Input
            type="date"
            value={field.value}
            onChange={(e) => handleUpdateCustomField(field.id, 'value', e.target.value)}
          />
        );
      case 'boolean':
        return (
          <Select
            value={field.value}
            onChange={(e) => handleUpdateCustomField(field.id, 'value', e.target.value)}
          >
            <option value="">Selecione</option>
            <option value="true">Sim</option>
            <option value="false">Não</option>
          </Select>
        );
      case 'file':
        return (
          <Input
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                handleUpdateCustomField(field.id, 'value', file.name);
              }
            }}
          />
        );
      default:
        return (
          <Input
            type="text"
            value={field.value}
            onChange={(e) => handleUpdateCustomField(field.id, 'value', e.target.value)}
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
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            label="Nome"
            required
          />
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            label="Email"
            required
          />
          <Input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            label="Telefone"
            required
          />

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

            <div className="space-y-4">
              {customFields.map((field: any) => (
                <div key={field.id} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Select
                      value={field.type}
                      onChange={(e) => handleUpdateCustomField(field.id, 'type', e.target.value)}
                      className="w-24"
                    >
                      <option value="text">Texto</option>
                      <option value="number">Número</option>
                      <option value="date">Data</option>
                      <option value="boolean">Sim/Não</option>
                      <option value="file">Arquivo</option>
                    </Select>
                    <button 
                      type="button"
                      onClick={() => handleRemoveCustomField(field.id)} 
                      className="text-red-500 hover:text-red-700 p-2 hover:bg-gray-600/50 rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="mt-2">
                    {renderFieldInput(field)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#7f00ff] text-white rounded-md hover:bg-[#7f00ff]/90 transition-colors"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}