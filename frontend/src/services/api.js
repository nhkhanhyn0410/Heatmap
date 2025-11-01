import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
};

// User API
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  updatePreferences: (data) => api.put('/users/preferences', data),
  changePassword: (data) => api.put('/users/password', data),
  deleteAccount: () => api.delete('/users/account'),
};

// Task API
export const taskAPI = {
  getTasks: (params) => api.get('/tasks', { params }),
  getTask: (id) => api.get(`/tasks/${id}`),
  createTask: (data) => api.post('/tasks', data),
  updateTask: (id, data) => api.put(`/tasks/${id}`, data),
  deleteTask: (id) => api.delete(`/tasks/${id}`),
  getTasksByDate: (date) => api.get(`/tasks/date/${date}`),
};

// Activity API
export const activityAPI = {
  getActivities: (params) => api.get('/activities', { params }),
  getActivityByDate: (date) => api.get(`/activities/${date}`),
  getMonthlyHeatmap: (year, month) => api.get(`/activities/heatmap/${year}/${month}`),
  updateActivityNotes: (date, notes) => api.put(`/activities/${date}/notes`, { notes }),
};

// Analytics API
export const analyticsAPI = {
  getWeeklyAnalytics: () => api.get('/analytics/weekly'),
  getMonthlyAnalytics: (year, month) => api.get(`/analytics/monthly/${year}/${month}`),
  getProductivityTrends: (period) => api.get('/analytics/trends', { params: { period } }),
};

// Chatbot API
export const chatbotAPI = {
  sendMessage: (message, includeContext = false) =>
    api.post('/chatbot/message', { message, includeContext }),
  getSuggestions: () => api.get('/chatbot/suggestions'),
};

export default api;
