export type DataColumnType = 'text' | 'number' | 'date' | 'boolean' | 'select';

export interface DataColumn {
  id: string;
  name: string;
  type: DataColumnType;
  options?: string[]; // For select type
}

export interface DataTable {
  id: string;
  name: string;
  columns: DataColumn[];
  data: Record<string, any>[];
  createdAt: string;
  updatedAt: string;
}

export interface DataTablesState {
  tables: DataTable[];
  activeTableId: string | null;
  addTable: (table: Omit<DataTable, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTable: (id: string, updates: Partial<DataTable>) => void;
  deleteTable: (id: string) => void;
  setActiveTable: (id: string | null) => void;
  importData: (tableId: string, data: Record<string, any>[]) => void;
}