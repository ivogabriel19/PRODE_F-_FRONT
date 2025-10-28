// src/pages/HomePage.tsx
import React, { useState, useEffect } from 'react';
import api from '../api/api'; // Importamos nuestro Axios
import type { Race } from '../types'; // Importamos el tipo Race
import { useAuth } from '../context/AuthContext'; // Para saludar al usuario

const HomePage: React.FC = () => {
  const { user } = useAuth(); // Saludamos al usuario
  
  // Estados para manejar los datos, carga y errores
  const [races, setRaces] = useState<Race[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const ANIO_ACTUAL = 2024; // Puedes cambiar esto o hacerlo dinámico

  // useEffect se ejecuta 1 vez cuando el componente se monta
  // ... (componente y useEffect) ...
  useEffect(() => {
    const fetchRaces = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await api.get(`/obtener/carreras/${ANIO_ACTUAL}`);
        
        // ¡Esta línea ahora SÍ es correcta!
        // response.data es el array de objetos que definimos en el backend.
        setRaces(response.data); 

      } catch (err: any) {
        setError(err.message || "Error al cargar las carreras");
      } finally {
        setLoading(false);
      }
    };
    fetchRaces();
  }, [ANIO_ACTUAL]);

  // --- Renderizado Condicional ---
  if (loading) {
    return <div>Cargando calendario...</div>;
  }
  
  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

 return (
    <div>
      {/* ... (saludo) ... */}
      
      <div style={{ marginTop: '20px' }}>
        {races.map((race) => (
          <div key={race.round} style={{ border: '1px solid #ccc', padding: '10px', margin: '5px' }}>
            <h3>{race.raceName}</h3>
            {/* Esta línea (que daba el error) ahora SÍ funcionará */}
            <p><strong>País:</strong> {race.Circuit.Location.country}</p>
            <p><strong>Fecha:</strong> {race.date}</p>
            <button>Predecir</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;