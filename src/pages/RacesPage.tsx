// src/pages/HomePage.tsx
import React, { useState, useEffect } from 'react';
import api from '../api/api';
import type { Race } from '../types';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const RacePage: React.FC = () => {
  const { user } = useAuth(); // Saludamos al usuario

  // Estados
  const [races, setRaces] = useState<Race[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // --- ARREGLO: Año dinámico ---
  // Obtenemos el año actual del sistema (ej: 2025)
  const [year, setYear] = useState(new Date().getFullYear());
  // (En el futuro, podrías agregar un <select> para cambiar este estado 'year')
  
  // useEffect se ejecuta cuando el componente se monta o si 'year' cambia
  useEffect(() => {
    const fetchRaces = async () => {
      try {
        setLoading(true);
        setError(null);

        // Usamos el 'year' del estado para la llamada a la API
        const response = await api.get(`/obtener/carreras/${year}`);

        setRaces(response.data);

      } catch (err: any) {
        setError(err.message || "Error al cargar las carreras");
      } finally {
        setLoading(false);
      }
    };
    
    fetchRaces();
  }, [year]); // El hook depende del estado 'year'

  // --- Renderizado Condicional ---
  if (loading) {
    return <div>Cargando calendario {year}...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  return (
    <main>
      <p>Este es el calendario de la temporada {year}. ¡Elige una carrera para predecir!</p>

      <div className='racesContainer'>
        {races.map((race) => {
          const raceYear = race.date.substring(0, 4);
          const raceId = race.Circuit.circuitId;

          return (
            <div className='raceCard' key={race.round}>
              <h3>{race.raceName}</h3>
              <p><strong>País:</strong> {race.Circuit.Location.country}</p>
              <p><strong>Fecha:</strong> {race.date}</p>

              {/* Ahora 'raceYear' y 'race.round' están definidos y son consistentes */}
              <Link to={`/predecir/${raceYear}/${race.round}/${raceId}`}>
                <button>Predecir</button>
              </Link>

            </div>
          );
        })}
      </div>
    </main>
  );
};

export default RacePage;