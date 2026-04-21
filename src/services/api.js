import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to request headers
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

// API Service Methods
export const authService = {
  login: (email, password) =>
    apiClient.post('/auth/login', { email, password }),
  register: (userData) =>
    apiClient.post('/auth/register', userData),
  logout: () =>
    apiClient.post('/auth/logout'),
  verifyEmail: (code) =>
    apiClient.post('/auth/verify', { code }),
  resetPassword: (email) =>
    apiClient.post('/auth/reset-password', { email }),
};

export const servicesService = {
  list: (filters) =>
    apiClient.get('/services', { params: filters }),
  get: (id) =>
    apiClient.get(`/services/${id}`),
  create: (data) =>
    apiClient.post('/services', data),
  update: (id, data) =>
    apiClient.put(`/services/${id}`, data),
  delete: (id) =>
    apiClient.delete(`/services/${id}`),
  search: (query) =>
    apiClient.get('/services/search', { params: { q: query } }),
};

export const consultationsService = {
  list: (filters) =>
    apiClient.get('/consultations', { params: filters }),
  get: (id) =>
    apiClient.get(`/consultations/${id}`),
  create: (data) =>
    apiClient.post('/consultations', data),
  updateStatus: (id, status) =>
    apiClient.patch(`/consultations/${id}/status`, { status }),
  cancel: (id) =>
    apiClient.post(`/consultations/${id}/cancel`),
};

export const paymentsService = {
  checkout: (data) =>
    apiClient.post('/payments/checkout', data),
  confirm: (paymentIntentId) =>
    apiClient.post('/payments/confirm', { paymentIntentId }),
  history: () =>
    apiClient.get('/payments/history'),
  refund: (id) =>
    apiClient.post(`/payments/${id}/refund`),
};

export const userService = {
  getProfile: () =>
    apiClient.get('/user/profile'),
  updateProfile: (data) =>
    apiClient.put('/user/profile', data),
  changePassword: (data) =>
    apiClient.post('/user/change-password', data),
  getServices: () =>
    apiClient.get('/user/services'),
};

export const adminService = {
  getUsers: (filters) => apiClient.get('/admin/users', { params: filters }),
  getUserDocuments: (userId) => apiClient.get(`/admin/users/${userId}/documents`),
  getStats: () => apiClient.get('/admin/stats'),
  getDashboard: () => apiClient.get('/admin/dashboard'),
  getConsultations: (filters) => apiClient.get('/admin/consultations', { params: filters }),
  getPayments: (filters) => apiClient.get('/admin/payments', { params: filters }),
};

export const documentService = {
  upload: (formData) => apiClient.post('/documents/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getMyDocuments: () => apiClient.get('/documents/my-documents'),
  delete: (id) => apiClient.delete(`/documents/${id}`),
};

export default apiClient;
