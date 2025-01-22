import React, { useState } from 'react';
import { FileText, Shield, Book } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { useSettingsStore } from '../../store/settingsStore';

export function Settings() {
  const { 
    webhookAgent, setWebhookAgent,
    webhookTurnOnAI, setWebhookTurnOnAI,
    webhookTurnOffAI, setWebhookTurnOffAI,
    webhookPrompt, setWebhookPrompt,
    webhookMemory, setWebhookMemory,
    webhookFile, setWebhookFile,
    webhookDisparo, setWebhookDisparo
  } = useSettingsStore();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
      <div className="px-4 py-4 border-b border-gray-200 dark:border-dark-700">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Configurações
        </h1>
      </div>

      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          {/* Configurações de Perfil */}
          <div className="bg-white dark:bg-dark-800 rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <div className="w-1 h-6 bg-purple-500 rounded-full mr-3"></div>
              Configurações de Perfil
            </h2>
            <div className="space-y-4">
              <Input
                type="text"
                label="Nome"
              />
              <Input
                type="tel"
                label="Celular"
              />
            </div>
          </div>

          {/* Configurações de Webhook */}
          <div className="bg-white dark:bg-dark-800 rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <div className="w-1 h-6 bg-purple-500 rounded-full mr-3"></div>
              Configurações de Webhook
            </h2>
            <div className="space-y-4">
              <Input
                type="url"
                label="Agente IA"
                placeholder="https://seu-webhook/agente"
                value={webhookAgent}
                onChange={(e) => setWebhookAgent(e.target.value)}
              />
              <Input
                type="url"
                label="Ligar IA"
                placeholder="https://seu-webhook/ligar-ia"
                value={webhookTurnOnAI}
                onChange={(e) => setWebhookTurnOnAI(e.target.value)}
              />
              <Input
                type="url"
                label="Desligar IA"
                placeholder="https://seu-webhook/desligar-ia"
                value={webhookTurnOffAI}
                onChange={(e) => setWebhookTurnOffAI(e.target.value)}
              />
              <Input
                type="url"
                label="Prompt IA"
                placeholder="https://seu-webhook/prompt"
                value={webhookPrompt}
                onChange={(e) => setWebhookPrompt(e.target.value)}
              />
              <Input
                type="url"
                label="Memória IA"
                placeholder="https://seu-webhook/memoria"
                value={webhookMemory}
                onChange={(e) => setWebhookMemory(e.target.value)}
              />
              <Input
                type="url"
                label="Arquivo IA"
                placeholder="https://seu-webhook/arquivo"
                value={webhookFile}
                onChange={(e) => setWebhookFile(e.target.value)}
              />
              <Input
                type="url"
                label="Disparo"
                placeholder="https://seu-webhook/disparo"
                value={webhookDisparo}
                onChange={(e) => setWebhookDisparo(e.target.value)}
              />
            </div>
          </div>

          {/* Termos e Condições */}
          <div className="bg-white dark:bg-dark-800 rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <div className="w-1 h-6 bg-purple-500 rounded-full mr-3"></div>
              Termos e Condições
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a 
                href="#" 
                className="group flex flex-col items-center p-6 bg-gray-50 dark:bg-dark-700 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-600 transition-all duration-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FileText className="h-8 w-8 text-purple-500 mb-3 group-hover:scale-110 transition-transform duration-200" />
                <h3 className="text-base font-medium text-gray-900 dark:text-white mb-2">Termos de Uso</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  Leia nossos termos e condições de uso da plataforma
                </p>
              </a>

              <a 
                href="#" 
                className="group flex flex-col items-center p-6 bg-gray-50 dark:bg-dark-700 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-600 transition-all duration-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Shield className="h-8 w-8 text-purple-500 mb-3 group-hover:scale-110 transition-transform duration-200" />
                <h3 className="text-base font-medium text-gray-900 dark:text-white mb-2">Termos de Segurança</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  Conheça nossas políticas de segurança e privacidade
                </p>
              </a>

              <a 
                href="#" 
                className="group flex flex-col items-center p-6 bg-gray-50 dark:bg-dark-700 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-600 transition-all duration-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Book className="h-8 w-8 text-purple-500 mb-3 group-hover:scale-110 transition-transform duration-200" />
                <h3 className="text-base font-medium text-gray-900 dark:text-white mb-2">Termos Gerais</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  Informações gerais sobre nossos serviços
                </p>
              </a>
            </div>
          </div>

          {/* Botão Salvar */}
          <div className="flex justify-end mt-6">
            <button className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200">
              Salvar Alterações
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 