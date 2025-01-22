import axios from 'axios';
import { API_ROUTES } from '../api-routes';

// Configuração base do axios
const api = axios.create({
  baseURL: 'https://zenoon-agency-n8n.htm57w.easypanel.host',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token de autenticação
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Serviços
export const authService = {
  async login(email: string, password: string) {
    const response = await api.post(API_ROUTES.auth.login, { email, password });
    return response.data;
  },

  async register(data: any) {
    const response = await api.post(API_ROUTES.auth.register, data);
    return response.data;
  },

  async logout() {
    const response = await api.post(API_ROUTES.auth.logout);
    localStorage.removeItem('auth_token');
    return response.data;
  },
};

export const aiService = {
  async start() {
    const response = await api.post(API_ROUTES.ai.start);
    return response.data;
  },

  async stop() {
    const response = await api.post(API_ROUTES.ai.stop);
    return response.data;
  },

  async uploadFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post(API_ROUTES.ai.uploadFile, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};

export const boardsService = {
  async create(data: any) {
    const response = await api.post(API_ROUTES.boards.create, data);
    return response.data;
  },

  async list() {
    const response = await api.get(API_ROUTES.boards.list);
    return response.data;
  },

  async update(id: string, data: any) {
    const response = await api.put(`${API_ROUTES.boards.update}/${id}`, data);
    return response.data;
  },

  async delete(id: string) {
    const response = await api.delete(`${API_ROUTES.boards.delete}/${id}`);
    return response.data;
  },
};

export const cardsService = {
  async create(data: any) {
    const response = await api.post(API_ROUTES.cards.create, data);
    return response.data;
  },

  async list(boardId: string) {
    const response = await api.get(`${API_ROUTES.cards.list}/${boardId}`);
    return response.data;
  },

  async update(id: string, data: any) {
    const response = await api.put(`${API_ROUTES.cards.update}/${id}`, data);
    return response.data;
  },

  async delete(id: string) {
    const response = await api.delete(`${API_ROUTES.cards.delete}/${id}`);
    return response.data;
  },

  async move(id: string, data: { boardId: string, position: number }) {
    const response = await api.post(`${API_ROUTES.cards.move}/${id}`, data);
    return response.data;
  },
};

export const clientsService = {
  async create(data: any) {
    const response = await api.post(API_ROUTES.clients.create, data);
    return response.data;
  },

  async list() {
    const response = await api.get(API_ROUTES.clients.list);
    return response.data;
  },

  async update(id: string, data: any) {
    const response = await api.put(`${API_ROUTES.clients.update}/${id}`, data);
    return response.data;
  },

  async delete(id: string) {
    const response = await api.delete(`${API_ROUTES.clients.delete}/${id}`);
    return response.data;
  },

  async import(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post(API_ROUTES.clients.import, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};

export const contactsService = {
  async create(data: any) {
    const response = await api.post(API_ROUTES.contacts.create, data);
    return response.data;
  },

  async list() {
    const response = await api.get(API_ROUTES.contacts.list);
    return response.data;
  },

  async update(id: string, data: any) {
    const response = await api.put(`${API_ROUTES.contacts.update}/${id}`, data);
    return response.data;
  },

  async delete(id: string) {
    const response = await api.delete(`${API_ROUTES.contacts.delete}/${id}`);
    return response.data;
  },

  async deleteAll() {
    const response = await api.delete(API_ROUTES.contacts.deleteAll);
    return response.data;
  },

  async import(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post(API_ROUTES.contacts.import, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};

export const financialService = {
  transactions: {
    async create(data: any) {
      const response = await api.post(API_ROUTES.financial.transactions.create, data);
      return response.data;
    },

    async list() {
      const response = await api.get(API_ROUTES.financial.transactions.list);
      return response.data;
    },

    async update(id: string, data: any) {
      const response = await api.put(`${API_ROUTES.financial.transactions.update}/${id}`, data);
      return response.data;
    },

    async delete(id: string) {
      const response = await api.delete(`${API_ROUTES.financial.transactions.delete}/${id}`);
      return response.data;
    },
  },

  reports: {
    async getOverview() {
      const response = await api.get(API_ROUTES.financial.reports.overview);
      return response.data;
    },

    async getDetailed(filters: any) {
      const response = await api.get(API_ROUTES.financial.reports.detailed, { params: filters });
      return response.data;
    },
  },
};

export const contractsService = {
  async create(data: any) {
    const response = await api.post(API_ROUTES.contracts.create, data);
    return response.data;
  },

  async list() {
    const response = await api.get(API_ROUTES.contracts.list);
    return response.data;
  },

  async update(id: string, data: any) {
    const response = await api.put(`${API_ROUTES.contracts.update}/${id}`, data);
    return response.data;
  },

  async delete(id: string) {
    const response = await api.delete(`${API_ROUTES.contracts.delete}/${id}`);
    return response.data;
  },

  async upload(id: string, file: File) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post(`${API_ROUTES.contracts.upload}/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async download(id: string) {
    const response = await api.get(`${API_ROUTES.contracts.download}/${id}`, {
      responseType: 'blob',
    });
    return response.data;
  },
};

export const tasksService = {
  async create(data: any) {
    const response = await api.post(API_ROUTES.tasks.create, data);
    return response.data;
  },

  async list() {
    const response = await api.get(API_ROUTES.tasks.list);
    return response.data;
  },

  async update(id: string, data: any) {
    const response = await api.put(`${API_ROUTES.tasks.update}/${id}`, data);
    return response.data;
  },

  async delete(id: string) {
    const response = await api.delete(`${API_ROUTES.tasks.delete}/${id}`);
    return response.data;
  },

  async complete(id: string) {
    const response = await api.post(`${API_ROUTES.tasks.complete}/${id}`);
    return response.data;
  },
};

export const messagingService = {
  async send(data: any) {
    const response = await api.post(API_ROUTES.messaging.send, data);
    return response.data;
  },

  async list() {
    const response = await api.get(API_ROUTES.messaging.list);
    return response.data;
  },

  async schedule(data: any) {
    const response = await api.post(API_ROUTES.messaging.schedule, data);
    return response.data;
  },

  async cancel(id: string) {
    const response = await api.post(`${API_ROUTES.messaging.cancel}/${id}`);
    return response.data;
  },
};

export const teamService = {
  async create(data: any) {
    const response = await api.post(API_ROUTES.team.create, data);
    return response.data;
  },

  async list() {
    const response = await api.get(API_ROUTES.team.list);
    return response.data;
  },

  async update(id: string, data: any) {
    const response = await api.put(`${API_ROUTES.team.update}/${id}`, data);
    return response.data;
  },

  async delete(id: string) {
    const response = await api.delete(`${API_ROUTES.team.delete}/${id}`);
    return response.data;
  },

  async invite(data: any) {
    const response = await api.post(API_ROUTES.team.invite, data);
    return response.data;
  },
};

export const calendarService = {
  events: {
    async create(data: any) {
      const response = await api.post(API_ROUTES.calendar.events.create, data);
      return response.data;
    },

    async list() {
      const response = await api.get(API_ROUTES.calendar.events.list);
      return response.data;
    },

    async update(id: string, data: any) {
      const response = await api.put(`${API_ROUTES.calendar.events.update}/${id}`, data);
      return response.data;
    },

    async delete(id: string) {
      const response = await api.delete(`${API_ROUTES.calendar.events.delete}/${id}`);
      return response.data;
    },
  },

  reminders: {
    async create(data: any) {
      const response = await api.post(API_ROUTES.calendar.reminders.create, data);
      return response.data;
    },

    async list() {
      const response = await api.get(API_ROUTES.calendar.reminders.list);
      return response.data;
    },

    async update(id: string, data: any) {
      const response = await api.put(`${API_ROUTES.calendar.reminders.update}/${id}`, data);
      return response.data;
    },

    async delete(id: string) {
      const response = await api.delete(`${API_ROUTES.calendar.reminders.delete}/${id}`);
      return response.data;
    },
  },
};

export const dataTablesService = {
  async create(data: any) {
    const response = await api.post(API_ROUTES.dataTables.create, data);
    return response.data;
  },

  async list() {
    const response = await api.get(API_ROUTES.dataTables.list);
    return response.data;
  },

  async update(id: string, data: any) {
    const response = await api.put(`${API_ROUTES.dataTables.update}/${id}`, data);
    return response.data;
  },

  async delete(id: string) {
    const response = await api.delete(`${API_ROUTES.dataTables.delete}/${id}`);
    return response.data;
  },

  async import(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post(API_ROUTES.dataTables.import, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async export(id: string) {
    const response = await api.get(`${API_ROUTES.dataTables.export}/${id}`, {
      responseType: 'blob',
    });
    return response.data;
  },
};

export const settingsService = {
  profile: {
    async update(data: any) {
      const response = await api.put(API_ROUTES.settings.profile.update, data);
      return response.data;
    },

    async get() {
      const response = await api.get(API_ROUTES.settings.profile.get);
      return response.data;
    },
  },

  webhooks: {
    async update(data: any) {
      const response = await api.put(API_ROUTES.settings.webhooks.update, data);
      return response.data;
    },

    async get() {
      const response = await api.get(API_ROUTES.settings.webhooks.get);
      return response.data;
    },
  },
};

export const notificationsService = {
  async list() {
    const response = await api.get(API_ROUTES.notifications.list);
    return response.data;
  },

  async markAsRead(id: string) {
    const response = await api.post(`${API_ROUTES.notifications.markAsRead}/${id}`);
    return response.data;
  },

  async delete(id: string) {
    const response = await api.delete(`${API_ROUTES.notifications.delete}/${id}`);
    return response.data;
  },

  async updateSettings(data: any) {
    const response = await api.put(API_ROUTES.notifications.settings, data);
    return response.data;
  },
};