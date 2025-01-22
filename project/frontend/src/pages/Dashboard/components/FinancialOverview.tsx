import React from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { useFinancialStore } from '../../Financial/store/financialStore';
import { useContractStore } from '../../Contracts/store/contractStore';
import { formatCurrency } from '../../../utils/formatters';

// Registrando componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export function FinancialOverview() {
  const { transactions } = useFinancialStore();
  const { contracts } = useContractStore();

  // Processamento dos dados financeiros por mês
  const monthlyData = transactions.reduce((acc, transaction) => {
    const date = new Date(transaction.date);
    const month = date.toLocaleString('default', { month: 'short' });
    
    if (!acc[month]) {
      acc[month] = { income: 0, expenses: 0 };
    }
    
    if (transaction.type === 'income') {
      acc[month].income += transaction.amount;
    } else if (transaction.type === 'expense') {
      acc[month].expenses += transaction.amount;
    }
    
    return acc;
  }, {} as Record<string, { income: number; expenses: number }>);

  const months = Object.keys(monthlyData);
  const incomeData = months.map(month => monthlyData[month].income);
  const expenseData = months.map(month => monthlyData[month].expenses);

  // Processamento dos dados de status dos contratos
  const contractStatusData = contracts.reduce((acc, contract) => {
    acc[contract.status] = (acc[contract.status]||0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Configuração dos dados para o gráfico de linha
  const lineChartData = {
    labels: months,
    datasets: [
      {
        label: 'Receitas',
        data: incomeData,
        borderColor: 'rgb(34, 197, 94)', // Cor da linha de receitas
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        tension: 0.4, // Suavização da linha
        fill: false, // Não preencher abaixo da linha
      },
      {
        label: 'Despesas',
        data: expenseData,
        borderColor: 'rgb(239, 68, 68)', // Cor da linha de despesas
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        tension: 0.4, // Suavização da linha
        fill: false, // Não preencher abaixo da linha
      },
    ],
  };

  // Configuração dos dados para o gráfico de rosca
  const doughnutChartData = {
    labels: ['Ativos', 'Pendentes', 'Rascunhos'],
    datasets: [
      {
        data: [
          contractStatusData.Active||0,
          contractStatusData.Pending||0,
          contractStatusData.Draft||0,
        ],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(234, 179, 8, 0.8)',
          'rgba(107, 114, 128, 0.8)',
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(234, 179, 8)',
          'rgb(107, 114, 128)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Opções de configuração do gráfico de linha
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'rgb(156, 163, 175)',
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true, // Começar o eixo Y do zero
        ticks: {
          callback: (value: number) => formatCurrency(value),
          color: 'rgb(156, 163, 175)',
        },
        grid: {
          color: 'rgba(156, 163, 175, 0.2)', // Cor das linhas de grade
          borderDash: [5, 5], // Estilo tracejado para as linhas de grade
        },
      },
      x: {
        ticks: {
          color: 'rgb(156, 163, 175)',
        },
        grid: {
          color: 'rgba(156, 163, 175, 0.2)', // Cor das linhas de grade
          borderDash: [5, 5], // Estilo tracejado para as linhas de grade
        },
      },
    },
  };

  // Opções de configuração do gráfico de rosca
  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'rgb(156, 163, 175)',
        },
      },
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <div className="bg-white dark:bg-dark-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Visão Geral Financeira
        </h3>
        <Line data={lineChartData} options={chartOptions} />
      </div>
      
      <div className="bg-white dark:bg-dark-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Status dos Contratos
        </h3>
        <div className="flex items-center justify-center h-[300px]">
          <Doughnut data={doughnutChartData} options={doughnutOptions} />
        </div>
      </div>
    </div>
  );
}
