import { LoginData, RegisterData, User } from '../types/auth';
import { aiService } from './ai/ai.service';
import { documentService } from './document/document.service';
import { userService } from './user/user.service';
import { useSettingsStore } from '../store/settingsStore';

export const api = {
  async login(data: LoginData): Promise<User> {
    try {
      // Simulação de API - Em produção, conectar com backend real
      return await new Promise((resolve) => {
        const settings = useSettingsStore.getState();
        setTimeout(() => {
          resolve({
            id: '1',
            name: settings.profile.name || 'Usuário',
            email: data.email,
          });
        }, 1000);
      });
    } catch (error) {
      console.error('Login Error:', error);
      throw error;
    }
  },

  register: userService.register,
  startAI: aiService.start,
  stopAI: aiService.stop,
  uploadDocument: documentService.upload,
};