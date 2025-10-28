// src/types/index.ts

// Esta es la forma del objeto 'user' que tu API devuelve en el login
export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

// Esto define qué guardaremos en nuestro Contexto de Autenticación
export interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

// Interfaz para los datos de carrera que vienen de la API
// (Basado en lo que devuelve la API de Ergast)
export interface Race {
  round: string;
  raceName: string;
  date: string;
  country: string; // <-- Asumo que se llama 'country'
  circuitName: string; // <-- Asumo que se llama 'circuitName'
  // Añade o quita propiedades basándote en el console.log del Paso 1
}