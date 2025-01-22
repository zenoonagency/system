import { create } from 'zustand';

interface SettingsState {
  profile: {
    name: string;
    phone: string;
  };
  webhooks: {
    agent: string;
    turnOnAI: string;
    turnOffAI: string;
    prompt: string;
    memory: string;
    broadcast: string;
  };
  updateProfile: (name: string, phone: string) => void;
  updateWebhook: (type: 'agent' | 'turnOnAI' | 'turnOffAI' | 'prompt' | 'memory' | 'broadcast', url: string) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  profile: {
    name: '',
    phone: '',
  },
  webhooks: {
    agent: '',
    turnOnAI: '',
    turnOffAI: '',
    prompt: '',
    memory: '',
    broadcast: '',
  },
  updateProfile: (name, phone) =>
    set((state) => ({
      profile: {
        ...state.profile,
        name,
        phone,
      },
    })),
  updateWebhook: (type, url) =>
    set((state) => ({
      webhooks: {
        ...state.webhooks,
        [type]: url,
      },
    })),
})); 