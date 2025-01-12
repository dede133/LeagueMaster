'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { getUserLeagues } from '../lib/services/league'; // Asegúrate de importar correctamente
import { useAuth } from '../context/AuthContext'; // Importa el AuthContext para acceder al estado de autenticación

const LeagueContext = createContext();

export const LeagueProvider = ({ children }) => {
  const { isAuthenticated } = useAuth(); // Obtén el estado de autenticación del AuthContext
  const [leagues, setLeagues] = useState([]); // Lista de ligas asociadas al usuario
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null); // Estado de error (opcional)

  const fetchLeagues = async () => {
    try {
      if (!isAuthenticated) {
        setLeagues([]); // Si no está autenticado, limpia las ligas
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null); // Reinicia el error antes de hacer la petición
      const data = await getUserLeagues(); // Llama a la función para obtener ligas
      setLeagues(data); // Actualiza el estado con las ligas obtenidas
    } catch (error) {
      console.error('Error al obtener ligas:', error.message);
      setError(error.message); // Guarda el mensaje de error (opcional)
    } finally {
      setLoading(false); // Finaliza el estado de carga
    }
  };

  // Ejecuta la petición al cambiar el estado de autenticación
  useEffect(() => {
    fetchLeagues();
  }, [isAuthenticated]); // Se ejecuta cada vez que cambia `isAuthenticated`

  return (
    <LeagueContext.Provider value={{ leagues, loading, error, fetchLeagues }}>
      {children}
    </LeagueContext.Provider>
  );
};

export const useLeagues = () => useContext(LeagueContext);
