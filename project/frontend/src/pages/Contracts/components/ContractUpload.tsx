import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useContractStore } from '../store/contractStore';
import { generateId } from '../../../utils/generateId';

export function ContractUpload() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addContract } = useContractStore();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) return;

    const newContract = {
      id: generateId(),
      title,
      description,
      expirationDate,
      file: file.name,
      lastModified: new Date().toISOString(),
      versions: [
        {
          id: generateId(),
          timestamp: new Date().toISOString(),
          modifiedBy: 'Current User', // In a real app, get this from auth context
          changes: 'Initial contract upload',
        },
      ],
    };

    addContract(newContract);
    setIsModalOpen(false);
    setTitle('');
    setDescription('');
    setExpirationDate('');
    setFile(null);
  };

  if (!isModalOpen) {
    return (
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center px-4 py-2 bg-[#7f00ff] text-white rounded-md hover:bg-[#7f00ff]/90 transition-colors"
      >
        <Plus className="w-5 h-5 mr-2" />
        Novo Contrato
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <h2 className="text-xl font-semibold mb-4">Novo contrato</h2>
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
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data de Vencimento
            </label>
            <input
              type="date"
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#7f00ff] focus:ring focus:ring-[#7f00ff]/20"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Arquivo
            </label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full"
              accept=".pdf,.doc,.docx"
              required
            />
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#7f00ff] text-white rounded-md hover:bg-[#7f00ff]/90"
            >
              Criar Contrato
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}