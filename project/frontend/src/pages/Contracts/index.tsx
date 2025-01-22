import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { ContractsList } from './components/ContractsList';
import { ContractModal } from './components/ContractModal';
import { useContractStore } from './store/contractStore';
import { Contract } from './types';

export function Contracts() {
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { contracts, addContract } = useContractStore();

  const filteredContracts = contracts.filter((contract) =>
    contract.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contract.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contract.clientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddContract = (contractData: Omit<Contract, 'id' | 'versions' | 'lastModified'>) => {
    addContract(contractData);
    setShowModal(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Contratos
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gerencie seus contratos e documentos
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Novo contrato
        </button>
      </div>

      <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm p-6">
        <div className="mb-6">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-dark-600 rounded-md leading-5 bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Buscar contratos..."
            />
          </div>
        </div>

        <ContractsList contracts={filteredContracts} />
      </div>

      {showModal && (
        <ContractModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSave={handleAddContract}
          mode="add"
        />
      )}
    </div>
  );
}