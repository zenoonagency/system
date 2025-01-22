import React, { useState } from 'react';
import { Plus, Unlink } from 'lucide-react';
import { GoogleCalendarModal } from './components/GoogleCalendarModal';

export function Calendar() {
  const [calendarUrl, setCalendarUrl] = useState<string | null>(
    localStorage.getItem('googleCalendarUrl')
  );
  const [showModal, setShowModal] = useState(false);

  const handleSaveUrl = (url: string) => {
    setCalendarUrl(url);
    localStorage.setItem('googleCalendarUrl', url);
    setShowModal(false);
  };

  const handleDisconnect = () => {
    if (confirm('Tem certeza que deseja desconectar o Google Agenda?')) {
      setCalendarUrl(null);
      localStorage.removeItem('googleCalendarUrl');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
          Calendário
        </h1>
        <div className="flex gap-2">
          {calendarUrl ? (
            <button
              onClick={handleDisconnect}
              className="flex items-center px-4 py-2 text-red-600 border border-red-600 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <Unlink className="w-5 h-5 mr-2" />
              Desconectar
            </button>
          ) : (
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center px-4 py-2 bg-[#7f00ff] text-white rounded-md hover:bg-[#7f00ff]/90 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Integrar Google Agenda
            </button>
          )}
        </div>
      </div>

      {calendarUrl ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <iframe
            src={calendarUrl}
            style={{ border: 0 }}
            width="100%"
            height="600"
            frameBorder="0"
            scrolling="no"
          />
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
          <div className="max-w-md mx-auto">
            <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
              Conecte seu Google Agenda
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Integre sua agenda do Google para visualizar seus eventos diretamente aqui
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-3 bg-[#7f00ff] text-white rounded-md hover:bg-[#7f00ff]/90 transition-colors"
            >
              Integrar Google Agenda
            </button>
          </div>
        </div>
      )}

      <GoogleCalendarModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveUrl}
      />
    </div>
  );
}