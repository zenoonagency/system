import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Bot, 
  Trello, 
  DollarSign, 
  FileText, 
  CheckSquare, 
  Users, 
  MessageSquare, 
  MessageCircle, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Tag,
  UserPlus,
  LayoutDashboard,
  Table2,
  Settings
} from 'lucide-react';
import { TagList } from '../tags/TagList';
import { useThemeStore } from '../../store/themeStore';

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
  exact?: boolean;
}

const SidebarLink = ({ to, icon, label, collapsed, exact = false }: SidebarLinkProps) => {
  const location = useLocation();
  const isActive = exact ? location.pathname === to : location.pathname.startsWith(to);

  return (
    <NavLink
      to={to}
      className={`flex items-center ${collapsed ? 'justify-center' : ''} px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-700/50 transition-colors duration-200 ${
        isActive ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 border-r-4 border-primary-500' : ''
      }`}
      title={collapsed ? label : undefined}
    >
      <span className={collapsed ? 'mr-0' : 'mr-3'}>{icon}</span>
      {!collapsed && <span>{label}</span>}
    </NavLink>
  );
}

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [showTags, setShowTags] = useState(false);
  const { theme } = useThemeStore();

  const logoUrl = theme === 'dark' 
    ? (collapsed ? 'https://zenoon.com.br/wp-content/uploads/2024/12/Logo-branca.png' : 'https://zenoon.com.br/wp-content/uploads/2024/12/logo-branca-inteira.png')
    : (collapsed ? 'https://zenoon.com.br/wp-content/uploads/2024/12/logo-preta.png' : 'https://zenoon.com.br/wp-content/uploads/2024/12/logo-black-inteira.png');

  return (
    <div className={`relative h-screen ${collapsed ? 'w-20' : 'w-64'} bg-white dark:bg-dark-800 border-r border-gray-200 dark:border-dark-700 transition-all duration-300 flex flex-col`}>
      <div className={`flex ${collapsed ? 'flex-col items-center mt-6' : 'items-center justify-between'} h-20 border-b border-gray-200 dark:border-dark-700 px-4`}>
        <img 
          src={logoUrl}
          alt="Logo" 
          className={`h-5 w-auto mb-4 ${collapsed ? '' : 'mt-4'}`}
        />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 text-gray-600 dark:text-gray-400 ${collapsed ? 'mb-4' : ''}`}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="flex-1 mt-4">
        <SidebarLink to="/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" collapsed={collapsed} exact />
        <SidebarLink to="/dashboard/conversations" icon={<MessageCircle size={20} />} label="Conversas" collapsed={collapsed} />
        <SidebarLink to="/dashboard/ai-agent" icon={<Bot size={20} />} label="Agente IA" collapsed={collapsed} />
        <SidebarLink to="/dashboard/clients" icon={<Trello size={20} />} label="Clientes" collapsed={collapsed} />
        <SidebarLink to="/dashboard/contacts" icon={<UserPlus size={20} />} label="Contatos" collapsed={collapsed} />
        <SidebarLink to="/dashboard/financial" icon={<DollarSign size={20} />} label="Financeiro" collapsed={collapsed} />
        <SidebarLink to="/dashboard/contracts" icon={<FileText size={20} />} label="Contratos" collapsed={collapsed} />
        <SidebarLink to="/dashboard/tasks" icon={<CheckSquare size={20} />} label="Tarefas" collapsed={collapsed} />
        <SidebarLink to="/dashboard/messaging" icon={<MessageSquare size={20} />} label="Disparo" collapsed={collapsed} />
        <SidebarLink to="/dashboard/team" icon={<Users size={20} />} label="Equipe" collapsed={collapsed} />
        <SidebarLink to="/dashboard/calendar" icon={<Calendar size={20} />} label="Calendário" collapsed={collapsed} />
        <SidebarLink to="/dashboard/data-tables" icon={<Table2 size={20} />} label="Tabela de Dados" collapsed={collapsed} />
        <SidebarLink to="/dashboard/settings" icon={<Settings size={20} />} label="Configurações" collapsed={collapsed} />

        {!collapsed && (
          <div className="mt-6 px-4">
            <button
              onClick={() => setShowTags(!showTags)}
              className="flex items-center w-full text-left text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              <Tag size={20} className="mr-3" />
              <span>Marcadores</span>
              <ChevronRight
                size={16}
                className={`ml-auto transform transition-transform ${
                  showTags ? 'rotate-90' : ''
                }`}
              />
            </button>
            {showTags && (
              <div className="mt-2 ml-8">
                <TagList />
              </div>
            )}
          </div>
        )}
      </nav>
    </div>
  );
}
