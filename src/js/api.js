// src/js/api.js
// Centralized API Client

import CONFIG from './config.js';

class APIClient {
  constructor(config) {
    this.baseURL = config.api.baseURL;
    this.timeout = config.api.timeout;
  }

  /**
   * Generic request handler
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const fetchOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
        ...options.headers,
      },
      timeout: this.timeout,
      ...options,
    };

    try {
      const response = await fetch(url, fetchOptions);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  /**
   * Get authentication headers
   */
  getAuthHeaders() {
    const token = localStorage.getItem('auth_token');
    if (!token) return {};
    
    return {
      'Authorization': `Bearer ${token}`,
    };
  }

  // ===== AUTH ENDPOINTS =====

  auth = {
    register: (data) => this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

    login: (email, password) => this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

    logout: () => this.request('/api/auth/logout', { method: 'POST' }),

    verifyEmail: (token) => this.request('/api/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    }),

    resetPassword: (email) => this.request('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),
  };

  // ===== SERVICES ENDPOINTS =====

  services = {
    list: (filters = {}) => {
      const params = new URLSearchParams(filters);
      return this.request(`/api/services?${params}`);
    },

    get: (id) => this.request(`/api/services/${id}`),

    create: (data) => this.request('/api/services', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

    update: (id, data) => this.request(`/api/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

    delete: (id) => this.request(`/api/services/${id}`, { method: 'DELETE' }),
  };

  // ===== CONSULTATIONS ENDPOINTS =====

  consultations = {
    list: () => this.request('/api/consultations'),

    get: (id) => this.request(`/api/consultations/${id}`),

    create: (data) => this.request('/api/consultations', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

    updateStatus: (id, status) => this.request(`/api/consultations/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),

    cancel: (id, reason) => this.request(`/api/consultations/${id}/cancel`, {
      method: 'PUT',
      body: JSON.stringify({ reason }),
    }),
  };

  // ===== PAYMENTS ENDPOINTS =====

  payments = {
    checkout: (data) => this.request('/api/payments/checkout', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

    confirm: (paymentIntentId) => this.request('/api/payments/confirm', {
      method: 'POST',
      body: JSON.stringify({ paymentIntentId }),
    }),

    history: () => this.request('/api/payments/history'),

    refund: (transactionId, reason) => this.request(`/api/payments/refund`, {
      method: 'POST',
      body: JSON.stringify({ transactionId, reason }),
    }),
  };

  // ===== CHAT ENDPOINTS =====

  chat = {
    conversations: () => this.request('/api/chat/conversations'),

    messages: (conversationId) => this.request(`/api/chat/${conversationId}/messages`),

    sendMessage: (conversationId, message) => this.request(`/api/chat/${conversationId}/message`, {
      method: 'POST',
      body: JSON.stringify({ content: message }),
    }),
  };

  // ===== USER ENDPOINTS =====

  user = {
    profile: () => this.request('/api/user/profile'),

    updateProfile: (data) => this.request('/api/user/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

    changePassword: (oldPassword, newPassword) => 
      this.request('/api/user/password', {
        method: 'PUT',
        body: JSON.stringify({ oldPassword, newPassword }),
      }),
  };

  // ===== ADMIN ENDPOINTS =====

  admin = {
    dashboard: () => this.request('/api/admin/dashboard'),

    users: () => this.request('/api/admin/users'),

    consultations: () => this.request('/api/admin/consultations'),

    payments: () => this.request('/api/admin/payments'),
  };
}

export default new APIClient(CONFIG);
