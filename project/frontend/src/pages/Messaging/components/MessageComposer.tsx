import React, { useState } from 'react';
import { Send, AlertCircle } from 'lucide-react';

interface MessageComposerProps {
  onSend: (context: string, messages: string[]) => void;
  isSending: boolean;
  progress: number;
}

const MAX_CHARS = 1000;
const MESSAGE_COUNT = 5;

export function MessageComposer({ onSend, isSending, progress }: MessageComposerProps) {
  const [context, setContext] = useState('');
  const [activeMessageIndex, setActiveMessageIndex] = useState<number | null>(null);
  const [messages, setMessages] = useState<string[]>(Array(MESSAGE_COUNT).fill(''));

  const handleMessageChange = (index: number, value: string) => {
    const newMessages = [...messages];
    newMessages[index] = value;
    setMessages(newMessages);
  };

  const isOverLimit = messages.some(msg => msg.length > MAX_CHARS);
  const hasValidMessage = messages.some(msg => msg.trim().length > 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (context.trim() && hasValidMessage && !isSending) {
      onSend(context.trim(), messages.filter(msg => msg.trim()));
    }
  };

  return (
    <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
        Nova Mensagem
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Contexto do Disparo
          </label>
          <textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="Descreva o contexto do disparo para a IA (ex: Oferta de serviços de marketing digital)"
            className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-gray-100"
            rows={3}
            required
          />
        </div>

        <div className="space-y-4">
          {Array.from({ length: MESSAGE_COUNT }).map((_, index) => (
            <div key={index}>
              <button
                type="button"
                onClick={() => setActiveMessageIndex(activeMessageIndex === index ? null : index)}
                className={`w-full text-left p-4 rounded-lg border ${
                  activeMessageIndex === index
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-dark-600 hover:border-primary-500'
                } transition-colors`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    Mensagem {index + 1}
                  </span>
                  <span className={`text-sm ${
                    messages[index].length > MAX_CHARS ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {messages[index].length}/{MAX_CHARS}
                  </span>
                </div>
                {activeMessageIndex === index && (
                  <textarea
                    value={messages[index]}
                    onChange={(e) => handleMessageChange(index, e.target.value)}
                    placeholder={`Digite a mensagem ${index + 1}...`}
                    className={`mt-4 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-gray-100 ${
                      messages[index].length > MAX_CHARS
                        ? 'border-red-500'
                        : 'border-gray-300 dark:border-dark-600'
                    }`}
                    rows={3}
                    onClick={(e) => e.stopPropagation()}
                  />
                )}
              </button>
            </div>
          ))}
        </div>

        {isSending && (
          <div className="w-full bg-gray-200 dark:bg-dark-700 rounded-full h-2.5">
            <div
              className="bg-primary-500 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        <button
          type="submit"
          disabled={isOverLimit || isSending || !context.trim() || !hasValidMessage}
          className="w-full px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
        >
          {isSending ? (
            <span>Enviando... {progress}%</span>
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" />
              Enviar Mensagem
            </>
          )}
        </button>
      </form>
    </div>
  );
}