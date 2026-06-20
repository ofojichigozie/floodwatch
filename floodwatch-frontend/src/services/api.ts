import axios from 'axios';
import { ApiResponse, AuthResponse, Reading } from '../types';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('fw_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authService = {
  login: (email: string, password: string) =>
    api.post<ApiResponse<AuthResponse>>('/auth/login', { email, password }),
};

export const readingService = {
  getAll: () => api.get<ApiResponse<Reading[]>>('/readings'),
  delete: (id: string) => api.delete<ApiResponse<Reading>>(`/readings/${id}`),
};
