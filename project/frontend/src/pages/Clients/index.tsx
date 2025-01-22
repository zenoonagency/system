// src/pages/Clients/index.tsx
import React from 'react';
import { BoardList } from './components/BoardList';
import { KanbanBoard } from './components/KanbanBoard';
import { useKanbanStore } from './store/kanbanStore';
import { Edit2, Copy, Trash2, EyeOff, Plus } from 'lucide-react';

export function Clients() {
  const { 
    boards,
    activeBoard,
    setActiveBoard,
    addBoard,
    updateBoard,
    deleteBoard,
    duplicateBoard,
    toggleBoardVisibility
  } = useKanbanStore();

  const handleAddBoard = () => {
    const newTitle = prompt('Nome do novo quadro:');
    if (newTitle) {
      addBoard(newTitle);
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
              Gestão de funil
            </h1>
            <select
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7f00ff] dark:bg-gray-700 dark:text-gray-100"
              value={activeBoard || ''}
              onChange={(e) => setActiveBoard(e.target.value)}
            >
              <option value="" disabled>Selecione um quadro</option>
              {boards.map((board) => (
                <option key={board.id} value={board.id}>
                  {board.title}
                </option>
              ))}
            </select>
            <button
              onClick={handleAddBoard}
              className="flex items-center px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              <Plus className="w-4 h-4 mr-1" />
              Novo Quadro
            </button>
          </div>
          {activeBoard && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  const newTitle = prompt('Novo nome do quadro:');
                  if (newTitle) updateBoard(activeBoard, newTitle);
                }}
                className="flex items-center px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                <Edit2 className="w-4 h-4 mr-1" />
                Editar
              </button>
              <button
                onClick={() => duplicateBoard(activeBoard)}
                className="flex items-center px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                <Copy className="w-4 h-4 mr-1" />
                Duplicar
              </button>
              <button
                onClick={() => {
                  if (confirm('Tem certeza que deseja excluir este quadro?')) {
                    deleteBoard(activeBoard);
                  }
                }}
                className="flex items-center px-3 py-1.5 text-sm bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Excluir
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <BoardList />
        <KanbanBoard />
      </div>
    </div>
  );
}
