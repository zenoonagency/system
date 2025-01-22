import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Contract, ContractStatus } from '../types';
import { CustomFieldsSection } from '../../../components/CustomFieldsSection';
import { CustomFieldInput } from '../../../types/customFields';
import { generateId } from '../../../utils/generateId';

interface ContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (contract: Omit<Contract, 'id' | 'versions' | 'lastModified'>) => void;
  contract?: Contract;
  mode: 'add' | 'edit';
}

export function ContractModal({ isOpen, onClose, onSave, contract, mode }: ContractModalProps) {
  const [title, setTitle] = useState(contract?.title || '');
  const [description, setDescription] = useState(contract?.description || '');
  const [clientName, setClientName] = useState(contract?.clientName || '');
  const [status, setStatus] = useState<ContractStatus>(contract?.status || 'Draft');
  const [value, setValue] = useState(contract?.value?.toString() || '');
  const [expirationDate, setExpirationDate] = useState(
    contract?.expirationDate?.split('T')[0] || new Date().toISOString().split('T')[0]
  );
  const [file, setFile] = useState<File | null>(null);
  const [customFields, setCustomFields] = useState<CustomFieldInput[]>(
    contract?.customFields
      ? Object.entries(contract.customFields).map(([name, field]) => ({
          id: generateId(),
          name,
          type: field.type,
          value: field.value,
        }))
      : []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let fileUrl = contract?.file || '';
    
    if (file) {
      // Convert file to base64 for storage
      const reader = new FileReader();
      fileUrl = await new Promise((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    }

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
      clientName,
      status,
      value: parseFloat(value) || 0,
      expirationDate,
      file: fileUrl,
      customFields: processedCustomFields,
    });
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            {mode === 'add' ? 'Novo Contrato' : 'Editar Contrato'}
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
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-[#7f00ff] focus:border-[#7f00ff] bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
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
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-[#7f00ff] focus:border-[#7f00ff] bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nome do Cliente
            </label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-[#7f00ff] focus:border-[#7f00ff] bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ContractStatus)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-[#7f00ff] focus:border-[#7f00ff] bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="Draft">Rascunho</option>
              <option value="Pending">Pendente</option>
              <option value="Active">Ativo</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Valor
            </label>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-[#7f00ff] focus:border-[#7f00ff] bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              required
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Data de Expiração
            </label>
            <input
              type="date"
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-[#7f00ff] focus:border-[#7f00ff] bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Arquivo PDF
            </label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full"
              accept="application/pdf"
            />
            {contract?.file && !file && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Arquivo atual: {contract.title}.pdf
              </p>
            )}
          </div>

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
              {mode === 'add' ? 'Criar Contrato' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}