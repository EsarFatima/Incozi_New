// Frontend Configuration
// This file switches between local and deployed backend URLs

const getAPIBase = () => {
  // Check if running on Vercel (production)
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    // Local development
    return 'http://localhost:3000';
  } else {
    // Production - deployed on Vercel
    return 'https://incozi-backend.onrender.com'; // Replace with your Render URL
  }
};

const API_BASE = getAPIBase();

// Export for use in pages
window.API_CONFIG = {
  BASE_URL: API_BASE,
  endpoints: {
    auth: `${API_BASE}/api/auth`,
    services: `${API_BASE}/api/services`,
    payments: `${API_BASE}/api/payments`,
    documents: `${API_BASE}/api/documents`,
    consultations: `${API_BASE}/api/consultations`,
    dashboard: `${API_BASE}/api/dashboard`,
    chat: `${API_BASE}/api/chat`,
    admin: `${API_BASE}/api/admin`
  }
};

console.log('API Base URL:', API_CONFIG.BASE_URL);
