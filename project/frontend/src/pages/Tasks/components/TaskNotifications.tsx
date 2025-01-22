import React from 'react';
import { Bell, Check, Bot, Clock } from 'lucide-react';
import { useTaskStore } from '../store/taskStore';

export function TaskNotifications() {
  const { notifications, markNotificationAsRead, deleteNotification } = useTaskStore();
  const unreadNotifications = notifications.filter((n) => !n.read);

  if (unreadNotifications.length === 0) {
    return null;
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'deadline':
        return <Clock className="w-5 h-5 text-red-500" />;
      case 'suggestion':
        return <Bot className="w-5 h-5 text-[#7f00ff]" />;
      default:
        return <Bell className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="fixed bottom-4 right-4 max-w-sm w-full space-y-2">
      {unreadNotifications.map((notification) => (
        <div
          key={notification.id}
          className="bg-white rounded-lg shadow-lg p-4 flex items-start justify-between animate-slide-in"
        >
          <div className="flex items-start space-x-3">
            {getIcon(notification.type)}
            <p className="text-sm text-gray-700">{notification.message}</p>
          </div>
          <button
            onClick={() => {
              markNotificationAsRead(notification.id);
              setTimeout(() => deleteNotification(notification.id), 300);
            }}
            className="text-gray-400 hover:text-gray-600"
          >
            <Check size={20} />
          </button>
        </div>
      ))}
    </div>
  );
}