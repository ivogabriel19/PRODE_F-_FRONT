// src/pages/HomePage.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/api'; 
import axios from 'axios';
import type { LeaderboardUser } from '../types';
import './Leaderboard.css'; 

const Leaderboard: React.FC = () => {
  const { user } = useAuth(); // Esto viene de tu AuthContext

  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]); // Array de nuestros usuarios
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // La ruta de la API está correcta (GET /users/leaderboard)
        const response = await api.get('/users/leaderboard');

        // Ahora TypeScript sabe que response.data debe ser un array de LeaderboardUser
        setLeaderboardData(response.data);

      } catch (err) {
        console.error("Error fetching leaderboard:", err);
        let errorMsg = "No se pudo cargar la tabla de posiciones.";

        // --- PASO 3: Manejo de errores "type-safe" ---
        // Verificamos si el error es un error de Axios
        if (axios.isAxiosError(err)) {
          if (err.response && err.response.data && err.response.data.message) {
            // Sabemos que err.response.data.message existe
            errorMsg = err.response.data.message;
          }
        }
        setError(errorMsg);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, []); // El array vacío asegura que se ejecute solo una vez


  if (isLoading) {
    return <div className="loading-message">Cargando tabla de posiciones...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
      <div className="leaderboard-container">
        <h2>🏆 Leaderboard</h2>

        {leaderboardData.length === 0 ? (
          <p>Aún no hay datos en el leaderboard.</p>
        ) : (
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>Pos.</th>
                <th>Usuario</th>
                <th>Puntos</th>
                <th>Aciertos Exactos</th>
                <th>Predicciones Perfectas</th>
              </tr>
            </thead>
            <tbody>
              {/* Ahora 'user' es inferido como LeaderboardUser */}
              {leaderboardData.map((user, index) => (
                <tr key={user._id}>
                  <td className="pos-cell">{index + 1}</td>
                  <td className="user-cell">{user.username}</td>
                  <td className="score-cell">{user.score}</td>
                  <td className="matches-cell">{user.exactMatches}</td>
                  <td className="perfect-cell">{user.perfectPredictions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
  );
};

export default Leaderboard;