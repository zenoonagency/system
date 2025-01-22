import React from 'react';
import { KanbanBoard } from './components/KanbanBoard';

export function Kanban() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Gestão de funil</h1>
      <KanbanBoard />
    </div>
  );
}