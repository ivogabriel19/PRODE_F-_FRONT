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
  useEffect(() => {
    const fetchRaces = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 1. Llama a tu API
        const response = await api.get(`/obtener/carreras/${ANIO_ACTUAL}`);
        
        // 2. GUARDA LOS DATOS
        //    'response.data' ES el array de carreras
        //    (o { carreras: [...] } si no cambiaste tu controller)
        
        // --- ARREGLO ---
        // Si tu controller devuelve res.json(carreras)
        setRaces(response.data); 
        console.log('DATOS REALES RECIBIDOS:', response.data); // <--- ¡AÑADE ESTO!
        
        // Si tu controller devuelve res.json({ carreras })
        // setRaces(response.data.carreras); 

      } catch (err: any) {
        setError(err.message || "Error al cargar las carreras");
      } finally {
        setLoading(false);
      }
    };

    fetchRaces();
  }, [ANIO_ACTUAL]); // El 'useEffect' depende del año

  // --- Renderizado Condicional ---
  if (loading) {
    return <div>Cargando calendario...</div>;
  }
  
  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

 return (
    <div>
      <h2>¡Hola {user?.username}!</h2>
      <p>Este es el calendario de la temporada {ANIO_ACTUAL}. ¡Elige una carrera para predecir!</p>
      
      <div style={{ marginTop: '20px' }}>
        {races.map((race) => (
          <div key={race.round} style={{ border: '1px solid #ccc', padding: '10px', margin: '5px' }}>
            <h3>{race.raceName}</h3>
            
            {/* --- ARREGLO AQUÍ --- */}
            <p><strong>Circuito:</strong> {race.circuitName}</p>
            <p><strong>País:</strong> {race.country}</p>
            <p><strong>Fecha:</strong> {race.date}</p>
            
            <button>Predecir</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;