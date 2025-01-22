import React, { useState, useEffect } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsiveLine } from '@nivo/line';
import { useKanbanStore } from '../Clients/store/kanbanStore';
import { useFinancialStore } from '../../store/financialStore';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { ptBR } from 'date-fns/locale';

export function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get store values with proper initialization and error handling
  const kanbanStore = useKanbanStore();
  const financialStore = useFinancialStore();

  const [selectedBoard, setSelectedBoard] = useState('');
  const [startDate, setStartDate] = useState(new Date(new Date().setMonth(new Date().getMonth() - 1)));
  const [endDate, setEndDate] = useState(new Date());

  useEffect(() => {
    try {
      if (!kanbanStore || !financialStore) {
        throw new Error('Failed to load store data');
      }
      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsLoading(false);
    }
  }, [kanbanStore, financialStore]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg text-gray-600 dark:text-gray-300">Carregando...</div>
      </div>
    );
  }

  if (error) {
  return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg text-red-600 dark:text-red-400">
          Erro ao carregar dados: {error}
        </div>
      </div>
    );
  }

  // Safely access store values
  const boards = kanbanStore?.boards || [];
  const getCompletedListId = kanbanStore?.getCompletedListId;
  const transactions = financialStore?.transactions || [];

  // Ensure boards is always an array
  const availableBoards = Array.isArray(boards) ? boards : [];

  // Calculate Kanban values with strict null checks
  const selectedKanbanBoard = availableBoards.find(b => b.id === selectedBoard);
  const completedListId = selectedKanbanBoard && getCompletedListId ? getCompletedListId(selectedKanbanBoard.id) : null;
  const completedList = selectedKanbanBoard?.lists?.find(l => l.id === completedListId);
  
  const totalKanbanValue = selectedKanbanBoard?.lists?.reduce((total, list) => 
    total + (list.cards?.reduce((sum, card) => sum + (Number(card.value) || 0), 0) || 0), 0) || 0;
  
  const completedSalesValue = completedList?.cards?.reduce((sum, card) => 
    sum + (Number(card.value) || 0), 0) || 0;

  // Filter transactions by date with strict null checks
  const filteredTransactions = transactions.filter(t => {
    if (!t || !t.date) return false;
    try {
      const date = new Date(t.date);
      return date >= startDate && date <= endDate;
    } catch {
      return false;
    }
  });

  // Contract status data with strict null checks
  const contractData = [
    {
      status: 'Rascunho',
      value: availableBoards.reduce((count, board) => {
        if (!board || !board.lists) return count;
        return count + board.lists.reduce((c, list) => {
          if (!list || !list.cards) return c;
          return c + list.cards.filter(card => !card?.status || card.status === 'draft').length;
        }, 0);
      }, 0)
    },
    {
      status: 'Pendente',
      value: availableBoards.reduce((count, board) => {
        if (!board || !board.lists) return count;
        return count + board.lists.reduce((c, list) => {
          if (!list || !list.cards) return c;
          return c + list.cards.filter(card => card?.status === 'pending').length;
        }, 0);
      }, 0)
    },
    {
      status: 'Ativo',
      value: availableBoards.reduce((count, board) => {
        if (!board || !board.lists) return count;
        return count + board.lists.reduce((c, list) => {
          if (!list || !list.cards) return c;
          return c + list.cards.filter(card => card?.status === 'active').length;
        }, 0);
      }, 0)
    }
  ];

  // Financial data for line chart with strict null checks
  const financialData = [{
    id: 'receitas',
    data: filteredTransactions
      .filter(t => t?.type === 'income')
      .map(transaction => ({
        x: new Date(transaction.date).toISOString().split('T')[0],
        y: transaction.amount || 0
      }))
      .sort((a, b) => new Date(a.x).getTime() - new Date(b.x).getTime())
  }, {
    id: 'despesas',
    data: filteredTransactions
      .filter(t => t?.type === 'expense')
      .map(transaction => ({
        x: new Date(transaction.date).toISOString().split('T')[0],
        y: transaction.amount || 0
      }))
      .sort((a, b) => new Date(a.x).getTime() - new Date(b.x).getTime())
  }];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
          Resumo
        </h1>
        <div className="flex items-center gap-4">
          <select
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7f00ff] dark:bg-dark-700 dark:text-gray-100"
            value={selectedBoard}
            onChange={(e) => setSelectedBoard(e.target.value)}
          >
            <option value="">Selecione um quadro</option>
            {availableBoards.map((board) => (
              <option key={board.id} value={board.id}>
                {board.title || 'Quadro sem título'}
              </option>
            ))}
          </select>
          <div className="flex items-center gap-2">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date || new Date())}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7f00ff] dark:bg-dark-700 dark:text-gray-100"
              locale={ptBR}
              dateFormat="dd/MM/yyyy"
            />
            <span className="text-gray-500">até</span>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date || new Date())}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7f00ff] dark:bg-dark-700 dark:text-gray-100"
              locale={ptBR}
              dateFormat="dd/MM/yyyy"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-dark-700 p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-200 mb-2">
            Valor Total do Kanban
          </h3>
          <p className="text-2xl font-bold text-[#7f00ff]">
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(totalKanbanValue)}
          </p>
        </div>

        <div className="bg-dark-700 p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-200 mb-2">
            Valor de Vendas Concluídas
          </h3>
          <p className="text-2xl font-bold text-green-500">
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(completedSalesValue)}
          </p>
        </div>

        <div className="bg-dark-700 p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-200 mb-2">
            Taxa de Conversão
          </h3>
          <p className="text-2xl font-bold text-blue-500">
            {totalKanbanValue > 0
              ? `${((completedSalesValue / totalKanbanValue) * 100).toFixed(1)}%`
              : '0%'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-dark-700 p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-200 mb-4">
            Status dos Contratos
          </h3>
          <div className="h-[300px]">
            <ResponsiveBar
              data={contractData}
              keys={['value']}
              indexBy="status"
              margin={{ top: 20, right: 20, bottom: 40, left: 40 }}
              padding={0.3}
              colors={['#7f00ff']}
              borderRadius={4}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
              }}
              labelSkipWidth={12}
              labelSkipHeight={12}
              theme={{
                axis: {
                  ticks: {
                    text: {
                      fill: '#9CA3AF'
                    }
                  }
                },
                grid: {
                  line: {
                    stroke: '#374151'
                  }
                },
                labels: {
                  text: {
                    fill: '#E5E7EB'
                  }
                }
              }}
            />
          </div>
        </div>

        <div className="bg-dark-700 p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-200 mb-4">
            Movimentação Financeira
          </h3>
          <div className="h-[300px]">
            <ResponsiveLine
              data={financialData}
              margin={{ top: 20, right: 60, bottom: 50, left: 60 }}
              xScale={{
                type: 'time',
                format: '%Y-%m-%d',
                useUTC: false,
                precision: 'day',
              }}
              xFormat="time:%d/%m/%Y"
              yScale={{
                type: 'linear',
                min: 'auto',
                max: 'auto',
                stacked: false,
                reverse: false
              }}
              axisTop={null}
              axisRight={null}
              axisBottom={{
                format: '%d/%m',
                tickValues: 'every 7 days',
                tickSize: 5,
                tickPadding: 5,
                tickRotation: -45,
                legend: 'Data',
                legendOffset: 36,
                legendPosition: 'middle'
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Valor',
                legendOffset: -40,
                legendPosition: 'middle',
                format: value => 
                  new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                    notation: 'compact'
                  }).format(value)
              }}
              enablePoints={true}
              pointSize={8}
              pointColor={{ theme: 'background' }}
              pointBorderWidth={2}
              pointBorderColor={{ from: 'serieColor' }}
              enableArea={true}
              areaOpacity={0.15}
              useMesh={true}
              legends={[
                {
                  anchor: 'top-right',
                  direction: 'row',
                  justify: false,
                  translateX: 0,
                  translateY: -20,
                  itemsSpacing: 0,
                  itemDirection: 'left-to-right',
                  itemWidth: 80,
                  itemHeight: 20,
                  symbolSize: 12,
                  symbolShape: 'circle',
                  itemTextColor: '#E5E7EB',
                  effects: [
                    {
                      on: 'hover',
                      style: {
                        itemTextColor: '#F3F4F6'
                      }
                    }
                  ]
                }
              ]}
              theme={{
                axis: {
                  ticks: {
                    text: {
                      fill: '#9CA3AF'
                    }
                  }
                },
                grid: {
                  line: {
                    stroke: '#374151'
                  }
                },
                crosshair: {
                  line: {
                    stroke: '#9CA3AF'
                  }
                },
                tooltip: {
                  container: {
                    background: '#1F2937',
                    color: '#E5E7EB',
                    fontSize: '12px'
                  }
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}