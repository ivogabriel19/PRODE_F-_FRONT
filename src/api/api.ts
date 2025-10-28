// src/api/api.ts
import axios, { InternalAxiosRequestConfig } from 'axios';

const API_URL = 'http://localhost:3000/api'; // La URL de tu backend

const api = axios.create({
  baseURL: API_URL,
});

// ¡La Magia con Tipos!
// Usamos el tipo 'InternalAxiosRequestConfig' para tipar el interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      // TypeScript se asegura de que 'headers' exista
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;