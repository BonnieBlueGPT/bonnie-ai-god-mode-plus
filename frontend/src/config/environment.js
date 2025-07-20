// 🔥 GALATEA EMPIRE - ENVIRONMENT CONFIGURATION
// Central config for all AI girlfriends and backend connections

const ENVIRONMENTS = {
  development: {
    BACKEND_URL: 'http://localhost:3005',
    WS_URL: 'ws://localhost:3005',
    DEBUG: true,
    LOG_LEVEL: 'debug'
  },
  production: {
    BACKEND_URL: 'https://bonnie-production.onrender.com',
    WS_URL: 'wss://bonnie-production.onrender.com',
    DEBUG: false,
    LOG_LEVEL: 'error'
  }
};

const getCurrentEnv = () => {
  return import.meta.env.MODE || 'production';
};

export const CONFIG = ENVIRONMENTS[getCurrentEnv()];

export const API_ENDPOINTS = {
  CHAT: `${CONFIG.BACKEND_URL}/api/chat`,
  AUTH: `${CONFIG.BACKEND_URL}/api/auth`,
  PERSONALITY: `${CONFIG.BACKEND_URL}/api/personality`,
  MEMORY: `${CONFIG.BACKEND_URL}/api/memory`,
  UPSELL: `${CONFIG.BACKEND_URL}/api/upsell`,
  WEBSOCKET: CONFIG.WS_URL
};

export default CONFIG;