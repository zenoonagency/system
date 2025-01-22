import React from 'react';
import { Tag as TagIcon } from 'lucide-react';
import { useTagStore } from '../../../store/tagStore';

interface TagFilterProps {
  selectedTags: string[];
  onChange: (tagIds: string[]) => void;
}

export function TagFilter({ selectedTags, onChange }: TagFilterProps) {
  const { tags } = useTagStore();

  const handleTagClick = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      onChange(selectedTags.filter(id => id !== tagId));
    } else {
      onChange([...selectedTags, tagId]);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <div className="flex items-center mb-3">
        <TagIcon className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Filtrar por Marcadores
        </h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <button
            key={tag.id}
            onClick={() => handleTagClick(tag.id)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              selectedTags.includes(tag.id)
                ? 'bg-opacity-100'
                : 'bg-opacity-20 hover:bg-opacity-30'
            }`}
            style={{
              backgroundColor: selectedTags.includes(tag.id) ? tag.color : undefined,
              borderColor: tag.color,
              borderWidth: '1px',
              color: selectedTags.includes(tag.id) ? '#fff' : tag.color,
            }}
          >
            {tag.name}
          </button>
        ))}
      </div>
    </div>
  );
}