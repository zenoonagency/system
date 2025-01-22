import React, { useState } from 'react';
import { X } from 'lucide-react';

interface GoogleCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (url: string) => void;
}

export function GoogleCalendarModal({ isOpen, onClose, onSave }: GoogleCalendarModalProps) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const validateUrl = (url: string) => {
    return url.startsWith('https://calendar.google.com/calendar/embed?src=');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateUrl(url)) {
      setError('Por favor, insira uma URL válida do Google Agenda');
      return;
    }

    setError('');
    onSave(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Integrar Google Agenda
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              URL do Google Agenda
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setError('');
              }}
              className={`w-full px-3 py-2 border ${
                error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-[#7f00ff] dark:bg-gray-700 dark:text-gray-100`}
              placeholder="https://calendar.google.com/calendar/embed?src=..."
              required
            />
            {error && (
              <p className="mt-1 text-sm text-red-500">{error}</p>
            )}
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Cole aqui a URL pública do seu Google Agenda
            </p>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#7f00ff] text-white rounded-md hover:bg-[#7f00ff]/90"
            >
              Integrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}