export const API_ROUTES = {
  auth: {
    login: '/webhook/login',
    register: '/webhook/register',
    logout: '/webhook/logout',
    refreshToken: '/webhook/refresh-token',
  },
  
  ai: {
    start: '/webhook/liga',
    stop: '/webhook/desliga',
    uploadFile: '/webhook/arquivo',
    prompt: '/webhook/prompt',
    memory: '/webhook/memory',
  },
  
  boards: {
    create: '/webhook/boards/create',
    list: '/webhook/boards/list',
    update: '/webhook/boards/update',
    delete: '/webhook/boards/delete',
    duplicate: '/webhook/boards/duplicate',
  },
  
  cards: {
    create: '/webhook/cards/create',
    list: '/webhook/cards/list',
    update: '/webhook/cards/update',
    delete: '/webhook/cards/delete',
    move: '/webhook/cards/move',
  },
  
  clients: {
    create: '/webhook/clients/create',
    list: '/webhook/clients/list',
    update: '/webhook/clients/update',
    delete: '/webhook/clients/delete',
    import: '/webhook/clients/import',
  },
  
  contacts: {
    create: '/webhook/contacts/create',
    list: '/webhook/contacts/list',
    update: '/webhook/contacts/update',
    delete: '/webhook/contacts/delete',
    import: '/webhook/contacts/import',
    deleteAll: '/webhook/contacts/delete-all',
  },
  
  financial: {
    transactions: {
      create: '/webhook/financial/transactions/create',
      list: '/webhook/financial/transactions/list',
      update: '/webhook/financial/transactions/update',
      delete: '/webhook/financial/transactions/delete',
    },
    reports: {
      overview: '/webhook/financial/reports/overview',
      detailed: '/webhook/financial/reports/detailed',
    },
  },
  
  contracts: {
    create: '/webhook/contracts/create',
    list: '/webhook/contracts/list',
    update: '/webhook/contracts/update',
    delete: '/webhook/contracts/delete',
    upload: '/webhook/contracts/upload',
    download: '/webhook/contracts/download',
  },
  
  tasks: {
    create: '/webhook/tasks/create',
    list: '/webhook/tasks/list',
    update: '/webhook/tasks/update',
    delete: '/webhook/tasks/delete',
    complete: '/webhook/tasks/complete',
  },
  
  messaging: {
    send: '/webhook/messaging/send',
    list: '/webhook/messaging/list',
    schedule: '/webhook/messaging/schedule',
    cancel: '/webhook/messaging/cancel',
  },
  
  team: {
    create: '/webhook/team/create',
    list: '/webhook/team/list',
    update: '/webhook/team/update',
    delete: '/webhook/team/delete',
    invite: '/webhook/team/invite',
  },
  
  calendar: {
    events: {
      create: '/webhook/calendar/events/create',
      list: '/webhook/calendar/events/list',
      update: '/webhook/calendar/events/update',
      delete: '/webhook/calendar/events/delete',
    },
    reminders: {
      create: '/webhook/calendar/reminders/create',
      list: '/webhook/calendar/reminders/list',
      update: '/webhook/calendar/reminders/update',
      delete: '/webhook/calendar/reminders/delete',
    },
  },
  
  dataTables: {
    create: '/webhook/data-tables/create',
    list: '/webhook/data-tables/list',
    update: '/webhook/data-tables/update',
    delete: '/webhook/data-tables/delete',
    import: '/webhook/data-tables/import',
    export: '/webhook/data-tables/export',
  },
  
  settings: {
    profile: {
      update: '/webhook/settings/profile/update',
      get: '/webhook/settings/profile/get',
    },
    webhooks: {
      update: '/webhook/settings/webhooks/update',
      get: '/webhook/settings/webhooks/get',
    },
  },
  
  notifications: {
    list: '/webhook/notifications/list',
    markAsRead: '/webhook/notifications/mark-as-read',
    delete: '/webhook/notifications/delete',
    settings: '/webhook/notifications/settings',
  },
}; 