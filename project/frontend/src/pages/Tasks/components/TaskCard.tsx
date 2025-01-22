import React, { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CheckSquare, Square, Clock, MoreVertical, Edit2, Copy, Trash2 } from 'lucide-react';
import { Task } from '../types';
import { motion } from 'framer-motion';
import { TaskDetailModal } from './TaskDetailModal';

interface TaskCardProps {
  task: Task;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

export function TaskCard({ task, onToggle, onEdit, onDelete, onDuplicate }: TaskCardProps) {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const priorityColors = {
    high: 'text-red-500',
    medium: 'text-yellow-500',
    low: 'text-green-500',
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!e.defaultPrevented) {
      setShowDetailModal(true);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-all group"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1" onClick={handleClick}>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggle();
              }}
              className={`mt-1 ${task.completed ? 'text-[#7f00ff]' : 'text-gray-400'} hover:text-[#7f00ff]`}
            >
              {task.completed ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
            </button>
            <div className="flex-1">
              <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900 dark:text-gray-100'}`}>
                {task.title}
              </h3>
              {task.description && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {task.description}
                </p>
              )}
              <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                <Clock className="w-4 h-4 mr-1" />
                {format(new Date(task.dueDate), "d 'de' MMM", { locale: ptBR })}
                <span className={`ml-3 ${priorityColors[task.priority]}`}>
                  • {task.priority === 'low' ? 'Baixa' : task.priority === 'medium' ? 'Média' : 'Alta'}
                </span>
              </div>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreVertical className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-10">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onEdit();
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Editar
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onDuplicate();
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicar
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
                      onDelete();
                    }
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {showDetailModal && (
        <TaskDetailModal
          task={task}
          onClose={() => setShowDetailModal(false)}
          onToggleComplete={onToggle}
        />
      )}
    </>
  );
}