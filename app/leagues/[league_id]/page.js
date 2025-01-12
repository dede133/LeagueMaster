'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getLeagueInfo } from '@/lib/services/league';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext'; // Importa el contexto de autenticación

const LeagueDetails = () => {
  const { league_id } = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth(); // Obtén el estado de autenticación
  const [league, setLeague] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeague = async () => {
      try {
        const leagueData = await getLeagueInfo(league_id);
        console.log('League data:', leagueData);
        setLeague(leagueData);
      } catch (error) {
        console.error('Error al cargar la liga:', error.message);
        setError('No se pudo cargar la información de la liga.');
      } finally {
        setLoading(false);
      }
    };

    fetchLeague();
  }, [league_id]);

  const handleJoinLeague = () => {
    if (!isAuthenticated) {
      router.push('/login-required'); // Redirige a una página de aviso si no está autenticado
    } else {
      router.push(`/leagues/${league_id}/join`);
    }
  };

  if (loading) {
    return <p>Cargando detalles de la liga...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!league) {
    return <p>La liga no se encontró o hubo un error.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg shadow-md">
      <div className="mb-6">
        <img
          src={`http://localhost:5000/${league.photo_url}`}
          alt={league.name}
          className="w-full h-64 object-cover rounded-lg"
        />
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-4">{league.name}</h1>

      <div className="space-y-4">
        <p className="text-gray-700">
          <strong>Descripción:</strong>{' '}
          {league.description || 'Sin descripción disponible'}
        </p>

        <p className="text-gray-700">
          <strong>Fechas:</strong> {league.start_date} - {league.end_date}
        </p>

        <p className="text-gray-700">
          <strong>Día de juego:</strong> {league.game_days}
        </p>

        <p className="text-gray-700">
          <strong>Horario de juego:</strong>{' '}
          {league.game_times?.join(' - ') || 'No definido'}
        </p>

        <p className="text-gray-700">
          <strong>Campo asociado:</strong>{' '}
          {league.field_name || 'No especificado'}
        </p>
      </div>

      <Button
        onClick={handleJoinLeague}
        className="mt-6 bg-blue-600 text-white font-semibold py-2 px-4 rounded"
      >
        Unirse a esta liga
      </Button>
    </div>
  );
};

export default LeagueDetails;
