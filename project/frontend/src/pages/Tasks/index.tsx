import React, { useState } from 'react';
import { Plus, Filter, CheckSquare } from 'lucide-react';
import { useTaskStore } from './store/taskStore';
import { TaskList } from './components/TaskList';
import { TaskModal } from './components/TaskModal';
import { Task } from './types';
import { motion } from 'framer-motion';

export function Tasks() {
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showCompleted, setShowCompleted] = useState(true);
  const { tasks, addTask, updateTask, deleteTask, duplicateTask } = useTaskStore();

  const filteredTasks = tasks.filter(task => showCompleted || !task.completed);

  const handleCreateTask = (taskData: Partial<Task>) => {
    addTask(taskData);
    setShowModal(false);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowModal(true);
  };

  const handleSaveEdit = (taskData: Partial<Task>) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
      setEditingTask(null);
      setShowModal(false);
    }
  };

  const completedCount = tasks.filter(task => task.completed).length;
  const totalCount = tasks.length;
  const completionPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Tarefas</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gerencie suas atividades e acompanhe o progresso
          </p>
        </div>
        <button
          onClick={() => {
            setEditingTask(null);
            setShowModal(true);
          }}
          className="flex items-center px-4 py-2 bg-[#7f00ff] text-white rounded-md hover:bg-[#7f00ff]/90 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nova tarefa
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Progresso</h3>
            <div className="p-2 bg-[#7f00ff]/10 rounded-lg">
              <CheckSquare className="w-5 h-5 text-[#7f00ff]" />
            </div>
          </div>
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-[#7f00ff] bg-[#7f00ff]/10">
                  {completedCount} de {totalCount} tarefas
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-[#7f00ff]">
                  {completionPercentage.toFixed(0)}%
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-[#7f00ff]/10">
              <div
                style={{ width: `${completionPercentage}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[#7f00ff] transition-all duration-500"
              />
            </div>
          </div>
        </motion.div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Lista de Tarefas</h2>
          <button
            onClick={() => setShowCompleted(!showCompleted)}
            className="flex items-center px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <Filter className="w-4 h-4 mr-2" />
            {showCompleted ? 'Ocultar Concluídas' : 'Mostrar Concluídas'}
          </button>
        </div>

        <TaskList
          tasks={filteredTasks}
          onTaskUpdate={updateTask}
          onTaskDelete={deleteTask}
          onTaskEdit={handleEditTask}
          onTaskDuplicate={duplicateTask}
        />
      </div>

      {showModal && (
        <TaskModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setEditingTask(null);
          }}
          onSave={editingTask ? handleSaveEdit : handleCreateTask}
          task={editingTask}
        />
      )}
    </div>
  );
}