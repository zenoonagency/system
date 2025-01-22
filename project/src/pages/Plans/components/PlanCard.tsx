import React from 'react';
import { Check } from 'lucide-react';

interface PlanCardProps {
  title: string;
  description: string;
  price: number | string;
  features: string[];
  isPopular?: boolean;
  gradient: string;
  baseUsers: number | 'custom';
  isSelected?: boolean;
  onClick?: () => void;
}

export function PlanCard({
  title,
  description,
  price,
  features,
  isPopular,
  gradient,
  baseUsers,
  isSelected,
  onClick
}: PlanCardProps) {
  return (
    <div
      className={`
        relative overflow-hidden rounded-lg transition-all duration-200 ease-out
        ${isSelected ? 'ring-2 ring-purple-500 ring-offset-2 dark:ring-offset-dark-900' : ''}
        hover:translate-y-[-2px] hover:shadow-lg
      `}
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      {/* Gradiente de fundo */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5`} />

      {/* Tag Popular */}
      {isPopular && (
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            Popular
          </span>
        </div>
      )}

      <div className="relative p-4 bg-white dark:bg-dark-800">
        {/* Cabeçalho */}
        <div className="mb-3">
          <h3 className={`text-lg font-semibold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
            {title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
        </div>

        {/* Preço */}
        <div className="mb-3">
          <div className="flex items-baseline">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {typeof price === 'number' ? `R$${price}` : price}
            </span>
            {typeof price === 'number' && (
              <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">/mês</span>
            )}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {baseUsers === 'custom' ? 'Usuários ilimitados' : `${baseUsers} usuário${baseUsers > 1 ? 's' : ''}`}
          </div>
        </div>

        {/* Features */}
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
              <div className={`rounded-full p-1 bg-gradient-to-r ${gradient} mr-2 flex-shrink-0`}>
                <Check className="h-3 w-3 text-white" />
              </div>
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
} 