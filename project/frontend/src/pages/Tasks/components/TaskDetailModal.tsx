import React from 'react';
import { X, Calendar, Flag, CheckSquare } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Task } from '../types';
import { CustomFieldsDisplay } from '../../../components/CustomFieldsDisplay';

interface TaskDetailModalProps {
  task: Task;
  onClose: () => void;
  onToggleComplete: () => void;
}

const priorityColors = {
  low: 'text-green-500',
  medium: 'text-yellow-500',
  high: 'text-red-500',
};

const priorityLabels = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
};

export function TaskDetailModal({ task, onClose, onToggleComplete }: TaskDetailModalProps) {
  const checklistProgress = task.checklist.length > 0
    ? Math.round((task.checklist.filter(item => item.completed).length / task.checklist.length) * 100)
    : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {task.title}
            </h2>
            <div className="flex items-center mt-2 space-x-4">
              <span className={`flex items-center ${priorityColors[task.priority]}`}>
                <Flag className="w-4 h-4 mr-1" />
                {priorityLabels[task.priority]}
              </span>
              <span className="text-gray-500 dark:text-gray-400">
                <Calendar className="w-4 h-4 inline mr-1" />
                {format(new Date(task.dueDate), "d 'de' MMMM", { locale: ptBR })}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          {task.description && (
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                Descrição
              </h3>
              <p className="text-gray-900 dark:text-gray-100">{task.description}</p>
            </div>
          )}

          {task.checklist.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  Checklist
                </h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {checklistProgress}% completo
                </span>
              </div>
              <div className="space-y-2">
                {task.checklist.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg"
                  >
                    <input
                      type="checkbox"
                      checked={item.completed}
                      readOnly
                      className="rounded text-[#7f00ff] focus:ring-[#7f00ff]"
                    />
                    <span className={`ml-3 ${
                      item.completed ? 'line-through text-gray-500' : 'text-gray-900 dark:text-gray-100'
                    }`}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {task.customFields && Object.keys(task.customFields).length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Campos Personalizados
              </h3>
              <CustomFieldsDisplay fields={task.customFields} />
            </div>
          )}

          <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onToggleComplete}
              className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                task.completed
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  : 'bg-[#7f00ff] text-white hover:bg-[#7f00ff]/90'
              }`}
            >
              <CheckSquare className="w-5 h-5 mr-2" />
              {task.completed ? 'Marcar como Pendente' : 'Marcar como Concluída'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}