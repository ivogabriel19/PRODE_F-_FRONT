// src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Este componente recibe 'children' (otros componentes)
const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  
  const { isAuthenticated } = useAuth(); // 1. Revisa si el usuario está logueado

  if (!isAuthenticated) {
    // 2. Si NO está logueado, lo redirige al login
    return <Navigate to="/login" replace />;
  }

  // 3. Si SÍ está logueado, muestra el componente que le pasamos (ej. HomePage)
  return children;
};

export default ProtectedRoute;