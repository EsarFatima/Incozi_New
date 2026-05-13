// src/js/config.js
// Application Configuration

const CONFIG = {
  // API Configuration
  api: {
    baseURL: window.location.hostname.includes('vercel.app') 
      ? 'https://incozi-new.onrender.com' 
      : '', // Relative URL for development
    timeout: 30000, // ms
  },

  // Feature Flags
  features: {
    socketIO: true,
    realTimeChat: true,
    stripePayments: true,
    emailNotifications: true,
  },

  // Theme
  theme: {
    primaryColor: '#667eea',
    accentColor: '#764ba2',
  },

  // Pagination
  pagination: {
    perPage: 10,
    maxVisible: 5,
  },

  // Timeouts
  timeouts: {
    sessionWarning: 15 * 60 * 1000, // 15 mins in ms
    sessionTimeout: 30 * 60 * 1000,  // 30 mins in ms
  },

  // Storage Keys
  storage: {
    authToken: 'auth_token',
    userId: 'user_id',
    userRole: 'user_role',
    preferences: 'user_preferences',
  },
};

export default CONFIG;
