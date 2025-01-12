'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  getMatchesByLeagueAndDate,
  updateMatchScore,
} from '@/lib/services/match';

const MatchStatsPage = () => {
  const params = useParams(); // Obtener league_id, date y uuid de la URL
  const { league_id, date, uuid } = params; // Asegúrate de que league_id, date, y uuid están definidos
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!league_id || !date || !uuid) {
      setError(
        'Los parámetros league_id, date o uuid no están definidos en la URL.'
      );
      setLoading(false);
      return;
    }

    const fetchMatches = async () => {
      try {
        setLoading(true);
        const matchesData = await getMatchesByLeagueAndDate(league_id, date);
        setMatches(matchesData);

        if (matchesData.length > 0) {
          setSelectedMatch(matchesData[0].match_id);
          setHomeScore(matchesData[0].home_team_score || 0);
          setAwayScore(matchesData[0].away_team_score || 0);
        }
      } catch (err) {
        console.error('Error al obtener los partidos:', err.message);
        setError('No se pudieron obtener los partidos.');
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [league_id, date, uuid]);

  const handleUpdateScore = async () => {
    try {
      await updateMatchScore(selectedMatch, {
        home_team_score: homeScore,
        away_team_score: awayScore,
      });
      alert('Marcador actualizado correctamente.');
    } catch (err) {
      console.error('Error al actualizar el marcador:', err.message);
      alert('Hubo un error al actualizar el marcador.');
    }
  };

  const incrementScore = (team) => {
    if (team === 'home') setHomeScore((prev) => prev + 1);
    else if (team === 'away') setAwayScore((prev) => prev + 1);
  };

  const decrementScore = (team) => {
    if (team === 'home' && homeScore > 0) setHomeScore((prev) => prev - 1);
    else if (team === 'away' && awayScore > 0) setAwayScore((prev) => prev - 1);
  };

  if (loading) return <p>Cargando partidos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-4">Estadísticas del Partido</h1>
      <p className="mb-4">League ID: {league_id}</p>
      <p className="mb-4">Fecha: {date}</p>
      <p className="mb-8">UUID: {uuid}</p>

      {matches.length > 0 ? (
        <div>
          <label
            htmlFor="match"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Selecciona un partido
          </label>
          <select
            id="match"
            value={selectedMatch}
            onChange={(e) => {
              const matchId = e.target.value;
              setSelectedMatch(matchId);

              const match = matches.find(
                (m) => m.match_id === parseInt(matchId, 10)
              );
              setHomeScore(match?.home_team_score || 0);
              setAwayScore(match?.away_team_score || 0);
            }}
            className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500"
          >
            {matches.map((match) => (
              <option key={match.match_id} value={match.match_id}>
                {match.home_team_name} vs. {match.away_team_name}
              </option>
            ))}
          </select>

          <div className="mt-6">
            <h2 className="text-lg font-bold mb-4">Actualizar Marcador</h2>
            <div className="flex items-center justify-around">
              <div className="text-center">
                <h3 className="text-sm font-medium">
                  {matches.find((m) => m.match_id === parseInt(selectedMatch))
                    ?.home_team_name || 'Equipo Local'}
                </h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => decrementScore('home')}
                    className="bg-gray-300 px-2 py-1 rounded hover:bg-gray-400"
                  >
                    -1
                  </button>
                  <p className="text-lg font-bold">{homeScore}</p>
                  <button
                    onClick={() => incrementScore('home')}
                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                  >
                    +1
                  </button>
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-sm font-medium">
                  {matches.find((m) => m.match_id === parseInt(selectedMatch))
                    ?.away_team_name || 'Equipo Visitante'}
                </h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => decrementScore('away')}
                    className="bg-gray-300 px-2 py-1 rounded hover:bg-gray-400"
                  >
                    -1
                  </button>
                  <p className="text-lg font-bold">{awayScore}</p>
                  <button
                    onClick={() => incrementScore('away')}
                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                  >
                    +1
                  </button>
                </div>
              </div>
            </div>
            <button
              onClick={handleUpdateScore}
              className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
            >
              Guardar Marcador
            </button>
          </div>
        </div>
      ) : (
        <p>No hay partidos programados para esta fecha.</p>
      )}
    </div>
  );
};

export default MatchStatsPage;
