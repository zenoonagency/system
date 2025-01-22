import React from 'react';
import { Task } from '../types';
import { TaskCard } from './TaskCard';
import { motion, AnimatePresence } from 'framer-motion';

interface TaskListProps {
  tasks: Task[];
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
  onTaskDelete: (taskId: string) => void;
  onTaskEdit: (task: Task) => void;
  onTaskDuplicate: (taskId: string) => void;
}

export function TaskList({ tasks, onTaskUpdate, onTaskDelete, onTaskEdit, onTaskDuplicate }: TaskListProps) {
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  return (
    <AnimatePresence>
      <motion.div layout className="space-y-4">
        {sortedTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onToggle={() => onTaskUpdate(task.id, { completed: !task.completed })}
            onEdit={() => onTaskEdit(task)}
            onDelete={() => onTaskDelete(task.id)}
            onDuplicate={() => onTaskDuplicate(task.id)}
          />
        ))}
      </motion.div>
    </AnimatePresence>
  );
}