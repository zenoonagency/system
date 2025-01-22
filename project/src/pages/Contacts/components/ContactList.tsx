import React, { useState } from 'react';
import { Edit2, Trash2, Tag as TagIcon, UserPlus, Send, CheckSquare } from 'lucide-react';
import { useContactsStore } from '../store/contactsStore';
import { useTagStore } from '../../../store/tagStore';
import { Contact } from '../types';
import { TagFilter } from './TagFilter';
import { ContactDetailModal } from './ContactDetailModal';
import { useCustomModal } from '../../../components/CustomModal';

interface ContactListProps {
  onEdit: (contact: Contact) => void;
  onAddToKanban: (contactIds: string[]) => void;
  onAddToMessaging: (contactIds: string[]) => void;
}

export function ContactList({ onEdit, onAddToKanban, onAddToMessaging }: ContactListProps) {
  const { 
    contacts, 
    selectedContacts, 
    selectedTags,
    toggleContactSelection, 
    selectAllContacts, 
    clearSelection, 
    deleteContact,
    setSelectedTags 
  } = useContactsStore();
  const { tags } = useTagStore();
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const { modal, customConfirm } = useCustomModal();

  const filteredContacts = contacts.filter(contact => {
    if (selectedTags.length === 0) return true;
    return contact.tagIds.some(tagId => selectedTags.includes(tagId));
  });

  const handleSelectAll = () => {
    if (selectedContacts.length === filteredContacts.length) {
      clearSelection();
    } else {
      selectAllContacts(filteredContacts.map(c => c.id));
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = await customConfirm(
      'Excluir contato',
      'Tem certeza que deseja excluir este contato?'
    );
    
    if (confirmed) {
      try {
        await api.delete(`/contacts/${id}`);
        mutate('/contacts');
        showToast('success', 'Contato excluído com sucesso!');
      } catch (error) {
        showToast('error', 'Erro ao excluir contato');
      }
    }
  };

  return (
    <div className="space-y-4">
      <TagFilter selectedTags={selectedTags} onChange={setSelectedTags} />
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleSelectAll}
              className="flex items-center px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <CheckSquare className="w-4 h-4 mr-2" />
              {selectedContacts.length === filteredContacts.length && filteredContacts.length > 0
                ? 'Desmarcar Todos'
                : 'Selecionar Todos'}
            </button>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">
              Contatos ({filteredContacts.length})
            </h3>
          </div>
          {selectedContacts.length > 0 && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onAddToKanban(selectedContacts)}
                className="flex items-center px-4 py-2 text-sm bg-[#7f00ff] text-white rounded-md hover:bg-[#7f00ff]/90"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Adicionar ao Kanban
              </button>
              <button
                onClick={() => onAddToMessaging(selectedContacts)}
                className="flex items-center px-4 py-2 text-sm bg-[#7f00ff] text-white rounded-md hover:bg-[#7f00ff]/90"
              >
                <Send className="w-4 h-4 mr-2" />
                Lista de Disparo
              </button>
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50">
                <th className="w-16 px-6 py-3">
                  <div className="flex justify-center">
                    <input
                      type="checkbox"
                      checked={selectedContacts.length === filteredContacts.length && filteredContacts.length > 0}
                      onChange={handleSelectAll}
                      className="w-5 h-5 rounded text-[#7f00ff] focus:ring-[#7f00ff] cursor-pointer"
                    />
                  </div>
                </th>
                <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider px-6 py-3">
                  Nome
                </th>
                <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider px-6 py-3">
                  Telefone
                </th>
                <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider px-6 py-3">
                  Tags
                </th>
                <th className="text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider px-6 py-3">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredContacts.map((contact) => (
                <tr
                  key={contact.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
                  onClick={() => setSelectedContact(contact)}
                >
                  <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-center">
                      <input
                        type="checkbox"
                        checked={selectedContacts.includes(contact.id)}
                        onChange={() => toggleContactSelection(contact.id)}
                        className="w-5 h-5 rounded text-[#7f00ff] focus:ring-[#7f00ff] cursor-pointer"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {contact.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {contact.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {contact.tagIds.map((tagId) => {
                        const tag = tags.find((t) => t.id === tagId);
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
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(contact);
                      }}
                      className="text-[#7f00ff] hover:text-[#7f00ff]/80 mr-3"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(contact.id);
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedContact && (
        <ContactDetailModal
          contact={selectedContact}
          onClose={() => setSelectedContact(null)}
        />
      )}
      {modal}
    </div>
  );
}