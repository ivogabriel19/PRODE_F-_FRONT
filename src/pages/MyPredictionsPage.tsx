// src/pages/MyPredictionsPage.tsx
import React, { useState, useEffect } from 'react';
import api from '../api/api';
import type { Prediction } from '../types'; // Importamos el nuevo tipo

const MyPredictionsPage: React.FC = () => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMyPredictions = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 1. Llama a la ruta del backend que creamos y probamos
        const response = await api.get('/predictions/mis-predicciones');
        
        // 2. Guarda el array de predicciones en el estado
        setPredictions(response.data);

      } catch (err: any) {
        setError(err.message || "Error al cargar las predicciones");
      } finally {
        setLoading(false);
      }
    };

    fetchMyPredictions();
  }, []); // El array vacío [] significa que esto se ejecuta 1 vez al cargar

  if (loading) {
    return <div>Cargando mis predicciones...</div>;
  }
  
  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Mis Predicciones</h2>
      
      {/* 3. Muestra un mensaje si no hay predicciones */}
      {predictions.length === 0 ? (
        <p>Aún no has hecho ninguna predicción.</p>
      ) : (
        <div style={{ marginTop: '20px' }}>
          {/* 4. Mapea y muestra cada predicción */}
          {predictions.map((pred) => (
            <div key={pred._id} style={{ border: '1px solid #ccc', padding: '10px', margin: '5px' }}>
              <h3>Carrera: {pred.raceId} ({pred.raceYear})</h3>
              <p>
                <strong>P1:</strong> {pred.prediccion.p1} | 
                <strong> P2:</strong> {pred.prediccion.p2} | 
                <strong> P3:</strong> {pred.prediccion.p3}
              </p>
              <p style={{fontSize: '0.8em', color: 'gray'}}>
                Enviada el: {new Date(pred.submittedAt).toLocaleString()}
              </p>
              {/* Aquí podrías agregar botones de "Editar" o "Eliminar" */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPredictionsPage;