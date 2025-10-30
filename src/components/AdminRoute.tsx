import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute: React.FC = () => {
  const { user, loadingAuth } = useAuth(); 

  if (loadingAuth) {
    return <div>Verificando autenticación...</div>;
  }

  // Si no está cargando, verificamos
  if (user && user.role === 'admin') {
    return <Outlet />; // El usuario es admin, renderiza AdminPage
  }

  if (user) {
    return <Navigate to="/" replace />; // Logueado, pero NO admin
  }

  return <Navigate to="/login" replace />; // No logueado
};

export default AdminRoute;