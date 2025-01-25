'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  getMatchesByLeagueAndDate,
  updateMatchScore,
} from '@/lib/services/match';

const generateMockPlayers = () => {
  return Array.from({ length: 7 }, (_, index) => ({
    id: `player-${index + 1}`,
    dorsal: index + 1,
    goals: 0,
    yellowCards: 0,
    redCards: 0,
  }));
};

const MatchStatsPage = () => {
  const params = useParams();
  const { league_id, date, uuid } = params;
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [homePlayers, setHomePlayers] = useState([]);
  const [awayPlayers, setAwayPlayers] = useState([]);
  const [homeTeamName, setHomeTeamName] = useState('Equipo Local');
  const [awayTeamName, setAwayTeamName] = useState('Equipo Visitante');

  useEffect(() => {
    if (!league_id || !date || !uuid) {
      setError('Los parámetros necesarios no están definidos en la URL.');
      setLoading(false);
      return;
    }

    const fetchMatches = async () => {
      try {
        setLoading(true);
        const matchesData = await getMatchesByLeagueAndDate(league_id, date);
        setMatches(matchesData);

        if (matchesData.length > 0) {
          const firstMatch = matchesData[0];
          setSelectedMatch(firstMatch.match_id);
          setHomeScore(firstMatch.home_team_score || 0);
          setAwayScore(firstMatch.away_team_score || 0);
          setHomeTeamName(firstMatch.home_team_name);
          setAwayTeamName(firstMatch.away_team_name);
          setHomePlayers(generateMockPlayers());
          setAwayPlayers(generateMockPlayers());
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

  const togglePlayerStat = (playerId, team, stat) => {
    const toggleStat = (players) =>
      players.map((player) =>
        player.id === playerId
          ? { ...player, [stat]: player[stat] === 0 ? 1 : 0 }
          : player
      );

    if (team === 'home') {
      setHomePlayers((prev) => toggleStat(prev));
    } else if (team === 'away') {
      setAwayPlayers((prev) => toggleStat(prev));
    }
  };

  const updatePlayerStats = (playerId, team, stat) => {
    const updateStat = (players) =>
      players.map((player) =>
        player.id === playerId
          ? { ...player, [stat]: player[stat] + 1 }
          : player
      );

    if (stat === 'goals') {
      if (team === 'home') {
        setHomePlayers((prev) => updateStat(prev));
        setHomeScore((prev) => prev + 1);
      } else if (team === 'away') {
        setAwayPlayers((prev) => updateStat(prev));
        setAwayScore((prev) => prev + 1);
      }
    } else {
      if (team === 'home') {
        setHomePlayers((prev) => updateStat(prev));
      } else if (team === 'away') {
        setAwayPlayers((prev) => updateStat(prev));
      }
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
      <h1 className="text-3xl font-bold text-center mb-6">
        Estadísticas del Partido
      </h1>
      <p className="text-center text-gray-500 mb-4">Fecha: {date}</p>

      {matches.length > 0 ? (
        <div>
          <div className="mb-6 text-center">
            <p className="text-lg font-bold mb-4">
              {homeTeamName} {homeScore} - {awayScore} {awayTeamName}
            </p>
            <div className="flex justify-between items-center gap-8">
              <div className="flex flex-row items-center space-x-4">
                <button
                  onClick={() => incrementScore('home')}
                  className="bg-blue-500 text-white px-4 py-2 rounded-full shadow hover:bg-blue-600 transition duration-300"
                >
                  +1
                </button>
                <button
                  onClick={() => decrementScore('home')}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-full shadow hover:bg-gray-400 transition duration-300"
                >
                  -1
                </button>
              </div>

              <div className="flex flex-row items-center space-x-4">
                <button
                  onClick={() => incrementScore('away')}
                  className="bg-blue-500 text-white px-4 py-2 rounded-full shadow hover:bg-blue-600 transition duration-300"
                >
                  +1
                </button>
                <button
                  onClick={() => decrementScore('away')}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-full shadow hover:bg-gray-400 transition duration-300"
                >
                  -1
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-8">
            <div className="w-1/2">
              <h3 className="text-lg font-bold mb-4 text-center">
                {homeTeamName}
              </h3>
              <div className="flex flex-col gap-2">
                {homePlayers.map((player) => (
                  <div
                    key={player.id}
                    className="p-2 border rounded shadow flex justify-between items-center"
                  >
                    <p className="font-bold">Dorsal {player.dorsal}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          updatePlayerStats(player.id, 'home', 'goals')
                        }
                        className="bg-green-500 text-white text-xs px-2 py-1 rounded"
                      >
                        Gol
                      </button>
                      <button
                        onClick={() =>
                          togglePlayerStat(player.id, 'home', 'yellowCards')
                        }
                        className={`text-xs px-2 py-1 rounded transition ${
                          player.yellowCards > 0
                            ? 'bg-yellow-500 text-white'
                            : 'bg-gray-300 text-gray-700'
                        }`}
                      >
                        Amarilla
                      </button>
                      <button
                        onClick={() =>
                          togglePlayerStat(player.id, 'home', 'redCards')
                        }
                        className={`text-xs px-2 py-1 rounded transition ${
                          player.redCards > 0
                            ? 'bg-red-500 text-white'
                            : 'bg-gray-300 text-gray-700'
                        }`}
                      >
                        Roja
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-1/2">
              <h3 className="text-lg font-bold mb-4 text-center">
                {awayTeamName}
              </h3>
              <div className="flex flex-col gap-2">
                {awayPlayers.map((player) => (
                  <div
                    key={player.id}
                    className="p-2 border rounded shadow flex justify-between items-center"
                  >
                    <p className="font-bold">Dorsal {player.dorsal}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          updatePlayerStats(player.id, 'away', 'goals')
                        }
                        className="bg-green-500 text-white text-xs px-2 py-1 rounded"
                      >
                        Gol
                      </button>
                      <button
                        onClick={() =>
                          togglePlayerStat(player.id, 'away', 'yellowCards')
                        }
                        className={`text-xs px-2 py-1 rounded transition ${
                          player.yellowCards > 0
                            ? 'bg-yellow-500 text-white'
                            : 'bg-gray-300 text-gray-700'
                        }`}
                      >
                        Amarilla
                      </button>
                      <button
                        onClick={() =>
                          togglePlayerStat(player.id, 'away', 'redCards')
                        }
                        className={`text-xs px-2 py-1 rounded transition ${
                          player.redCards > 0
                            ? 'bg-red-500 text-white'
                            : 'bg-gray-300 text-gray-700'
                        }`}
                      >
                        Roja
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <button
              onClick={handleUpdateScore}
              className="bg-green-500 text-white px-4 py-2 rounded-md shadow hover:bg-green-600 transition duration-300"
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
