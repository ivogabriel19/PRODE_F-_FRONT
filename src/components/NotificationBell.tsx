// src/components/NotificationBell.tsx
import React, { useState, useEffect, useRef } from 'react';
import api from '../api/api';
import type { Notification } from '../types';

// --- Estilos en línea ---
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    position: 'relative',
    display: 'inline-block',
  },
  bellButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '24px', // Tamaño del emoji (o ícono)
    padding: '0 5px',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: '-5px',
    right: '-5px',
    background: 'red',
    color: 'white',
    borderRadius: '50%',
    padding: '1px 5px',
    fontSize: '0.75rem',
    fontWeight: 'bold',
    minWidth: '10px',
    textAlign: 'center',
  },
  dropdown: {
    position: 'absolute',
    right: 0,
    top: '120%', // Debajo del botón
    width: '320px',
    maxHeight: '400px',
    overflowY: 'auto',
    background: 'white',
    border: '1px solid #ccc',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    zIndex: 1000,
  },
  notificationItem: {
    padding: '12px 15px',
    borderBottom: '1px solid #eee',
    cursor: 'pointer',
  },
  notificationUnread: {
    backgroundColor: '#f9f9f9',
    fontWeight: 'bold',
  },
  message: {
    margin: 0,
    fontSize: '0.9rem',
    color: '#333',
  },
  date: {
    margin: '4px 0 0',
    fontSize: '0.75rem',
    color: 'gray',
  },
  noNotifications: {
    padding: '20px',
    textAlign: 'center',
    color: '#888',
  },
};

// --- El Componente ---
const NotificationBell: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const wrapperRef = useRef<HTMLDivElement>(null);

  // Hook para cargar notificaciones (al montar)
  useEffect(() => {
    fetchNotifications();
  }, []);

  // Hook para cerrar el dropdown si se hace clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    // Bind
    document.addEventListener("mousedown", handleClickOutside);
    // Unbind
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      // Usamos la ruta que definiste en userRoutes.js
      const res = await api.get('/user/notificaciones'); 
      setNotifications(res.data);
    } catch (err) {
      setError("No se pudieron cargar las notificaciones.");
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    // Si ya está leída, no hagas nada (o futura lógica de link)
    if (notification.read) {
      // Opcional: setIsOpen(false);
      return;
    }

    // 1. Marcar como leída en el frontend (Optimistic UI)
    setNotifications(prev =>
      prev.map(n =>
        n._id === notification._id ? { ...n, read: true } : n
      )
    );

    // 2. Marcar como leída en el backend
    try {
      // Usamos la ruta PUT con /leida (de userRoutes.js)
      await api.put(`/user/notificaciones/${notification._id}/leida`);
    } catch (err) {
      console.error("Error al marcar como leída:", err);
      // Revertir si falla (opcional, pero buena práctica)
      setNotifications(prev =>
        prev.map(n =>
          n._id === notification._id ? { ...n, read: false } : n
        )
      );
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div style={styles.container} ref={wrapperRef}>
      
      {/* 1. El Botón de la Campana */}
      <button 
        style={styles.bellButton} 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notificaciones"
      >
        <span>🔔</span>
        {unreadCount > 0 && (
          <span style={styles.badge}>{unreadCount}</span>
        )}
      </button>

      {/* 2. El Dropdown */}
      {isOpen && (
        <div style={styles.dropdown}>
          {loading && <div style={styles.noNotifications}>Cargando...</div>}
          {error && <div style={styles.noNotifications}>{error}</div>}
          
          {!loading && !error && notifications.length === 0 && (
            <div style={styles.noNotifications}>No tienes notificaciones.</div>
          )}

          {!loading && !error && notifications.length > 0 && (
            <div>
              {notifications.map(n => (
                <div
                  key={n._id}
                  style={{
                    ...styles.notificationItem,
                    ...(n.read ? {} : styles.notificationUnread),
                  }}
                  onClick={() => handleNotificationClick(n)}
                >
                  <p style={styles.message}>{n.message}</p>
                  <p style={styles.date}>
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;