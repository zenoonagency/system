import React, { useState } from 'react';
import { X, Plus, Trash2, Tag as TagIcon, Calendar, Clock, User, ListTodo, CheckSquare, Square } from 'lucide-react';
import { useKanbanStore } from '../store/kanbanStore';
import { useTagStore } from '../../../store/tagStore';
import { useTeamStore } from '../../../pages/Team/store/teamStore';
import { CustomFieldType } from '../../../types/customFields';
import { useThemeStore } from '../../../store/themeStore';
import { ConfirmationModal } from '../../../components/ConfirmationModal';
import { useToast } from '../../../hooks/useToast';

// Função para gerar UUID
function generateId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

interface CardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (cardData: any) => void;
  mode: 'add' | 'edit';
  boardId: string;
  listId: string;
  card?: any;
}

interface CustomFieldInput {
  id: string;
  name: string;
  value: string;
}

interface Subtask {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

export function CardModal({ isOpen, onClose, onSave, mode, boardId, listId, card }: CardModalProps) {
  const { theme } = useThemeStore();
  const { tags } = useTagStore();
  const { members } = useTeamStore();
  const { showToast } = useToast();
  const [title, setTitle] = useState(card?.title || '');
  const [description, setDescription] = useState(card?.description || '');
  const [value, setValue] = useState((card?.value || 0).toString());
  const [phone, setPhone] = useState(card?.phone || '');
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(card?.tagIds || []);
  const [scheduledDate, setScheduledDate] = useState(card?.scheduledDate || '');
  const [scheduledTime, setScheduledTime] = useState(card?.scheduledTime || '');
  const [responsibleId, setResponsibleId] = useState(card?.responsibleId || '');
  const [customFields, setCustomFields] = useState<CustomFieldInput[]>(
    card?.customFields
      ? Object.entries(card.customFields).map(([name, field]) => ({
          id: generateId(),
          name,
          value: field.value.toString(),
        }))
      : []
  );
  const [subtasks, setSubtasks] = useState<Subtask[]>(card?.subtasks || []);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [newSubtaskDescription, setNewSubtaskDescription] = useState('');
  const [showNewSubtaskForm, setShowNewSubtaskForm] = useState(false);
  const [showConfirmClose, setShowConfirmClose] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showConfirmDeleteField, setShowConfirmDeleteField] = useState<string | null>(null);

  const isDark = theme === 'dark';

  const hasChanges = () => {
    if (mode === 'add') return title.trim() !== '' || description.trim() !== '';
    
    if (!card) return false;
    
    return (
      title !== card.title ||
      description !== card.description ||
      value !== card.value ||
      phone !== card.phone ||
      scheduledDate !== card.scheduledDate ||
      scheduledTime !== card.scheduledTime ||
      responsibleId !== card.responsibleId ||
      JSON.stringify(selectedTagIds) !== JSON.stringify(card.tagIds) ||
      JSON.stringify(customFields) !== JSON.stringify(Object.entries(card.customFields).map(([name, field]) => ({
        id: name,
        name,
        type: field.type,
        value: field.value
      }))) ||
      JSON.stringify(subtasks) !== JSON.stringify(card.subtasks)
    );
  };

  const handleClose = () => {
    if (hasChanges()) {
      setShowConfirmClose(true);
    } else {
      onClose();
    }
  };

  const handleUpdateCustomField = (id: string, field: string, value: string) => {
    setCustomFields(
      customFields.map((f) =>
        f.id === id ? { ...f, [field]: value } : f
      )
    );
  };

  const handleRemoveCustomField = (fieldId: string) => {
    setShowConfirmDeleteField(fieldId);
  };

  const confirmDeleteField = (fieldId: string) => {
    setCustomFields(prev => prev.filter(field => field.id !== fieldId));
    setShowConfirmDeleteField(null);
    showToast('Campo personalizado removido com sucesso!', 'success');
  };

  const handleAddCustomField = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setCustomFields([...customFields, { id: generateId(), name: '', value: '' }]);
  };

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;

    const newSubtask: Subtask = {
      id: generateId(),
      title: newSubtaskTitle.trim(),
      description: newSubtaskDescription.trim(),
      completed: false,
    };

    setSubtasks([...subtasks, newSubtask]);
    setNewSubtaskTitle('');
    setNewSubtaskDescription('');
    setShowNewSubtaskForm(false);
    showToast('Subtarefa adicionada com sucesso!', 'success');
  };

  const handleToggleSubtask = (id: string) => {
    setSubtasks(subtasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleDeleteSubtask = (id: string) => {
    setSubtasks(subtasks.filter(task => task.id !== id));
    showToast('Subtarefa removida com sucesso!', 'success');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const processedCustomFields = customFields.reduce((acc, field) => {
      if (field.name.trim()) {
        acc[field.name] = {
          type: 'text',
          value: field.value,
        };
      }
      return acc;
    }, {} as Record<string, { type: string; value: string }>);

    onSave({
      title,
      description,
      value: parseFloat(value) || 0,
      phone,
      tagIds: selectedTagIds,
      scheduledDate,
      scheduledTime,
      responsibleId,
      customFields: processedCustomFields,
      subtasks,
    });

    showToast(
      mode === 'edit' 
        ? 'Card atualizado com sucesso!' 
        : 'Card criado com sucesso!',
      'success'
    );
  };

  if (!isOpen) return null;

  const completedSubtasks = subtasks.filter(task => task.completed).length;
  const progress = subtasks.length > 0 ? (completedSubtasks / subtasks.length) * 100 : 0;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={handleClose}>
        <div 
          className={`${isDark ? 'bg-dark-900' : 'bg-white'} rounded-lg w-full max-w-4xl p-6 max-h-[90vh] overflow-y-auto`} 
          onClick={e => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-xl font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
              {mode === 'edit' ? 'Editar Cartão' : 'Novo Cartão'}
            </h2>
            <button onClick={onClose} className={`${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}>
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Título</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7f00ff] border ${
                    isDark ? 'bg-dark-800 text-gray-100 border-gray-600' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Descrição</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={`w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7f00ff] border ${
                    isDark ? 'bg-dark-800 text-gray-100 border-gray-600' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  rows={4}
                  placeholder="Digite a descrição do cartão..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Valor</label>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className={`w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7f00ff] border ${
                      isDark ? 'bg-dark-800 text-gray-100 border-gray-600' : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    step="0.01"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Telefone</label>
                  <div className="relative">
                    <User className={`absolute left-3 top-2.5 w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={`w-full pl-10 pr-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7f00ff] border ${
                        isDark ? 'bg-dark-800 text-gray-100 border-gray-600' : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Data</label>
                  <div className="relative">
                    <Calendar className={`absolute left-3 top-2.5 w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                    <input
                      type="date"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      className={`w-full pl-10 pr-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7f00ff] border ${
                        isDark ? 'bg-dark-800 text-gray-100 border-gray-600' : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Hora</label>
                  <div className="relative">
                    <Clock className={`absolute left-3 top-2.5 w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                    <input
                      type="time"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      className={`w-full pl-10 pr-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7f00ff] border ${
                        isDark ? 'bg-dark-800 text-gray-100 border-gray-600' : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Responsável</label>
                <div className="relative">
                  <User className={`absolute left-3 top-2.5 w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                  <select
                    value={responsibleId}
                    onChange={(e) => setResponsibleId(e.target.value)}
                    className={`w-full pl-10 pr-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7f00ff] border ${
                      isDark ? 'bg-dark-800 text-gray-100 border-gray-600' : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="">Selecione um responsável</option>
                    {members.map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Marcadores</label>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => {
                        setSelectedTagIds(prev =>
                          prev.includes(tag.id)
                            ? prev.filter(id => id !== tag.id)
                            : [...prev, tag.id]
                        );
                      }}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors border`}
                      style={{
                        backgroundColor: selectedTagIds.includes(tag.id) ? tag.color : 'transparent',
                        borderColor: tag.color,
                        color: selectedTagIds.includes(tag.id) ? '#fff' : tag.color,
                      }}
                    >
                      {tag.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Campos Personalizados
                  </label>
                  <button 
                    type="button" 
                    onClick={handleAddCustomField} 
                    className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors ${
                      isDark 
                        ? 'bg-[#7f00ff] hover:bg-[#7f00ff]/90 text-white' 
                        : 'bg-[#7f00ff] hover:bg-[#7f00ff]/90 text-white'
                    }`}
                  >
                    <Plus className="w-4 h-4" /> Adicionar Campo
                  </button>
                </div>
                <div className="space-y-3">
                  {customFields.map((field) => (
                    <div
                      key={field.id}
                      className={`p-3 rounded-lg ${isDark ? 'bg-dark-900' : 'bg-gray-100'}`}
                    >
                      <div className="flex items-center gap-2 pr-8">
                        <input
                          type="text"
                          value={field.name}
                          onChange={(e) => handleUpdateCustomField(field.id, 'name', e.target.value)}
                          placeholder="Nome do campo"
                          className={`flex-1 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7f00ff] border ${
                            isDark ? 'bg-dark-800 text-gray-100 border-gray-600' : 'bg-white border-gray-300 text-gray-900'
                          }`}
                        />
                        <input
                          type="text"
                          value={field.value}
                          onChange={(e) => handleUpdateCustomField(field.id, 'value', e.target.value)}
                          placeholder="Valor do campo"
                          className={`flex-1 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7f00ff] border ${
                            isDark ? 'bg-dark-800 text-gray-100 border-gray-600' : 'bg-white border-gray-300 text-gray-900'
                          }`}
                        />
                        <button 
                          type="button"
                          onClick={() => handleRemoveCustomField(field.id)} 
                          className="text-red-500 hover:text-red-700 p-2 hover:bg-gray-600/50 rounded"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Subtarefas
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowNewSubtaskForm(true)}
                    className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors ${
                      isDark 
                        ? 'bg-[#7f00ff] hover:bg-[#7f00ff]/90 text-white' 
                        : 'bg-[#7f00ff] hover:bg-[#7f00ff]/90 text-white'
                    }`}
                  >
                    <Plus className="w-4 h-4" /> Adicionar Subtarefa
                  </button>
                </div>

                <div className="space-y-2">
                  {subtasks.map((task) => (
                    <div
                      key={task.id}
                      className={`flex items-center justify-between p-3 rounded-lg ${isDark ? 'bg-dark-900' : 'bg-gray-100'}`}
                    >
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleSubtask(task.id)}
                          className={task.completed ? 'text-[#7f00ff]' : isDark ? 'text-gray-400' : 'text-gray-500'}
                        >
                          {task.completed ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                        </button>
                        <span className={`${isDark ? 'text-gray-100' : 'text-gray-900'} ${task.completed ? 'line-through opacity-50' : ''}`}>
                          {task.title}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteSubtask(task.id)}
                        className="text-red-500 hover:text-red-700 p-1 hover:bg-gray-600/50 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                {showNewSubtaskForm && (
                  <div className={`mt-2 p-3 rounded-lg ${isDark ? 'bg-dark-900' : 'bg-gray-100'}`}>
                    <input
                      type="text"
                      value={newSubtaskTitle}
                      onChange={(e) => setNewSubtaskTitle(e.target.value)}
                      placeholder="Título da subtarefa"
                      className={`w-full px-3 py-2 mb-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7f00ff] border ${
                        isDark ? 'bg-dark-800 text-gray-100 border-gray-600' : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                    <textarea
                      value={newSubtaskDescription}
                      onChange={(e) => setNewSubtaskDescription(e.target.value)}
                      placeholder="Descrição (opcional)"
                      className={`w-full px-3 py-2 mb-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7f00ff] border ${
                        isDark ? 'bg-dark-800 text-gray-100 border-gray-600' : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      rows={2}
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setNewSubtaskTitle('');
                          setNewSubtaskDescription('');
                          setShowNewSubtaskForm(false);
                        }}
                        className={`px-3 py-1.5 text-sm rounded-md ${isDark ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-100'}`}
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        onClick={handleAddSubtask}
                        className="px-3 py-1.5 text-sm bg-[#7f00ff] text-white rounded-md hover:bg-[#7f00ff]/90"
                      >
                        Adicionar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6 pt-4 border-t dark:border-gray-700">
              <button
                type="button"
                onClick={handleClose}
                className={`px-4 py-2 rounded-md ${isDark ? 'text-gray-300 hover:bg-gray-700/50' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#7f00ff] text-white rounded-md hover:bg-[#7f00ff]/90"
              >
                {mode === 'edit' ? 'Salvar' : 'Criar'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showConfirmClose}
        onClose={() => setShowConfirmClose(false)}
        onConfirm={onClose}
        title="Cancelar edição"
        message="Tem certeza que deseja cancelar? Todas as alterações serão perdidas."
        confirmText="Sim, cancelar"
        cancelText="Não, continuar editando"
      />

      <ConfirmationModal
        isOpen={!!showConfirmDeleteField}
        onClose={() => setShowConfirmDeleteField(null)}
        onConfirm={() => showConfirmDeleteField && confirmDeleteField(showConfirmDeleteField)}
        title="Remover campo"
        message="Tem certeza que deseja remover este campo personalizado?"
        confirmText="Sim, remover"
        cancelText="Não, manter"
      />
    </>
  );
}