// src/pages/MyResultsPage.tsx
import React, { useState, useEffect } from 'react';
// Link no se usa, pero puede ser útil
import api from '../api/api';
import type { Result, Race, Driver } from '../types'; // Nota: Importamos 'Result'

const MyResultsPage: React.FC = () => {
  // Solo estado para puntuados
  const [scored, setScored] = useState<Result[]>([]);
  
  // Tablas de Búsqueda
  const [races, setRaces] = useState<Race[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const currentYear = new Date().getFullYear().toString();

        // 3 llamadas: resultados, carreras, y pilotos
        const [
          scoredRes,
          racesRes,
          driversRes
        ] = await Promise.all([
          api.get('/resultados/mis-resultados'),
          api.get(`/obtener/carreras/${currentYear}`), 
          api.get(`/obtener/conductores/${currentYear}`)
        ]);

        setScored(scoredRes.data);
        setRaces(racesRes.data);
        setDrivers(driversRes.data);

      } catch (err) {
        console.error("Error fetching data:", err);
        setError("No se pudieron cargar tus resultados.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- Funciones "Traductoras" (idénticas) ---
  const getRaceName = (raceId: string): string => {
    const race = races.find(r => r.Circuit.circuitId === raceId);
    return race ? race.raceName : raceId;
  };

  const getDriverName = (driverId: string): string => {
    const driver = drivers.find(d => d.driverId === driverId);
    return driver ? `${driver.givenName} ${driver.familyName}` : driverId;
  };
  
  const getDriverCode = (driverId: string): string => {
    const driver = drivers.find(d => d.driverId === driverId);
    return driver ? `[${driver.code}]` : "";
  }

  // --- Renderizado ---
  if (loading) {
    return <div>Cargando tu historial de resultados...</div>;
  }

  if (error) {
    // Copiamos el estilo de error de la página de predicciones
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    // Usamos 'main' para la semántica, pero 'div' también funcionaría
    <main>
      <h2>Mis Resultados (Historial)</h2>
      <p>Aquí están tus predicciones que ya fueron procesadas y puntuadas.</p>

      {/* 1. Contenedor de la lista (estilo de MyPredictionsPage) */}
      <section style={{ marginTop: '20px' }}>
        {scored.length === 0 ? (
          <p>Aún no tienes resultados procesados.</p>
        ) : (
          // 2. Mapeamos los resultados
          scored.map(result => (
            // 3. Card (estilo de MyPredictionsPage)
            <div 
              style={{ border: '1px solid #ccc', padding: '10px', margin: '5px' }} 
              key={result._id}
            >
              {/* 4. Título (con reseteo de margen) */}
              <h4 style={{ marginTop: 0, marginBottom: '10px' }}>
                {getRaceName(result.raceId)} ({result.raceYear})
              </h4>
              
              {/* 5. Timestamp (estilo de MyPredictionsPage) */}
              <p style={{ fontSize: '0.8em', color: 'gray', margin: '5px 0' }}>
                Procesado el: {new Date(result.processedAt).toLocaleString()}
              </p>

              {/* 6. Lista de predicciones (con reseteo de estilos de <ul>) */}
              <ul style={{ listStyleType: 'none', paddingLeft: 0, margin: '10px 0' }}>
                <li style={{ marginBottom: '3px' }}>
                  P1: {getDriverCode(result.prediccion.p1)} {getDriverName(result.prediccion.p1)}
                </li>
                <li style={{ marginBottom: '3px' }}>
                  P2: {getDriverCode(result.prediccion.p2)} {getDriverName(result.prediccion.p2)}
                </li>
                <li style={{ marginBottom: '3px' }}>
                  P3: {getDriverCode(result.prediccion.p3)} {getDriverName(result.prediccion.p3)}
                </li>
              </ul>
              
              {/* 7. El badge de puntaje (estilo simple) */}
              <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #eee', fontWeight: 'bold' }}>
                Puntaje Obtenido: <strong>{result.score}</strong>
              </div>
            </div>
          ))
        )}
      </section>
    </main>
  );
};

export default MyResultsPage;