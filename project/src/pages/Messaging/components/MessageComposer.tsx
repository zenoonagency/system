import React, { useState } from 'react';
import { Clock, Tag } from 'lucide-react';
import { useTagStore, Tag as TagType } from '../../../store/tagStore';
import { Contact } from '../types';
import { useThemeStore } from '../../../store/themeStore';

interface MessageComposerProps {
  onSend: (context: string, messages: string[], contacts: string[], type: 'ai' | 'standard', delaySeconds: number) => void;
  isSending: boolean;
  progress: number;
  contacts: Contact[];
}

const DEFAULT_DELAY = 30;
const MAX_MESSAGES = 5;

type Mode = 'ai' | 'standard';

export function MessageComposer({ onSend, isSending, progress, contacts }: MessageComposerProps) {
  const [mode, setMode] = useState<Mode>('standard');
  const [context, setContext] = useState('');
  const [messages, setMessages] = useState<string[]>(Array(MAX_MESSAGES).fill(''));
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [delaySeconds, setDelaySeconds] = useState(DEFAULT_DELAY);
  const [activeMessageIndex, setActiveMessageIndex] = useState<number>(0);
  const { tags } = useTagStore();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  // Get unique tags from contacts
  const uniqueTags = Array.from(
    new Set(contacts.flatMap(contact => contact.tagIds || []))
  ).map(tagId => tags.find(tag => tag.id === tagId)).filter((tag): tag is TagType => tag !== undefined);

  const handleMessageChange = (index: number, value: string) => {
    const newMessages = [...messages];
    newMessages[index] = value;
    setMessages(newMessages);
  };

  const handleTagToggle = (tagId: string) => {
    setSelectedTags(prev => {
      const newTags = prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId];
      
      // Limpar seleção de contatos quando mudar as tags
      setSelectedContacts([]);
      
      return newTags;
    });
  };

  const handleContactToggle = (contactId: string) => {
    setSelectedContacts(prev =>
      prev.includes(contactId)
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };

  // Filtrar contatos baseado nas tags selecionadas
  const filteredContacts = contacts.filter(contact =>
    selectedTags.length === 0 || contact.tagIds?.some((tagId: string) => selectedTags.includes(tagId))
  );

  const handleSelectAllContacts = () => {
    if (selectedContacts.length === filteredContacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(filteredContacts.map(c => c.id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'standard' && !messages[0].trim()) return;
    if (mode === 'ai' && !context.trim()) return;
    if (selectedContacts.length === 0) return;
    
    onSend(
      context,
      messages.filter(msg => msg.trim()),
      selectedContacts,
      mode,
      delaySeconds
    );
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-dark-800 rounded-lg shadow-md p-6 space-y-6">
      <div className="flex space-x-2">
        <button
          type="button"
          onClick={() => setMode('standard')}
          className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
            mode === 'standard'
              ? 'bg-[#7f00ff] text-white'
              : 'bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-300'
          }`}
        >
          Disparo Padrão
        </button>
        <button
          type="button"
          onClick={() => setMode('ai')}
          className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
            mode === 'ai'
              ? 'bg-[#7f00ff] text-white'
              : 'bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-300'
          }`}
        >
          Disparo com IA
        </button>
      </div>

      {/* Delay Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Tempo entre disparos (segundos)
        </label>
        <div className="flex items-center space-x-4">
          <input
            type="number"
            min="1"
            value={delaySeconds}
            onChange={(e) => setDelaySeconds(Math.max(1, parseInt(e.target.value) || DEFAULT_DELAY))}
            className="w-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7f00ff] dark:bg-dark-700 dark:text-gray-100"
          />
          <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            Recomendamos 30 segundos
          </span>
        </div>
      </div>

      {/* Filtro de Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Filtrar por Tags
        </label>
        <div className="flex flex-wrap gap-2">
          {uniqueTags.map(tag => (
            <button
              key={tag.id}
              type="button"
              onClick={() => handleTagToggle(tag.id)}
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors`}
              style={{ 
                backgroundColor: selectedTags.includes(tag.id) ? tag.color : undefined,
                borderColor: tag.color,
                borderWidth: '1px',
                color: selectedTags.includes(tag.id) ? '#fff' : tag.color,
              }}
            >
              <Tag className="w-3 h-3 mr-1" />
              {tag.name}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Contatos */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Contatos ({selectedContacts.length} selecionados)
          </label>
          <button
            type="button"
            onClick={handleSelectAllContacts}
            className="text-sm text-[#7f00ff] hover:text-[#7f00ff]/80"
          >
            {selectedContacts.length === filteredContacts.length ? 'Desmarcar Todos' : 'Selecionar Todos'}
          </button>
        </div>
        <div className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
          <div className="max-h-48 overflow-y-auto">
            {filteredContacts.map(contact => (
              <label
                key={contact.id}
                className={`flex items-center px-4 py-2 hover:bg-gray-50 dark:hover:bg-dark-700 cursor-pointer ${
                  selectedContacts.includes(contact.id) ? 'bg-gray-50 dark:bg-dark-700' : ''
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedContacts.includes(contact.id)}
                  onChange={() => handleContactToggle(contact.id)}
                  className="rounded border-gray-300 text-[#7f00ff] focus:ring-[#7f00ff]"
                />
                <span className="ml-3 text-gray-900 dark:text-gray-100">{contact.name}</span>
                <span className="ml-2 text-gray-500">{contact.phone}</span>
                <div className="ml-2 flex flex-wrap gap-1">
                  {contact.tagIds?.map((tagId: string) => {
                    const tag = tags.find(t => t.id === tagId);
                    if (!tag) return null;
                    return (
                      <span
                        key={tag.id}
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: `${tag.color}20`,
                          color: tag.color,
                          border: `1px solid ${tag.color}`,
                        }}
                      >
                        {tag.name}
                      </span>
                    );
                  })}
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      {mode === 'ai' ? (
        /* Modo IA - Campo de Contexto */
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Contexto para IA
          </label>
          <textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7f00ff] dark:bg-dark-700 dark:text-gray-100"
            placeholder="Descreva o contexto para a IA gerar a mensagem..."
          />
        </div>
      ) : (
        /* Modo Padrão - Campos de Mensagem */
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Mensagens
          </label>
          <div className="flex flex-wrap gap-2 mb-4">
            {messages.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setActiveMessageIndex(index)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeMessageIndex === index
                    ? 'bg-[#7f00ff] text-white'
                    : 'bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-300'
                }`}
              >
                Mensagem {index + 1}
              </button>
            ))}
          </div>
          <textarea
            value={messages[activeMessageIndex]}
            onChange={(e) => handleMessageChange(activeMessageIndex, e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7f00ff] dark:bg-dark-700 dark:text-gray-100"
            placeholder={`Digite a mensagem ${activeMessageIndex + 1}...`}
          />
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSending}
          className={`px-6 py-2 rounded-md text-white font-medium transition-colors ${
            isSending
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-[#7f00ff] hover:bg-[#7f00ff]/90'
          }`}
        >
          {isSending ? `Enviando (${progress}%)` : 'Enviar Mensagens'}
        </button>
      </div>
    </form>
  );
}