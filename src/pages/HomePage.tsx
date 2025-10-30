// src/pages/HomePage.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Leaderboard from '../components/Leaderboard';

const HomePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <main>
      <h2>¡Hola {user?.username}!</h2>
      
      <Leaderboard />
    </main>
  );
};

export default HomePage;