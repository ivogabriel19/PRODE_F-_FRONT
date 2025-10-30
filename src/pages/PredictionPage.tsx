// src/pages/PredictionPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';
import type { Driver } from '../types'; 
import axios from 'axios';

const PredictionPage: React.FC = () => {
  // useParams sigue recibiendo 'round', aunque no lo usemos para el fetch
  const { year, round, raceId } = useParams<{ year: string; round: string; raceId: string }>(); 
  
  const [drivers, setDrivers] = useState<Driver[]>([]);
  
  // Estados del formulario
  const [p1, setP1] = useState<string>('');
  const [p2, setP2] = useState<string>('');
  const [p3, setP3] = useState<string>('');
  
  // --- LÓGICA DE EDICIÓN ---
  // Guardará el ID de la predicción si ya existe una
  const [existingPredictionId, setExistingPredictionId] = useState<string | null>(null);

  // Estados de UI
  const [loading, setLoading] = useState({
    drivers: true,
    prediction: true // Cargamos ambas cosas
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const navigate = useNavigate();

  // useEffect para cargar PILOTOS (sin cambios)
  useEffect(() => {
    if (!year) return; 
    const fetchDrivers = async () => {
      try {
        const response = await api.get(`/obtener/conductores/${year}`);
        setDrivers(response.data);
      } catch (err) {
        console.error("Error drivers:", err);
        setError("Error al cargar los pilotos");
      } finally {
        setLoading(prev => ({ ...prev, drivers: false }));
      }
    };
    fetchDrivers();
  }, [year]);

  // --- useEffect MODIFICADO (para Cargar Predicción Existente) ---
  useEffect(() => {
    // Necesitamos 'year' y 'raceId' para buscar
    if (!year || !raceId) {
        setLoading(prev => ({ ...prev, prediction: false }));
        return;
    }

    const fetchExistingPrediction = async () => {
      try {
        // CERTEZA: Llamamos a la ruta que acabamos de arreglar
        const response = await api.get(`/predictions/race/${year}/${raceId}`);
        
        if (response.data) {
          // Si encontramos una predicción, rellenamos el formulario
          const { prediccion, _id } = response.data;
          setP1(prediccion.p1);
          setP2(prediccion.p2);
          setP3(prediccion.p3);
          setExistingPredictionId(_id); // Guardamos el ID para el UPDATE
        }
        // Si response.data es null, no hacemos nada (es una predicción nueva)

      } catch (err) {
        console.error("Error fetching prediction:", err);
        // No mostramos error, solo no se podrá pre-rellenar
      } finally {
        setLoading(prev => ({ ...prev, prediction: false }));
      }
    };

    fetchExistingPrediction();
  }, [year, raceId]); // Depende de year y raceId

  // --- handleSubmit MODIFICADO (ahora hace POST o PUT) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (p1 === p2 || p1 === p3 || p2 === p3) {
      setError("Los pilotos deben ser diferentes.");
      return;
    }

    try {
      if (existingPredictionId) {
        // --- MODO UPDATE (PUT) ---
        // Tu backend espera solo el campo 'prediccion'
        const updatePayload = { prediccion: { p1, p2, p3 } };
        
        // CERTEZA: Llamamos a tu ruta PUT /:id
        await api.put(`/predictions/${existingPredictionId}`, updatePayload);
        setSuccess("¡Predicción actualizada con éxito! Redirigiendo...");
      } else {
        // --- MODO CREATE (POST) ---
        // Tu backend espera raceYear, raceId, y prediccion
        const createPayload = {
          raceYear: year,
          raceId: raceId,
          prediccion: { p1, p2, p3 }
        };
        
        // CERTEZA: Llamamos a tu ruta POST /
        await api.post('/predictions', createPayload);
        setSuccess("¡Predicción guardada con éxito! Redirigiendo...");
      }
      
      // Redirección
      setTimeout(() => {
        navigate('/'); // O a '/mis-predicciones'
      }, 2000);

    } catch (err) {
      let errorMsg = "Error al guardar la predicción.";
      if (axios.isAxiosError(err) && err.response) {
         errorMsg = err.response.data.message || errorMsg;
      }
      setError(errorMsg);
    }
  };

  // --- Renderizado de Carga MODIFICADO ---
  const isLoading = loading.drivers || loading.prediction;
  if (isLoading) return <div>Cargando datos de la carrera...</div>;
  
  if (error && !drivers.length) return <div style={{ color: 'red' }}>{error}</div>; // Error fatal

  return (
    <div>
      <h2>{existingPredictionId ? 'Editar' : 'Hacer'} Predicción (Año: {year} / Carrera: {raceId})</h2>
      
      <form onSubmit={handleSubmit}>
        
        {/* P1 */}
        <div>
          <label>P1: </label>
          <select value={p1} onChange={(e) => setP1(e.target.value)} required>
            <option value="">-- Elige P1 --</option>
            {drivers.map((driver) => (
              <option key={`p1-${driver.driverId}`} value={driver.driverId}>
                [{driver.code}] {driver.givenName} {driver.familyName}
              </option>
            ))}
          </select>
        </div>
        
        {/* P2 */}
        <div>
          <label>P2: </label>
          <select value={p2} onChange={(e) => setP2(e.target.value)} required>
            <option value="">-- Elige P2 --</option>
            {drivers.map((driver) => (
              <option key={`p2-${driver.driverId}`} value={driver.driverId}>
                [{driver.code}] {driver.givenName} {driver.familyName}
              </option>
            ))}
          </select>
        </div>

        {/* P3 */}
        <div>
          <label>P3: </label>
          <select value={p3} onChange={(e) => setP3(e.target.value)} required>
            <option value="">-- Elige P3 --</option>
            {drivers.map((driver) => (
              <option key={`p3-${driver.driverId}`} value={driver.driverId}>
                [{driver.code}] {driver.givenName} {driver.familyName}
              </option>
            ))}
          </select>
        </div>
        
        <button type="submit" style={{marginTop: '20px'}}>
          {existingPredictionId ? 'Actualizar Predicción' : 'Enviar Predicción'}
        </button>
        
        {/* Muestra el error de validación (ej: pilotos repetidos) */}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
      </form>
    </div>
  );
};

export default PredictionPage;