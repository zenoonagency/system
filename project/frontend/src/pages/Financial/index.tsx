import React from 'react';
import { FinancialDashboard } from './components/FinancialDashboard';
import { TransactionList } from './components/TransactionList';
import { MonthSelector } from './components/MonthSelector';
import { useFinancialStore } from './store/financialStore';

export function Financial() {
  const {
    totalIncome,
    totalExpenses,
    netIncome,
    selectedDate,
    showAllTime,
    setSelectedDate,
    setShowAllTime,
  } = useFinancialStore();

  const handleMonthChange = (date: Date) => {
    setSelectedDate(date.toISOString());
  };

  const handleToggleAllTime = () => {
    setShowAllTime(!showAllTime);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Financeiro - Visão geral
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Acompanhe suas receitas e despesas
          </p>
        </div>
      </div>

      <MonthSelector
        currentDate={new Date(selectedDate)}
        onMonthChange={handleMonthChange}
        showAllTime={showAllTime}
        onToggleAllTime={handleToggleAllTime}
      />

      <FinancialDashboard
        totalIncome={totalIncome}
        totalExpenses={totalExpenses}
        netIncome={netIncome}
      />

      <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm">
        <TransactionList />
      </div>
    </div>
  );
}