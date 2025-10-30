// src/pages/ScoringInfoPage.tsx
import React from 'react';

// --- Estilos en línea (los mismos que antes) ---
const styles = {
  container: {
    padding: '20px',
    maxWidth: '800px',
    margin: 'auto',
    fontFamily: 'Arial, sans-serif',
    lineHeight: 1.6,
  },
  title: {
    borderBottom: '2px solid #eee',
    paddingBottom: '10px',
    color: '#333',
  },
  section: {
    marginTop: '25px',
    marginBottom: '25px',
  },
  subTitle: {
    color: '#555',
    borderBottom: '1px solid #f0f0f0',
    paddingBottom: '5px',
  },
  list: {
    listStyleType: 'decimal', 
    paddingLeft: '30px',
  },
  listItem: {
    marginBottom: '15px',
  },
  emphasis: {
    fontWeight: 'bold',
    color: '#0056b3', // Un azul para destacar puntos
  },
  noteBox: {
    fontStyle: 'italic',
    color: '#444',
    marginTop: '15px',
    padding: '15px',
    background: '#f9f9f9',
    borderLeft: '4px solid #0056b3',
    borderRadius: '4px',
  },
  example: {
    marginTop: '15px',
    paddingTop: '10px',
    borderTop: '1px dashed #ccc',
  },
  code: {
    fontFamily: 'monospace',
    background: '#eee',
    padding: '2px 4px',
    borderRadius: '3px',
  }
};

// --- El Componente (Corregido) ---

const ScoringInfoPage: React.FC = () => {
  return (
    <main style={styles.container}>
      <h2 style={styles.title}>🏁 Sistema de Puntuación (Corregido)</h2>
      <p>
        Aquí te explicamos cómo calculamos los puntos para tus 
        predicciones del podio (P1, P2 y P3) después de cada carrera,
        basado en el resultado final (Top 10).
      </p>

      <section style={styles.section}>
        <h3 style={styles.subTitle}>Reglas de Puntuación</h3>
        <p>
          Para cada uno de tus 3 pilotos predichos, comprobamos:
        </p>
        
        <ol style={styles.list}>
          <li style={styles.listItem}>
            <strong>Acierto Exacto (P1, P2 o P3):</strong> <span style={styles.emphasis}>+10 puntos</span>
            <br />
            Si aciertas la posición exacta del piloto dentro del podio.
            <br />
            (Ej: Predices P1 <code style={styles.code}>VER</code> y <code style={styles.code}>VER</code> termina P1).
          </li>
          <li style={styles.listItem}>
            <strong>Piloto en Podio (Posición Incorrecta):</strong> <span style={styles.emphasis}>+5 puntos</span>
            <br />
            Si tu piloto predicho termina en el podio (Top 3), pero en una 
            posición <strong>diferente</strong> a la que predijiste.
            <br />
            (Ej: Predices P1 <code style={styles.code}>VER</code> y <code style={styles.code}>VER</code> termina P2 o P3).
          </li>
          <li style={styles.listItem}>
            <strong>Piloto en Top 10 (Fuera del Podio):</strong> <span style={styles.emphasis}>+2 puntos</span>
            <br />
            Si tu piloto predicho <strong>no</strong> termina en el podio, pero sí 
            termina entre las posiciones 4 y 10.
          </li>
          <li style={styles.listItem}>
            <strong>Piloto fuera del Top 10:</strong> <span style={styles.emphasis}>0 puntos</span>
            <br />
            Si tu piloto predicho termina P11 o peor, o no termina la carrera (DNF).
          </li>
        </ol>
      </section>

      <section style={styles.section}>
        <h3 style={styles.subTitle}>Aclaración Importante</h3>
        
        <div style={styles.noteBox}>
          <strong>Los puntos no son acumulativos por piloto.</strong>
          <br />
          Si predices a <code style={styles.code}>VER</code> en P1 y él gana (P1), 
          obtienes <strong>10 puntos</strong> por "Acierto Exacto". 
          <br />
          No obtienes 10 puntos (acierto exacto) + 5 puntos (en podio) + 2 puntos (en top 10). 
          Siempre se otorga el puntaje más alto posible para ese piloto.
        </div>
      </section>

      <section style={styles.section}>
        <h3 style={styles.subTitle}>Puntaje Máximo</h3>
        <p>
          El puntaje máximo por carrera es de <strong>30 puntos</strong>. 
          Esto se logra acertando exactamente los pilotos y sus posiciones 
          en P1, P2 y P3 (10 + 10 + 10).
        </p>
      </section>

      <section style={styles.section}>
        <h3 style={styles.subTitle}>Ejemplos de Puntuación</h3>
        <p>Asumamos que el <strong>Top 10 Real</strong> fue: 
          1. VER, 2. HAM, 3. LEC, 4. NOR, 5. SAI, 
          6. ALO, 7. PER, 8. PIA, 9. RUS, 10. GAS
        </p>

        {/* Ejemplo 1: Perfecto */}
        <div style={styles.example}>
          <p>
            <strong>Tu Predicción:</strong> P1: <code style={styles.code}>VER</code>, P2: <code style={styles.code}>HAM</code>, P3: <code style={styles.code}>LEC</code>
          </p>
          <p>
            <strong>Cálculo:</strong> 10 (VER exacto) + 10 (HAM exacto) + 10 (LEC exacto) = <strong style={styles.emphasis}>30 Puntos</strong>
          </p>
        </div>

        {/* Ejemplo 2: Intercambiados */}
        <div style={styles.example}>
          <p>
            <strong>Tu Predicción:</strong> P1: <code style={styles.code}>HAM</code>, P2: <code style={styles.code}>VER</code>, P3: <code style={styles.code}>LEC</code>
          </p>
          <p>
            <strong>Cálculo:</strong> 5 (HAM en P2) + 5 (VER en P1) + 10 (LEC exacto) = <strong style={styles.emphasis}>20 Puntos</strong>
          </p>
        </div>

        {/* Ejemplo 3: Aciertos en Top 10 */}
        <div style={styles.example}>
          <p>
            <strong>Tu Predicción:</strong> P1: <code style={styles.code}>ALO</code>, P2: <code style={styles.code}>SAI</code>, P3: <code style={styles.code}>VER</code>
          </p>
          <p>
            <strong>Cálculo:</strong> 2 (ALO en P6) + 2 (SAI en P5) + 5 (VER en P1) = <strong style={styles.emphasis}>9 Puntos</strong>
          </p>
        </div>

        {/* Ejemplo 4: Mixto con un DNF */}
        <div style={styles.example}>
          <p>
            <strong>Tu Predicción:</strong> P1: <code style={styles.code}>VER</code>, P2: <code style={styles.code}>PER</code>, P3: <code style={styles.code}>STR</code> 
            (Asumiendo que STR abandonó y quedó P19)
          </p>
          <p>
            <strong>Cálculo:</strong> 10 (VER exacto) + 2 (PER en P7) + 0 (STR fuera de Top 10) = <strong style={styles.emphasis}>12 Puntos</strong>
          </p>
        </div>

      </section>
    </main>
  );
};

export default ScoringInfoPage;