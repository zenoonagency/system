import React, { useState } from 'react';
import { AIControlButton } from '../components/buttons/AIControlButton';
import { DocumentUploadButton } from '../components/buttons/DocumentUploadButton';

export function AIAgent() {
  const [agentWebhook, setAgentWebhook] = useState('');
  const [fileWebhook, setFileWebhook] = useState('');

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">AI Agent Control Panel</h2>
        
        <div className="space-y-6">
          {/* Agent Webhook Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Agent Webhook
            </label>
            <input
              type="text"
              value={agentWebhook}
              onChange={(e) => setAgentWebhook(e.target.value)}
              placeholder="https://seu-webhook.com/agent"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-[#7f00ff] focus:border-[#7f00ff] dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          {/* AI Control Button */}
          <AIControlButton 
            isActive={false} 
            onStatusChange={() => {}} 
            webhook={agentWebhook}
          />

          {/* File Webhook Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Arquivo Webhook
            </label>
            <input
              type="text"
              value={fileWebhook}
              onChange={(e) => setFileWebhook(e.target.value)}
              placeholder="https://seu-webhook.com/arquivo"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-[#7f00ff] focus:border-[#7f00ff] dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          {/* Document Upload Section */}
          <DocumentUploadButton webhook={fileWebhook} />
        </div>
      </div>
    </div>
  );
}