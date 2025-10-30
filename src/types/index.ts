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
  time: string;
  Circuit: {
    circuitId: string;
    circuitName: string;
    Location: {
      country: string;
    };
  };
}

export interface Driver {
  driverId: string;
  givenName: string;
  familyName: string;
  code: string;
}

export interface Prediction {
  _id: string; // El ID de la predicción
  userId: string;
  raceId: string;
  raceYear: string;
  raceDate: string; // La fecha que guardamos
  prediccion: {
    p1: string;
    p2: string;
    p3: string;
    // Agrega pole, vueltaRapida, etc., si los tienes
  };
  // 'createdAt' y 'updatedAt' Mongoose los añade automáticamente
  submittedAt: string; 
}

export interface LeaderboardUser {
  _id: string;
  username: string;
  score: number;
  exactMatches: number;
  perfectPredictions: number;
}