import { CustomField } from '../../types/customFields';

export type Priority = 'low' | 'medium' | 'high';

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  dueDate: string;
  completed: boolean;
  checklist: ChecklistItem[];
  customFields?: Record<string, CustomField>;
  createdAt: string;
  updatedAt: string;
}

export interface TaskState {
  tasks: Task[];
  notifications: TaskNotification[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskComplete: (id: string) => void;
  addNotification: (notification: TaskNotification) => void;
  markNotificationAsRead: (id: string) => void;
  deleteNotification: (id: string) => void;
}

export type NotificationType = 'deadline' | 'reminder' | 'suggestion';

export interface TaskNotification {
  id: string;
  taskId: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
}