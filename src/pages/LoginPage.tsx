// src/pages/LoginPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api'; // <--- 1. Importa tu cliente Axios
import { useAuth } from '../context/AuthContext'; // <--- 2. Importa el hook de Auth

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const { login } = useAuth(); // <--- 3. Obtiene la función login del contexto
  const navigate = useNavigate(); // Hook para redirigir

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Limpia errores previos

    try {
      // 4. Llama a tu API de Backend
      const response = await api.post('/auth/login', {
        username,
        password,
      });

      // 5. Si la API responde OK (200)
      const { token, user } = response.data;
      
      // 6. Llama a la función login del contexto
      login(token, user);
      
      // 7. Redirige al usuario al 'Home'
      navigate('/'); 

    } catch (err: any) {
      // 8. Maneja el error de la API (ej. 400 Credenciales Inválidas)
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    }
  };

  return (
    <div>
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Usuario: </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Contraseña: </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Entrar</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default LoginPage;