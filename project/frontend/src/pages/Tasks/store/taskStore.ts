import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task, TaskNotification } from '../types';
import { isToday, isTomorrow, addDays } from 'date-fns';
import { generateId } from '../../../utils/generateId';

interface TaskState {
  tasks: Task[];
  notifications: TaskNotification[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  duplicateTask: (id: string) => void;
  toggleTaskComplete: (id: string) => void;
  addNotification: (notification: TaskNotification) => void;
  markNotificationAsRead: (id: string) => void;
  deleteNotification: (id: string) => void;
  generateAISuggestions: () => void;
}

function createNotification(
  taskId: string,
  message: string,
  type: 'deadline' | 'reminder' | 'suggestion'
): TaskNotification {
  return {
    id: generateId(),
    taskId,
    message,
    type,
    read: false,
    createdAt: new Date().toISOString(),
  };
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],
      notifications: [],

      addTask: (taskData) => {
        const newTask: Task = {
          id: generateId(),
          title: taskData.title,
          description: taskData.description,
          dueDate: taskData.dueDate,
          completed: false,
          priority: taskData.priority,
          checklist: taskData.checklist,
          customFields: taskData.customFields,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          tasks: [...state.tasks, newTask],
        }));

        const notification = createNotification(
          newTask.id,
          `Nova tarefa criada: ${newTask.title}`,
          'reminder'
        );
        get().addNotification(notification);
      },

      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? {
                  ...task,
                  ...updates,
                  updatedAt: new Date().toISOString(),
                }
              : task
          ),
        }));
      },

      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
          notifications: state.notifications.filter((notif) => notif.taskId !== id),
        }));
      },

      duplicateTask: (id) => {
        const task = get().tasks.find((t) => t.id === id);
        if (task) {
          const duplicatedTask: Task = {
            ...task,
            id: generateId(),
            title: `${task.title} (Cópia)`,
            completed: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          set((state) => ({
            tasks: [...state.tasks, duplicatedTask],
          }));
        }
      },

      toggleTaskComplete: (id) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? {
                  ...task,
                  completed: !task.completed,
                  updatedAt: new Date().toISOString(),
                }
              : task
          ),
        }));
      },

      addNotification: (notification) => {
        set((state) => ({
          notifications: [...state.notifications, notification],
        }));
      },

      markNotificationAsRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((notif) =>
            notif.id === id ? { ...notif, read: true } : notif
          ),
        }));
      },

      deleteNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter((notif) => notif.id !== id),
        }));
      },

      generateAISuggestions: () => {
        const state = get();
        const completedTasks = state.tasks.filter((task) => task.completed);
        
        if (completedTasks.length > 0) {
          const suggestions = [
            {
              title: "Revisar tarefas completadas",
              description: "Faça uma revisão das tarefas concluídas para garantir qualidade",
              dueDate: addDays(new Date(), 1).toISOString(),
              priority: 'medium',
            },
            {
              title: "Planejar próxima semana",
              description: "Organize as prioridades e objetivos para a próxima semana",
              dueDate: addDays(new Date(), 2).toISOString(),
              priority: 'high',
            },
          ];

          suggestions.forEach((suggestion) => {
            state.addTask({
              ...suggestion,
              checklist: [],
              customFields: {},
            });
          });
        }
      },
    }),
    {
      name: 'task-store',
    }
  )
);

// Set up periodic checks for deadlines
setInterval(() => {
  const store = useTaskStore.getState();
  const tasks = store.tasks;

  tasks.forEach((task) => {
    const dueDate = new Date(task.dueDate);
    
    if (!task.completed) {
      if (isToday(dueDate)) {
        const notification = createNotification(
          task.id,
          `A tarefa "${task.title}" vence hoje!`,
          'deadline'
        );
        store.addNotification(notification);
      } else if (isTomorrow(dueDate)) {
        const notification = createNotification(
          task.id,
          `A tarefa "${task.title}" vence amanhã!`,
          'deadline'
        );
        store.addNotification(notification);
      }
    }
  });
}, 1000 * 60 * 60); // Check every hour