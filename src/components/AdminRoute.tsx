import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute: React.FC = () => {
  // 1. Obtenemos el usuario y el estado de carga del contexto
  const { user, loadingAuth } = useAuth(); // Asumo que tu hook se llama así

  // 2. Si todavía está cargando la info del usuario, mostramos un 'loading'
  if (loadingAuth) {
    return <div>Verificando permisos...</div>;
  }

  // 3. Si cargó Y el usuario existe Y es admin...
  if (user && user.role === 'admin') {
    // ...¡Lo dejamos pasar!
    // <Outlet /> es el "portal" donde React Router renderizará la <AdminPage />
    return <Outlet />; 
  }

  // 4. Si no es admin (o no está logueado), lo rebotamos a la Home
  return <Navigate to="/" replace />;
};

export default AdminRoute;