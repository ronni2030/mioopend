import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = 'http://localhost:8888';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('authToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.error('API Error:', error.response?.data?.message || error.message);
    
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (refreshToken) {
        try {
          // Implementar refresh token si es necesario
        } catch (refreshError) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('refreshToken');
          return Promise.reject(refreshError);
        }
      } else {
        localStorage.removeItem('authToken');
      }
    }

    return Promise.reject(error);
  }
);

export default api;