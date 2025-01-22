import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { useSettingsStore } from '../../store/settingsStore';
import { useToast } from '../../hooks/useToast';
import { useAuthStore } from '../../store/authStore';

export function Settings() {
  const { profile, webhooks, updateProfile, updateWebhook } = useSettingsStore();
  const { showToast } = useToast();
  const updateUser = useAuthStore(state => state.updateUser);

  // Profile states
  const [name, setName] = useState(profile.name);
  const [phone, setPhone] = useState(profile.phone);

  // Webhook states
  const [webhookAgent, setWebhookAgent] = useState(webhooks.agent);
  const [webhookTurnOnAI, setWebhookTurnOnAI] = useState(webhooks.turnOnAI);
  const [webhookTurnOffAI, setWebhookTurnOffAI] = useState(webhooks.turnOffAI);
  const [webhookPrompt, setWebhookPrompt] = useState(webhooks.prompt);
  const [webhookMemory, setWebhookMemory] = useState(webhooks.memory);
  const [webhookBroadcast, setWebhookBroadcast] = useState(webhooks.broadcast);

  useEffect(() => {
    setName(profile.name);
    setPhone(profile.phone);
    setWebhookAgent(webhooks.agent);
    setWebhookTurnOnAI(webhooks.turnOnAI);
    setWebhookTurnOffAI(webhooks.turnOffAI);
    setWebhookPrompt(webhooks.prompt);
    setWebhookMemory(webhooks.memory);
    setWebhookBroadcast(webhooks.broadcast);
  }, [profile, webhooks]);

  const handleSaveSettings = async () => {
    try {
      // Validar URLs dos webhooks
      const urlPattern = /^https?:\/\/.+/;
      const webhookUrls = [
        { name: 'Agente de IA', url: webhookAgent },
        { name: 'Ligar IA', url: webhookTurnOnAI },
        { name: 'Desligar IA', url: webhookTurnOffAI },
        { name: 'Prompt IA', url: webhookPrompt },
        { name: 'Memória IA', url: webhookMemory },
        { name: 'Disparo', url: webhookBroadcast }
      ];

      // Verificar se todas as URLs são válidas
      for (const webhook of webhookUrls) {
        if (webhook.url && !urlPattern.test(webhook.url)) {
          showToast(`URL inválida para ${webhook.name}`, 'error');
          return;
        }
      }

      // Atualizar perfil
      updateProfile(name, phone);
      
      // Atualizar webhooks
      updateWebhook('agent', webhookAgent);
      updateWebhook('turnOnAI', webhookTurnOnAI);
      updateWebhook('turnOffAI', webhookTurnOffAI);
      updateWebhook('prompt', webhookPrompt);
      updateWebhook('memory', webhookMemory);
      updateWebhook('broadcast', webhookBroadcast);
      
      // Atualizar nome no header
      updateUser({ name });
      
      showToast('Configurações salvas com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      showToast('Erro ao salvar configurações. Tente novamente.', 'error');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Configurações
        </h1>
        <button
          onClick={handleSaveSettings}
          className="flex items-center px-4 py-2 bg-[#7f00ff] text-white rounded-md hover:bg-[#7f00ff]/90"
        >
          <Save className="w-5 h-5 mr-2" />
          Salvar Alterações
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configurações de Perfil */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
            <span className="w-2 h-6 bg-[#7f00ff] rounded-full mr-2"></span>
            Configurações de Perfil
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                Nome
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7f00ff] dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                Celular
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7f00ff] dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Configurações de Webhook */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
            <span className="w-2 h-6 bg-[#7f00ff] rounded-full mr-2"></span>
            Configurações de Webhook
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                Agente de IA
              </label>
              <input
                type="url"
                value={webhookAgent}
                onChange={(e) => setWebhookAgent(e.target.value)}
                placeholder="https://"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7f00ff] dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                Ligar IA
              </label>
              <input
                type="url"
                value={webhookTurnOnAI}
                onChange={(e) => setWebhookTurnOnAI(e.target.value)}
                placeholder="https://"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7f00ff] dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                Desligar IA
              </label>
              <input
                type="url"
                value={webhookTurnOffAI}
                onChange={(e) => setWebhookTurnOffAI(e.target.value)}
                placeholder="https://"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7f00ff] dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                Prompt IA
              </label>
              <input
                type="url"
                value={webhookPrompt}
                onChange={(e) => setWebhookPrompt(e.target.value)}
                placeholder="https://"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7f00ff] dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                Memória IA
              </label>
              <input
                type="url"
                value={webhookMemory}
                onChange={(e) => setWebhookMemory(e.target.value)}
                placeholder="https://"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7f00ff] dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                Disparo
              </label>
              <input
                type="url"
                value={webhookBroadcast}
                onChange={(e) => setWebhookBroadcast(e.target.value)}
                placeholder="https://"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7f00ff] dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 