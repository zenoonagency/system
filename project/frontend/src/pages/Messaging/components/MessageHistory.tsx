import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface MessageBatch {
  id: string;
  context: string;
  messages: string[];
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  progress: number;
  sentCount: number;
  failedCount: number;
  createdAt: string;
  completedAt?: string;
}

interface MessageHistoryProps {
  batches: MessageBatch[];
}

export function MessageHistory({ batches }: MessageHistoryProps) {
  const getStatusIcon = (status: MessageBatch['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending':
      case 'in_progress':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const getStatusText = (status: MessageBatch['status']) => {
    switch (status) {
      case 'completed':
        return 'Concluído';
      case 'pending':
        return 'Pendente';
      case 'in_progress':
        return 'Em Progresso';
      case 'failed':
        return 'Falhou';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-800 dark:text-gray-200">
          Histórico de Disparos
        </h3>
      </div>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {batches.map((batch) => (
          <div key={batch.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-200">
                  {format(new Date(batch.createdAt), "d 'de' MMMM 'às' HH:mm", {
                    locale: ptBR,
                  })}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {batch.messages.length} mensagens • {batch.sentCount} enviadas • {batch.failedCount} falhas
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(batch.status)}
                <span className="text-sm font-medium">
                  {getStatusText(batch.status)}
                </span>
              </div>
            </div>
            {batch.status === 'in_progress' && (
              <div className="mt-2">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                  <div
                    className="bg-[#7f00ff] h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${batch.progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
        {batches.length === 0 && (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            Nenhum disparo realizado
          </div>
        )}
      </div>
    </div>
  );
}