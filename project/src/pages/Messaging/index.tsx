import React, { useState } from 'react';
import { MessageComposer } from './components/MessageComposer';
import { MessageHistory } from './components/MessageHistory';
import { useMessagingStore } from './store/messagingStore';
import { useToast } from '../../hooks/useToast';
import { generateId } from '../../utils/generateId';
import { useSettingsStore } from '../../store/settingsStore';
import { useContactsStore } from '../../store/contactsStore';

export function Messaging() {
  const { batches, addBatch, updateBatchProgress, completeBatch } = useMessagingStore();
  const { webhooks } = useSettingsStore();
  const { contacts } = useContactsStore();
  const [isSending, setIsSending] = useState(false);
  const [progress, setProgress] = useState(0);
  const { showToast } = useToast();

  const handleSendMessages = async (
    context: string, 
    messages: string[], 
    contactIds: string[], 
    type: 'ai' | 'standard',
    delaySeconds: number
  ) => {
    if (!webhooks.broadcast) {
      showToast('Por favor, configure o webhook de disparo nas configurações', 'error');
      return;
    }

    setIsSending(true);
    setProgress(0);

    const batchId = generateId();
    const selectedContacts = contacts.filter(contact => contactIds.includes(contact.id));
    addBatch(context, messages, selectedContacts);
    updateBatchProgress(batchId, 0, 'in_progress');

    try {
      const response = await fetch(webhooks.broadcast, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          context: type === 'ai' ? context : undefined,
          messages: type === 'standard' ? messages.filter(msg => msg.trim()) : [],
          contacts: selectedContacts,
          delaySeconds,
          timestamp: new Date().toISOString(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        completeBatch(batchId, 0, selectedContacts.length);
        throw new Error(data.message || 'Failed to send messages');
      }

      if (data.success === true) {
        completeBatch(batchId, selectedContacts.length, 0);
        showToast('Mensagens enviadas com sucesso!', 'success');
      } else {
        completeBatch(batchId, 0, selectedContacts.length);
        showToast(data.message || 'Erro ao enviar mensagens', 'error');
      }

    } catch (error) {
      console.error('Error sending messages:', error);
      completeBatch(batchId, 0, selectedContacts.length);
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
            contacts={contacts}
          />
        </div>

        <div className="space-y-6">
          <MessageHistory batches={batches} />
        </div>
      </div>
    </div>
  );
}