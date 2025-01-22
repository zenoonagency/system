import React, { useState } from 'react';
import { Plus, MoreVertical, Copy, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
import { useKanbanStore } from '../store/kanbanStore';
import { motion } from 'framer-motion';
import { useThemeStore } from '../../../store/themeStore';

export function BoardList() {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const { 
    boards, 
    activeBoard, 
    addBoard, 
    updateBoard, 
    deleteBoard, 
    duplicateBoard, 
    setActiveBoard,
    toggleBoardVisibility 
  } = useKanbanStore();
  const [editingBoard, setEditingBoard] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [showMenu, setShowMenu] = useState<string | null>(null);

  const visibleBoards = boards.filter(board => !board.hidden);

  return (
    <div className={`flex items-center space-x-4 p-4 overflow-x-auto ${isDark ? 'bg-dark-800' : 'bg-white'}`}>
    </div>
  );
}
