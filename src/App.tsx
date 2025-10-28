// src/App.tsx
import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute'; // Importamos el guardián

const App: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // --- ¡EL 'RETURN' QUE FALTABA ESTÁ AQUÍ! ---
  return (
    <div>
      <nav>
        <Link to="/">Home</Link>
        {isAuthenticated ? (
          <>
            <span style={{ margin: '0 10px' }}>
              | ¡Hola, <strong>{user?.username}</strong>! 
            </span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            | <Link to="/login">Login</Link>
            | <Link to="/register">Registro</Link>
          </>
        )}
      </nav>
      
      <hr />
      
      <Routes>
        {/* --- Ruta Protegida --- */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          } 
        />
        {/* --- Rutas Públicas --- */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </div>
  );
};

export default App;