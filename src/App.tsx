// src/App.tsx
import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute'; // Importamos el guardián
import PredictionPage from './pages/PredictionPage';
import MyPredictionsPage from './pages/MyPredictionsPage';
import RacesPage from './pages/RacesPage';
import AdminRoute from './components/AdminRoute';
import AdminPage from './pages/AdminPage';

const App: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div>
      <header>
        <nav>
          <Link to="/">Home</Link>
          | {isAuthenticated && <Link to="/mis-predicciones">Mis Predicciones</Link>}
          | {isAuthenticated && <Link to="/carreras">Carreras</Link>}
        </nav>

        {isAuthenticated ? (
          <div className='user'>
            <span style={{ margin: '0 10px' }}>
              ¡Hola, <strong>{user?.username}</strong>!
            </span>
            <button onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <div className='user'>
            <Link to="/login">Login</Link>
            <Link to="/register">Registro</Link>
          </div>
        )}
      </header>

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
        <Route
          path="/carreras"
          element={<ProtectedRoute><RacesPage /></ProtectedRoute>}
        />
        <Route
          path="/mis-predicciones"
          element={<ProtectedRoute><MyPredictionsPage /></ProtectedRoute>}
        />
        <Route
          path="/predecir/:year/:round/:raceId"
          element={<ProtectedRoute><PredictionPage /></ProtectedRoute>}
        />
        {/*
        <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminPage />} />
        </Route>
        */}
        <Route path="/admin" element={<AdminPage />} />

        {/* --- Rutas Públicas --- */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </div>
  );
};

export default App;