import React from 'react';
import { FileText } from 'lucide-react';
import { Contract } from '../../Contracts/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { formatCurrency } from '../../../utils/formatters';

interface ContractPreviewProps {
  contracts: Contract[];
}

export function ContractPreview({ contracts }: ContractPreviewProps) {
  if (contracts.length === 0) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 py-4">
        No contracts available. Create your first contract!
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {contracts.map((contract) => (
        <div key={contract.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="flex items-center space-x-3">
            <FileText className="w-5 h-5 text-[#7f00ff]" />
            <div>
              <p className="font-medium text-gray-800 dark:text-gray-200">{contract.title}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {contract.clientName} • {formatCurrency(contract.value)}
              </p>
            </div>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Expires {format(new Date(contract.expirationDate), "d 'de' MMM", { locale: ptBR })}
          </div>
        </div>
      ))}
    </div>
  );
}