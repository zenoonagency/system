import { create } from 'zustand';

interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: 'income' | 'expense';
  description: string;
}

interface FinancialState {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  removeTransaction: (id: string) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
}

export const useFinancialStore = create<FinancialState>((set) => ({
  transactions: [
    {
      id: '1',
      date: '2024-01-01',
      amount: 5000,
      type: 'income',
      description: 'Venda de serviço'
    },
    {
      id: '2',
      date: '2024-01-05',
      amount: 1500,
      type: 'expense',
      description: 'Despesas operacionais'
    },
    {
      id: '3',
      date: '2024-01-10',
      amount: 3000,
      type: 'income',
      description: 'Consultoria'
    },
    {
      id: '4',
      date: '2024-01-15',
      amount: 800,
      type: 'expense',
      description: 'Marketing'
    }
  ],
  addTransaction: (transaction) =>
    set((state) => ({
      transactions: [
        ...state.transactions,
        { ...transaction, id: Math.random().toString(36).substr(2, 9) }
      ]
    })),
  removeTransaction: (id) =>
    set((state) => ({
      transactions: state.transactions.filter((t) => t.id !== id)
    })),
  updateTransaction: (id, transaction) =>
    set((state) => ({
      transactions: state.transactions.map((t) =>
        t.id === id ? { ...t, ...transaction } : t
      )
    }))
})); 