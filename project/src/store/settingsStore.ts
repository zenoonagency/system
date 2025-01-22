import { create } from 'zustand';

interface SettingsState {
  webhookAgent: string;
  webhookTurnOnAI: string;
  webhookTurnOffAI: string;
  webhookPrompt: string;
  webhookMemory: string;
  webhookFile: string;
  webhookDisparo: string;
  setWebhookAgent: (url: string) => void;
  setWebhookTurnOnAI: (url: string) => void;
  setWebhookTurnOffAI: (url: string) => void;
  setWebhookPrompt: (url: string) => void;
  setWebhookMemory: (url: string) => void;
  setWebhookFile: (url: string) => void;
  setWebhookDisparo: (url: string) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  webhookAgent: '',
  webhookTurnOnAI: '',
  webhookTurnOffAI: '',
  webhookPrompt: '',
  webhookMemory: '',
  webhookFile: '',
  webhookDisparo: '',
  setWebhookAgent: (url) => set({ webhookAgent: url }),
  setWebhookTurnOnAI: (url) => set({ webhookTurnOnAI: url }),
  setWebhookTurnOffAI: (url) => set({ webhookTurnOffAI: url }),
  setWebhookPrompt: (url) => set({ webhookPrompt: url }),
  setWebhookMemory: (url) => set({ webhookMemory: url }),
  setWebhookFile: (url) => set({ webhookFile: url }),
  setWebhookDisparo: (url) => set({ webhookDisparo: url }),
})); 