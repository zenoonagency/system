import React from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface MonthSelectorProps {
  currentDate: Date;
  onMonthChange: (date: Date) => void;
  showAllTime: boolean;
  onToggleAllTime: () => void;
}

export function MonthSelector({ currentDate, onMonthChange, showAllTime, onToggleAllTime }: MonthSelectorProps) {
  const handlePreviousMonth = () => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1);
    onMonthChange(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1);
    onMonthChange(newDate);
  };

  return (
    <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg p-4 mb-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={handlePreviousMonth}
          disabled={showAllTime}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full disabled:opacity-50"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-[#7f00ff]" />
          <span className="text-lg font-medium text-gray-800 dark:text-gray-200">
            {showAllTime
              ? 'Todo Período'
              : format(currentDate, 'MMMM yyyy', { locale: ptBR })}
          </span>
        </div>
        <button
          onClick={handleNextMonth}
          disabled={showAllTime}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full disabled:opacity-50"
        >
          <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>
      <button
        onClick={onToggleAllTime}
        className={`px-4 py-2 rounded-md transition-colors ${
          showAllTime
            ? 'bg-[#7f00ff] text-white'
            : 'text-[#7f00ff] border border-[#7f00ff] hover:bg-[#7f00ff]/10'
        }`}
      >
        {showAllTime ? 'Voltar para Mês Atual' : 'Ver Tudo'}
      </button>
    </div>
  );
}