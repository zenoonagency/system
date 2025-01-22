import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Users, FileText, DollarSign, CheckSquare, MessageSquare, Calendar, Trello } from 'lucide-react';
import { motion } from 'framer-motion';
import { FinancialOverview } from './components/FinancialOverview';

interface DashboardCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  to: string;
  delay: number;
  iconColor: string;
  gradientFrom: string;
}

function DashboardCard({ title, description, icon, to, delay, iconColor, gradientFrom }: DashboardCardProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      onClick={() => navigate(to)}
      className="relative bg-white dark:bg-dark-800 rounded-xl p-6 cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300"
      style={{
        backgroundImage: `radial-gradient(circle at bottom right, ${gradientFrom}, transparent)`
      }}
    >
      <div className="relative z-10">
        <div className={`p-3 ${iconColor} rounded-lg w-fit mb-4`}>
          {icon}
        </div>

        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
          {title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {description}
        </p>
      </div>
    </motion.div>
  );
}

export function Dashboard() {
  const cards = [
    {
      title: 'Agente IA',
      description: 'Automatize suas operações',
      icon: <Bot className="w-6 h-6 text-primary-500" />,
      to: '/dashboard/ai-agent',
      iconColor: 'bg-primary-100 dark:bg-primary-900/30',
      gradientFrom: 'rgba(127, 0, 255, 0.1)',
    },
    {
      title: 'Clientes',
      description: 'Gerencie informações e listas de clientes',
      icon: <Trello className="w-6 h-6 text-green-500" />,
      to: '/dashboard/clients',
      iconColor: 'bg-green-100 dark:bg-green-900/30',
      gradientFrom: 'rgba(34, 197, 94, 0.1)',
    },
    {
      title: 'Financeiro',
      description: 'Controle seus fluxos financeiros',
      icon: <DollarSign className="w-6 h-6 text-blue-500" />,
      to: '/dashboard/financial',
      iconColor: 'bg-blue-100 dark:bg-blue-900/30',
      gradientFrom: 'rgba(59, 130, 246, 0.1)',
    },
    {
      title: 'Contratos',
      description: 'Gerencie documentos e contratos',
      icon: <FileText className="w-6 h-6 text-purple-500" />,
      to: '/dashboard/contracts',
      iconColor: 'bg-purple-100 dark:bg-purple-900/30',
      gradientFrom: 'rgba(168, 85, 247, 0.1)',
    },
    {
      title: 'Tarefas',
      description: 'Organize suas atividades',
      icon: <CheckSquare className="w-6 h-6 text-yellow-500" />,
      to: '/dashboard/tasks',
      iconColor: 'bg-yellow-100 dark:bg-yellow-900/30',
      gradientFrom: 'rgba(234, 179, 8, 0.1)',
    },
    {
      title: 'Sistema de Disparo',
      description: 'Gerencie mensagens em massa',
      icon: <MessageSquare className="w-6 h-6 text-pink-500" />,
      to: '/dashboard/messaging',
      iconColor: 'bg-pink-100 dark:bg-pink-900/30',
      gradientFrom: 'rgba(236, 72, 153, 0.1)',
    },
    {
      title: 'Equipe',
      description: 'Gerencie sua equipe',
      icon: <Users className="w-6 h-6 text-indigo-500" />,
      to: '/dashboard/team',
      iconColor: 'bg-indigo-100 dark:bg-indigo-900/30',
      gradientFrom: 'rgba(99, 102, 241, 0.1)',
    },
    {
      title: 'Calendário',
      description: 'Organize seus compromissos',
      icon: <Calendar className="w-6 h-6 text-orange-500" />,
      to: '/dashboard/calendar',
      iconColor: 'bg-orange-100 dark:bg-orange-900/30',
      gradientFrom: 'rgba(249, 115, 22, 0.1)',
    },
  ];

  return (
    <div className="p-6 bg-gray-50 dark:bg-dark-900">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Painel de Controle
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Bem-vindo ao seu painel de controle
        </p>
      </div>

      <FinancialOverview />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <DashboardCard
            key={card.title}
            {...card}
            delay={index * 0.1}
          />
        ))}
      </div>
    </div>
  );
}