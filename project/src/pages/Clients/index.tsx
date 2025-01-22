// src/pages/Clients/index.tsx
import React, { useState } from 'react';
import { Plus, Edit2, Copy, Trash2, EyeOff } from 'lucide-react';
import { useKanbanStore } from './store/kanbanStore';
import { KanbanBoard } from './components/KanbanBoard';
import { useThemeStore } from '../../store/themeStore';
import { BoardList } from './components/BoardList';
import { useCustomModal } from '../../components/CustomModal';
import { api } from '../../services/api';
import { mutate } from 'swr';
import { showToast } from '../../utils/toast';
import { CompletedListSelector } from './components/CompletedListSelector';

export function Clients() {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const { 
    boards,
    activeBoard,
    setActiveBoard,
    addBoard,
    updateBoard,
    deleteBoard,
    duplicateBoard,
    toggleBoardVisibility
  } = useKanbanStore();
  const { modal, customPrompt, customConfirm } = useCustomModal();
  const [showEditModal, setShowEditModal] = useState(false);
  const [editBoardTitle, setEditBoardTitle] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [boardToDelete, setBoardToDelete] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState('');

  const handleAddBoard = () => {
    setShowCreateModal(true);
  };

  const handleCreateNewBoard = () => {
    if (newBoardTitle.trim()) {
      addBoard(newBoardTitle.trim());
      setNewBoardTitle('');
      setShowCreateModal(false);
    }
  };

  const handleEditBoard = () => {
    if (editBoardTitle.trim() && activeBoard) {
      updateBoard(activeBoard, editBoardTitle.trim());
      setEditBoardTitle('');
      setShowEditModal(false);
    }
  };

  const handleDeleteBoard = async (id: string) => {
    const confirmed = await customConfirm(
      'Excluir quadro',
      'Tem certeza que deseja excluir este quadro?'
    );
    
    if (confirmed) {
      try {
        await api.delete(`/boards/${id}`);
        mutate('/boards');
        showToast('success', 'Quadro excluído com sucesso!');
      } catch (error) {
        showToast('error', 'Erro ao excluir quadro');
      }
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      <div className={`p-6 border-b ${isDark ? 'bg-dark-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
              Gestão de funil
            </h1>
            <select
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7f00ff] dark:bg-dark-700 dark:text-gray-100"
              value={activeBoard || ''}
              onChange={(e) => setActiveBoard(e.target.value)}
            >
              <option value="" disabled>Selecione um quadro</option>
              {boards.map((board) => (
                <option key={board.id} value={board.id}>
                  {board.title}
                </option>
              ))}
            </select>
            <button
              onClick={handleAddBoard}
              className="flex items-center px-3 py-1.5 text-sm bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-dark-600"
            >
              <Plus className="w-4 h-4 mr-1" />
              Novo Quadro
            </button>
            {activeBoard && (
              <CompletedListSelector 
                boardId={activeBoard} 
                lists={boards.find(b => b.id === activeBoard)?.lists || []}
              />
            )}
          </div>
          {activeBoard && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  const board = boards.find(b => b.id === activeBoard);
                  if (board) {
                    setEditBoardTitle(board.title);
                    setShowEditModal(true);
                  }
                }}
                className="flex items-center px-3 py-1.5 text-sm bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-dark-600"
              >
                <Edit2 className="w-4 h-4 mr-1" />
                Editar
              </button>
              <button
                onClick={() => duplicateBoard(activeBoard)}
                className="flex items-center px-3 py-1.5 text-sm bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-dark-600"
              >
                <Copy className="w-4 h-4 mr-1" />
                Duplicar
              </button>
              <button
                onClick={() => {
                  setBoardToDelete(activeBoard);
                  setShowDeleteModal(true);
                }}
                className="flex items-center px-3 py-1.5 text-sm bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Excluir
              </button>
            </div>
          )}
        </div>
      </div>
      <div className={`flex-1 overflow-hidden ${isDark ? 'bg-dark-700' : 'bg-white'}`}>
        <BoardList />
        <KanbanBoard />
      </div>
      {modal}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className={`w-full max-w-md p-6 rounded-lg shadow-xl ${isDark ? 'bg-dark-800' : 'bg-white'}`}>
            <h3 className={`text-lg font-medium mb-4 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
              Editar Quadro
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Nome do quadro
                </label>
                <div className="relative rounded-lg bg-gradient-to-r from-[#7f00ff] to-[#e100ff] p-0.5">
                  <input
                    type="text"
                    value={editBoardTitle}
                    onChange={(e) => setEditBoardTitle(e.target.value)}
                    className={`w-full px-4 py-3 text-base rounded-[6px] ${
                      isDark 
                        ? 'bg-dark-800 text-white' 
                        : 'bg-white text-gray-900'
                    } focus:outline-none`}
                    placeholder="Digite o novo nome do quadro"
                    autoFocus
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditBoardTitle('');
                }}
                className={`px-4 py-2 rounded-lg ${
                  isDark 
                    ? 'text-gray-300 hover:bg-gray-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Cancelar
              </button>
              <button
                onClick={handleEditBoard}
                disabled={!editBoardTitle.trim()}
                className="px-4 py-2 bg-[#7f00ff] text-white rounded-lg hover:bg-[#7f00ff]/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className={`w-full max-w-md p-6 rounded-lg shadow-xl ${isDark ? 'bg-dark-800' : 'bg-white'}`}>
            <h3 className={`text-lg font-medium mb-4 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
              Novo Quadro
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Nome do quadro
                </label>
                <div className="relative rounded-lg bg-gradient-to-r from-[#7f00ff] to-[#e100ff] p-0.5">
                  <input
                    type="text"
                    value={newBoardTitle}
                    onChange={(e) => setNewBoardTitle(e.target.value)}
                    className={`w-full px-4 py-3 text-base rounded-[6px] ${
                      isDark 
                        ? 'bg-dark-800 text-white' 
                        : 'bg-white text-gray-900'
                    } focus:outline-none`}
                    placeholder="Digite o nome do novo quadro"
                    autoFocus
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewBoardTitle('');
                }}
                className={`px-4 py-2 rounded-lg ${
                  isDark 
                    ? 'text-gray-300 hover:bg-gray-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateNewBoard}
                disabled={!newBoardTitle.trim()}
                className="px-4 py-2 bg-[#7f00ff] text-white rounded-lg hover:bg-[#7f00ff]/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Criar
              </button>
            </div>
          </div>
        </div>
      )}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className={`w-full max-w-md p-6 rounded-lg shadow-xl ${isDark ? 'bg-dark-800' : 'bg-white'}`}>
            <h3 className={`text-lg font-medium mb-4 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
              Excluir Quadro
            </h3>
            
            <p className={`mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Tem certeza que deseja excluir este quadro? Esta ação não pode ser desfeita.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setBoardToDelete(null);
                }}
                className={`px-4 py-2 rounded-lg ${
                  isDark 
                    ? 'text-gray-300 hover:bg-gray-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  if (boardToDelete) {
                    deleteBoard(boardToDelete);
                    setShowDeleteModal(false);
                    setBoardToDelete(null);
                  }
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
