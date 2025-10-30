import React, { useState, useEffect } from 'react';
import api from '../api/api';
import type { Race } from '../types'; // Asumo que tienes este tipo
import axios from 'axios';

const AdminPage: React.FC = () => {
  // Estados para los selects
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [races, setRaces] = useState<Race[]>([]);
  
  // Estado del formulario
  const [selectedRaceId, setSelectedRaceId] = useState<string>('');

  // Estados de UI
  const [loadingRaces, setLoadingRaces] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // 1. Cargar Carreras cuando cambia el año
  useEffect(() => {
    const fetchRaces = async () => {
      if (!year) return;
      try {
        setLoadingRaces(true);
        setError(null);
        setRaces([]); // Limpia las carreras al cambiar de año
        setSelectedRaceId(''); // Resetea la carrera seleccionada
        
        const response = await api.get(`/obtener/carreras/${year}`);
        setRaces(response.data);
      } catch (err) {
        setError("Error al cargar carreras");
      } finally {
        setLoadingRaces(false);
      }
    };
    fetchRaces();
  }, [year]);

  // 2. Handler del Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!selectedRaceId) {
      setError("Debes seleccionar una carrera.");
      return;
    }

    // Confirmación de seguridad
    const raceName = races.find(r => r.Circuit.circuitId === selectedRaceId)?.raceName;
    if (!window.confirm(`¿Estás seguro de procesar los puntajes para ${raceName} (${year})? \n\n¡Esta acción es irreversible!`)) {
      return;
    }

    try {
      setLoadingSubmit(true);
      
      // CERTEZA: El payload que tu backend espera
      const payload = {
        raceYear: year,
        raceId: selectedRaceId,
      };
      
      // CERTEZA: La ruta de tu backend
      const response = await api.post('/admin/procesar-puntajes', payload);
      
      setSuccess(response.data.message || "¡Puntajes procesados con éxito!");
      
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || "Error al procesar puntajes.");
      } else {
        setError("Error desconocido.");
      }
    } finally {
      setLoadingSubmit(false);
    }
  };
  
  return (
    <main>
      <h2>Panel de Administración - Procesar Puntajes</h2>
      <p>Selecciona una carrera para que el sistema obtenga los resultados oficiales y calcule todos los puntajes.</p>

      <form onSubmit={handleSubmit}>
        {/* 1. Selector de Año */}
        <div>
          <label>Temporada: </label>
          <select value={year} onChange={(e) => setYear(e.target.value)}>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            {/* Agrega más años si es necesario */}
          </select>
        </div>

        {loadingRaces && <p>Cargando carreras...</p>}

        {/* 2. Selector de Carrera */}
        <div>
          <label>Carrera a Procesar: </label>
          <select 
            value={selectedRaceId} 
            onChange={(e) => setSelectedRaceId(e.target.value)} 
            required
            disabled={loadingRaces || races.length === 0}
          >
            <option value="">-- Selecciona una carrera --</option>
            {races.map((race) => (
              <option key={race.round} value={race.Circuit.circuitId}>
                {race.raceName}
              </option>
            ))}
          </select>
        </div>

        <button 
          type="submit" 
          disabled={loadingSubmit || loadingRaces || !selectedRaceId}
          style={{
            marginTop: '20px', 
            backgroundColor: loadingSubmit ? '#aaa' : 'darkred', 
            color: 'white',
            padding: '10px 20px',
            fontSize: '1.1rem',
            cursor: 'pointer'
          }}
        >
          {loadingSubmit ? 'Procesando...' : '¡Procesar Puntajes! (Botón Rojo)'}
        </button>

        {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
        {success && <p style={{ color: 'green', marginTop: '1rem' }}>{success}</p>}
      </form>
    </main>
  );
};

export default AdminPage;