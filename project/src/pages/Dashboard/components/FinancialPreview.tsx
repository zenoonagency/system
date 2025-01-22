import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency } from '../../../utils/formatters';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface FinancialPreviewProps {
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  recentTransactions: any[];
}

export function FinancialPreview({
  totalIncome,
  totalExpenses,
  netIncome,
  recentTransactions
}: FinancialPreviewProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total de Entradas</p>
              <p className="text-lg font-bold text-green-600 dark:text-green-400">{formatCurrency(totalIncome)}</p>
            </div>
            <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total de Saídas</p>
              <p className="text-lg font-bold text-red-600 dark:text-red-400">{formatCurrency(totalExpenses)}</p>
            </div>
            <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Saldo</p>
              <p className={`text-lg font-bold ${
                netIncome >= 0 
                  ? 'text-[#7f00ff] dark:text-[#9f3fff]' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {formatCurrency(netIncome)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {recentTransactions.map((transaction) => (
          <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div>
              <p className="font-medium text-gray-800 dark:text-gray-200">{transaction.description}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {format(new Date(transaction.date), "d 'de' MMM", { locale: ptBR })}
              </p>
            </div>
            <p className={`font-medium ${
              transaction.type === 'income' 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-red-600 dark:text-red-400'
            }`}>
              {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}