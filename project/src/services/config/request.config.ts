export const REQUEST_CONFIG = {
  headers: {
    base: {
      'Accept': 'application/json',
    },
    json: {
      'Content-Type': 'application/json',
    }
  },
  timeouts: {
    default: 30000,
    upload: 60000,
  },
  retries: {
    count: 2,
    delay: 1000,
  }
};