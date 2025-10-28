// src/pages/RegisterPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api'; // 1. Importa tu cliente Axios
import { useAuth } from '../context/AuthContext'; // 2. Importa el hook de Auth

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState(''); // <-- Campo adicional
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const { login } = useAuth(); // <-- 3. Usamos 'login' para el auto-login
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      // 4. Llama al endpoint de REGISTRO
      const response = await api.post('/auth/register', {
        username,
        email, // <-- Envía el email
        password,
      });

      // 5. Si el registro es exitoso (API devuelve token y user)
      const { token, user } = response.data;
      
      // 6. Logueamos al usuario automáticamente
      login(token, user);
      
      // 7. Redirigimos al Home
      navigate('/'); 

    } catch (err: any) {
      // 8. Maneja el error (ej. "Usuario ya existe")
      setError(err.response?.data?.message || 'Error al registrar');
    }
  };

  return (
    <div>
      <h2>Crear Cuenta</h2>
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
          <label>Email: </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
        <button type="submit">Registrarse</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default RegisterPage;