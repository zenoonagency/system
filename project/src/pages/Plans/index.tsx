import React, { useState } from 'react';
import { PlanCard } from './components/PlanCard';
import { UserCounter } from './components/UserCounter';
import { Users } from 'lucide-react';

interface Plan {
  id: string;
  title: string;
  description: string;
  price: number | string;
  baseUsers: number | 'custom';
  features: string[];
  gradient: string;
  isPopular?: boolean;
}

export function Plans() {
  const [selectedPlan, setSelectedPlan] = useState('essential');
  const [additionalUsers, setAdditionalUsers] = useState(0);

  const plans: Plan[] = [
    {
      id: 'essential',
      title: 'Essential',
      description: 'Perfeito para pequenas empresas e profissionais autônomos',
      price: 297,
      baseUsers: 1,
      features: [
        'Até 100 contatos',
        'Disparo em massa padrão',
        'Suporte 24/7 por whatsapp',
        'Controle financeiro e contratual',
        'CRM avançado',
        'Até 3 Kanbans',
        'Até 3 Disparos por mês'
      ],
      gradient: 'from-purple-500 to-indigo-600'
    },
    {
      id: 'premium',
      title: 'Premium AI',
      description: 'Ideal para empresas em crescimento que precisam de mais recursos',
      price: 897,
      baseUsers: 5,
      isPopular: true,
      features: [
        'Tudo do Essential',
        'Até 1000 contatos',
        'Disparo com inteligência artificial',
        'ChatGPT integrado',
        'Multiplos usuários',
        'Até 5 Kanbans',
        'Até 5 Disparos por mês'
      ],
      gradient: 'from-blue-500 to-cyan-400'
    },
    {
      id: 'enterprise',
      title: 'Enterprise AI',
      description: 'Para empresas que necessitam de recursos personalizados',
      price: 'Personalizado',
      baseUsers: 'custom',
      features: [
        'Tudo do Premium AI',
        'Contatos ilimitados',
        'Suporte 24/7 por whatsapp',
        'ChatGPT integrado',
        'Multiplos usuários',
        'Até 10 Kanbans',
        'Até disparos ilimitados'
      ],
      gradient: 'from-orange-500 to-pink-500'
    }
  ];

  const formatPrice = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const selectedPlanData = plans.find(plan => plan.id === selectedPlan);
  const basePlanPrice = typeof selectedPlanData?.price === 'number' ? selectedPlanData.price : 0;
  
  // Calcula o preço total considerando o plano base e usuários adicionais
  const calculateTotalPrice = () => {
    if (selectedPlan === 'enterprise') {
      // Para o Enterprise, cada usuário custa 297
      return (additionalUsers + 1) * 297;
    }
    // Para os outros planos, mantém a lógica atual
    return basePlanPrice + (additionalUsers * 97);
  };

  const totalPrice = calculateTotalPrice();

  const getBaseUsers = () => {
    switch (selectedPlan) {
      case 'essential':
        return 1;
      case 'premium':
        return 5;
      case 'enterprise':
        return 0;
      default:
        return 1;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
      <div className="px-4 py-4 border-b border-gray-200 dark:border-dark-700">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Gerenciamento de Planos
        </h1>
      </div>
      
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Coluna da esquerda - Planos */}
            <div className="w-full lg:w-2/3 space-y-3">
              {plans.map((plan) => (
                <PlanCard
                  key={plan.id}
                  title={plan.title}
                  description={plan.description}
                  price={plan.price}
                  features={plan.features}
                  isPopular={plan.isPopular}
                  gradient={plan.gradient}
                  baseUsers={plan.baseUsers}
                  isSelected={selectedPlan === plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                />
              ))}
            </div>

            {/* Coluna da direita - Licenças */}
            <div className="w-full lg:w-1/3">
              <div className="sticky top-4">
                <div className="bg-white dark:bg-dark-800 rounded-lg shadow-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Resumo do plano
                  </h3>

                  {/* Seleção de Plano */}
                  <div className="space-y-2 mb-6">
                    <div className={`
                      flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-700/50 rounded-lg
                      ${selectedPlan === 'essential' ? 'ring-2 ring-purple-500' : ''}
                      cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-700/70
                    `}
                    onClick={() => setSelectedPlan('essential')}>
                      <div>
                        <h4 className="font-medium bg-gradient-to-r from-purple-500 to-indigo-600 bg-clip-text text-transparent">
                          Essential
                        </h4>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {typeof plans[0].price === 'number' ? formatPrice(plans[0].price) : plans[0].price}/mês
                        </div>
                      </div>
                    </div>

                    <div className={`
                      flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-700/50 rounded-lg
                      ${selectedPlan === 'premium' ? 'ring-2 ring-purple-500' : ''}
                      cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-700/70
                    `}
                    onClick={() => setSelectedPlan('premium')}>
                      <div>
                        <h4 className="font-medium bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
                          Premium AI
                        </h4>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {typeof plans[1].price === 'number' ? formatPrice(plans[1].price) : plans[1].price}/mês
                        </div>
                      </div>
                    </div>

                    <div className={`
                      flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-700/50 rounded-lg
                      ${selectedPlan === 'enterprise' ? 'ring-2 ring-purple-500' : ''}
                      cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-700/70
                    `}
                    onClick={() => setSelectedPlan('enterprise')}>
                      <div>
                        <h4 className="font-medium bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                          Enterprise AI
                        </h4>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{formatPrice(297)}/usuário</div>
                      </div>
                    </div>
                  </div>

                  {/* Seleção de Licenças */}
                  <div className="border-t border-gray-200 dark:border-dark-700 pt-4 mb-6">
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-3">
                      Quantidade de licenças
                    </h4>
                    <div className="flex flex-col items-center">
                      <UserCounter
                        onTotalChange={setAdditionalUsers}
                        minUsers={0}
                        maxUsers={selectedPlan === 'enterprise' ? 999 : 50}
                        pricePerUser={97}
                      />
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        {selectedPlan === 'enterprise' 
                          ? `${additionalUsers + 1} licença${additionalUsers + 1 !== 1 ? 's' : ''} × ${formatPrice(297)}/cada`
                          : `${getBaseUsers()} licença${getBaseUsers() !== 1 ? 's' : ''} incluída${getBaseUsers() !== 1 ? 's' : ''} + adicionais`
                        }
                      </div>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="border-t border-gray-200 dark:border-dark-700 pt-4 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Total mensal</span>
                      <span className="text-lg font-semibold text-gray-900 dark:text-white">
                        {typeof totalPrice === 'number' ? formatPrice(totalPrice) : totalPrice}
                      </span>
                    </div>
                  </div>

                  {/* Botão */}
                  <button className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-semibold hover:shadow-lg transition-all duration-200">
                    Seguir para pagamento
                  </button>

                  {/* Container dos Termos */}
                  <div className="bg-white dark:bg-dark-800 rounded-lg shadow-lg p-4 mt-4">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                      Visualize nossos termos
                    </h4>
                    <div className="space-y-2">
                      <a 
                        href="#" 
                        className="block text-sm text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Termos de uso
                      </a>
                      <a 
                        href="#" 
                        className="block text-sm text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Termos de segurança
                      </a>
                      <a 
                        href="#" 
                        className="block text-sm text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Termos gerais
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 