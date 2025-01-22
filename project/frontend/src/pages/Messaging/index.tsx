import React, { useState } from 'react';
import { MessageComposer } from './components/MessageComposer';
import { MessageHistory } from './components/MessageHistory';
import { useMessagingStore } from './store/messagingStore';
import { useToast } from '../../hooks/useToast';
import { generateId } from '../../../utils/generateId';

export function Messaging() {
  const { batches, addBatch, updateBatchProgress, completeBatch } = useMessagingStore();
  const [isSending, setIsSending] = useState(false);
  const [progress, setProgress] = useState(0);
  const { showToast } = useToast();

  const handleSendMessages = async (context: string, messages: string[]) => {
    setIsSending(true);
    setProgress(0);

    const batchId = generateId();
    addBatch(context, messages);

    try {
      const response = await fetch('https://zenoon-agency-n8n.htm57w.easypanel.host/webhook/disparo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          context,
          messages,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send messages');
      }

      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += 5;
        if (currentProgress <= 100) {
          setProgress(currentProgress);
          updateBatchProgress(batchId, currentProgress, 'in_progress');
        } else {
          clearInterval(interval);
          completeBatch(batchId, messages.length, 0);
          showToast('Mensagens enviadas com sucesso!', 'success');
        }
      }, 500);

    } catch (error) {
      console.error('Error sending messages:', error);
      completeBatch(batchId, 0, messages.length);
      showToast('Erro ao enviar mensagens', 'error');
    } finally {
      setIsSending(false);
      setProgress(0);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Sistema de Disparo
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Envie mensagens em massa
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <MessageComposer
            onSend={handleSendMessages}
            isSending={isSending}
            progress={progress}
          />
        </div>

        <div className="space-y-6">
          <MessageHistory batches={batches} />
        </div>
      </div>
    </div>
  );
}