import React, { useState } from 'react';
import { Eye, Download, FileText, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Contract, ContractStatus } from '../types';
import { ContractModal } from './ContractModal';
import { PDFViewerModal } from './PDFViewerModal';
import { formatCurrency } from '../../../utils/formatters';
import { useContractStore } from '../store/contractStore';
import { useCustomModal } from '../../../components/CustomModal';
import { generateId } from '../../../utils/generateId';

interface ContractsListProps {
  contracts: Contract[];
}

export function ContractsList({ contracts }: ContractsListProps) {
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [viewingContract, setViewingContract] = useState<Contract | null>(null);
  const { updateContract, deleteContract } = useContractStore();
  const { modal, customConfirm } = useCustomModal();

  const getStatusBadge = (status: ContractStatus) => {
    const statusClasses = {
      Active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      Draft: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400',
    };

    const statusLabels = {
      Active: 'Ativo',
      Pending: 'Pendente',
      Draft: 'Rascunho',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusClasses[status]}`}>
        {statusLabels[status]}
      </span>
    );
  };

  const handleUpdateContract = (updatedData: Omit<Contract, 'id' | 'versions' | 'lastModified'>) => {
    if (selectedContract) {
      const newVersion = {
        id: generateId(),
        timestamp: new Date().toISOString(),
        modifiedBy: 'Current User',
        changes: 'Contract updated'
      };

      const updatedContract: Contract = {
        ...selectedContract,
        ...updatedData,
        lastModified: new Date().toISOString(),
        versions: [...selectedContract.versions, newVersion]
      };

      updateContract(updatedContract);
      setSelectedContract(null);
    }
  };

  const handleDeleteContract = async (contractId: string) => {
    const confirmed = await customConfirm(
      'Excluir contrato',
      'Tem certeza de que deseja excluir este contrato?'
    );
    
    if (confirmed) {
      try {
        await deleteContract(contractId);
      } catch (error) {
        console.error('Erro ao excluir contrato', error);
      }
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="min-w-full">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr className="bg-white dark:bg-gray-800">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Contrato</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Data</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Valor</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {contracts.map((contract) => (
                <tr key={contract.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FileText className="flex-shrink-0 h-5 w-5 text-gray-400 dark:text-gray-500" />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-200">{contract.title}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{contract.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-200">{contract.clientName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(contract.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {format(new Date(contract.expirationDate), "dd MMM yyyy", { locale: ptBR })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                    {formatCurrency(contract.value)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-3">
                      <button
                        onClick={() => setViewingContract(contract)}
                        className="text-[#7f00ff] hover:text-[#7f00ff]/80 transition-colors"
                        title="Visualizar PDF"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => {
                          if (contract.file) {
                            window.open(contract.file, '_blank');
                          }
                        }}
                        className="text-[#7f00ff] hover:text-[#7f00ff]/80 transition-colors"
                        title="Download"
                      >
                        <Download className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => setSelectedContract(contract)}
                        className="text-[#7f00ff] hover:text-[#7f00ff]/80 transition-colors"
                        title="Editar"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteContract(contract.id)}
                        className="text-red-600 hover:text-red-400 transition-colors"
                        title="Excluir"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedContract && (
        <ContractModal
          contract={selectedContract}
          isOpen={true}
          onClose={() => setSelectedContract(null)}
          onSave={handleUpdateContract}
          mode="edit"
        />
      )}

      {viewingContract && (
        <PDFViewerModal
          isOpen={true}
          onClose={() => setViewingContract(null)}
          fileUrl={viewingContract.file}
          fileName={`${viewingContract.title}-contrato.pdf`}
        />
      )}

      {modal}
    </>
  );
}