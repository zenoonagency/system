import React from 'react';
import { Tag, UserPlus, Users, X } from 'lucide-react';
import { Contact } from '../types';
import { useTagStore } from '../../../store/tagStore';

interface ContactSelectorProps {
  contacts: Contact[];
  selectedContacts: Contact[];
  onSelectContact: (contact: Contact) => void;
  selectedTagIds: string[];
  onTagsChange: (tagIds: string[]) => void;
  onSelectAll: () => void;
  onRemoveAll: () => void;
}

export function ContactSelector({
  contacts,
  selectedContacts,
  onSelectContact,
  selectedTagIds,
  onTagsChange,
  onSelectAll,
  onRemoveAll,
}: ContactSelectorProps) {
  const { tags } = useTagStore();

  const filteredContacts = selectedTagIds.length > 0
    ? contacts.filter(contact => contact.tagIds.some(id => selectedTagIds.includes(id)))
    : contacts;

  const handleTagClick = (tagId: string) => {
    if (selectedTagIds.includes(tagId)) {
      onTagsChange(selectedTagIds.filter(id => id !== tagId));
    } else {
      onTagsChange([...selectedTagIds, tagId]);
    }
  };

  return (
    <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm">
      <div className="p-4 border-b border-gray-200 dark:border-dark-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200">
            Selecionar Contatos
          </h3>
          <div className="flex space-x-2">
            <button
              onClick={onSelectAll}
              className="flex items-center px-3 py-1.5 text-sm bg-primary-500 text-white rounded-md hover:bg-primary-600"
            >
              <Users className="w-4 h-4 mr-1" />
              Selecionar Todos
            </button>
            <button
              onClick={onRemoveAll}
              className="flex items-center px-3 py-1.5 text-sm bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              <X className="w-4 h-4 mr-1" />
              Remover Todos
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map(tag => (
            <button
              key={tag.id}
              onClick={() => handleTagClick(tag.id)}
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedTagIds.includes(tag.id)
                  ? 'bg-opacity-100'
                  : 'bg-opacity-20 hover:bg-opacity-30'
              }`}
              style={{
                backgroundColor: selectedTagIds.includes(tag.id) ? tag.color : undefined,
                borderColor: tag.color,
                borderWidth: '1px',
                color: selectedTagIds.includes(tag.id) ? '#fff' : tag.color,
              }}
            >
              <Tag className="w-3 h-3 mr-1" />
              {tag.name}
            </button>
          ))}
        </div>
      </div>

      <div className="divide-y divide-gray-200 dark:divide-dark-700 max-h-[400px] overflow-y-auto">
        {filteredContacts.map((contact) => {
          const isSelected = selectedContacts.some(c => c.id === contact.id);
          const contactTags = tags.filter(tag => contact.tagIds.includes(tag.id));

          return (
            <div
              key={contact.id}
              className={`p-4 hover:bg-gray-50 dark:hover:bg-dark-700/50 ${
                isSelected ? 'bg-primary-50 dark:bg-primary-900/20' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">
                    {contact.name}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {contact.phone}
                  </p>
                  {contactTags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {contactTags.map(tag => (
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
                      ))}
                    </div>
                  )}
                </div>
                {!isSelected && (
                  <button
                    onClick={() => onSelectContact(contact)}
                    className="flex items-center px-3 py-1.5 text-sm bg-primary-500 text-white rounded-md hover:bg-primary-600"
                  >
                    <UserPlus className="w-4 h-4 mr-1" />
                    Adicionar
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}