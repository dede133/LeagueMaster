'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { getUserLeagues } from '../lib/services/league';
import { useAuth } from '../context/AuthContext';

const LeagueContext = createContext();

export const LeagueProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLeagues = async () => {
    try {
      if (!isAuthenticated) {
        setLeagues([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      const data = await getUserLeagues();
      setLeagues(data);
    } catch (error) {
      console.error('Error al obtener ligas:', error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeagues();
  }, [isAuthenticated]);

  return (
    <LeagueContext.Provider value={{ leagues, loading, error, fetchLeagues }}>
      {children}
    </LeagueContext.Provider>
  );
};

export const useLeagues = () => useContext(LeagueContext);
