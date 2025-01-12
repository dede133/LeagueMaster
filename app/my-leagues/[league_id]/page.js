'use client';

import React, { useEffect, useState } from 'react';
import { getLeagueDetails } from '@/lib/services/league';
import { useParams } from 'next/navigation';

const LeagueDetailsPage = () => {
  const { league_id } = useParams();
  const [league, setLeague] = useState(null);
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);
  const [standings, setStandings] = useState([]);
  const [activeTab, setActiveTab] = useState('standings'); // Tab activa (por defecto "standings")
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeagueDetails = async () => {
      if (!league_id) {
        setError('ID de liga no proporcionado.');
        setLoading(false);
        return;
      }

      try {
        const leagueDetails = await getLeagueDetails(league_id);
        console.log('League Details:', leagueDetails);

        // Actualiza los estados con los datos recibidos
        setLeague(leagueDetails.league);
        setTeams(leagueDetails.teams);
        setMatches(leagueDetails.matches);
        setStandings(leagueDetails.standings || []);
      } catch (error) {
        console.error('Error al obtener los detalles de la liga:', error);
        setError('Error al obtener los detalles de la liga.');
      } finally {
        setLoading(false); // Indica que la carga ha terminado
      }
    };

    fetchLeagueDetails();
  }, [league_id]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!league) {
    return <div>No se encontraron detalles para esta liga.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded shadow">
      {/* Información general de la liga */}
      <h2 className="text-2xl font-bold mb-4">{league.name}</h2>
      <p className="mb-4">
        <strong>Campo:</strong> {league.field_id || 'No especificado'}
      </p>
      <p className="mb-4">
        <strong>Estado:</strong> {league.status || 'Desconocido'}
      </p>
      <p className="mb-4">
        <strong>Fechas:</strong>{' '}
        {league.start_date && league.end_date
          ? `${new Date(league.start_date).toLocaleDateString()} - ${new Date(
              league.end_date
            ).toLocaleDateString()}`
          : 'No especificadas'}
      </p>
      <p className="mb-8">
        <strong>Días de partido:</strong>{' '}
        {league.game_days || 'No especificados'}
      </p>

      {/* Mostrar Tabs solo si la liga no está en estado "pendiente" */}
      {league.status !== 'pendiente' && (
        <>
          <div className="border-b border-gray-200 mb-6">
            <ul className="flex">
              <li
                className={`mr-4 pb-2 ${
                  activeTab === 'standings'
                    ? 'text-blue-500 border-b-2 border-blue-500'
                    : 'text-gray-500'
                } cursor-pointer`}
                onClick={() => setActiveTab('standings')}
              >
                Clasificación
              </li>
              <li
                className={`mr-4 pb-2 ${
                  activeTab === 'teams'
                    ? 'text-blue-500 border-b-2 border-blue-500'
                    : 'text-gray-500'
                } cursor-pointer`}
                onClick={() => setActiveTab('teams')}
              >
                Equipos
              </li>
              <li
                className={`pb-2 ${
                  activeTab === 'matches'
                    ? 'text-blue-500 border-b-2 border-blue-500'
                    : 'text-gray-500'
                } cursor-pointer`}
                onClick={() => setActiveTab('matches')}
              >
                Partidos
              </li>
            </ul>
          </div>

          {/* Contenido de las pestañas */}
          {activeTab === 'standings' && (
            <div>
              <h3 className="text-xl font-bold mb-4">Clasificación</h3>
              <table className="min-w-full bg-white border border-gray-300">
                <thead>
                  <tr>
                    <th className="border border-gray-300 px-4 py-2">
                      Posición
                    </th>
                    <th className="border border-gray-300 px-4 py-2">Equipo</th>
                    <th className="border border-gray-300 px-4 py-2">
                      Jugados
                    </th>
                    <th className="border border-gray-300 px-4 py-2">
                      Ganados
                    </th>
                    <th className="border border-gray-300 px-4 py-2">
                      Empatados
                    </th>
                    <th className="border border-gray-300 px-4 py-2">
                      Perdidos
                    </th>
                    <th className="border border-gray-300 px-4 py-2">Puntos</th>
                  </tr>
                </thead>
                <tbody>
                  {standings.map((standing, index) => (
                    <tr key={standing.standing_id}>
                      <td className="border border-gray-300 px-4 py-2">
                        {index + 1}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {standing.team_name}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {standing.played}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {standing.won}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {standing.drawn}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {standing.lost}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {standing.points}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'teams' && (
            <div>
              <h3 className="text-xl font-bold mb-4">Equipos Participantes</h3>
              <ul className="mb-8 list-disc list-inside">
                {teams.length > 0 ? (
                  teams.map((team) => (
                    <li key={team.team_id}>
                      {team.name || 'Equipo sin nombre'}
                    </li>
                  ))
                ) : (
                  <p>No hay equipos en esta liga.</p>
                )}
              </ul>
            </div>
          )}

          {activeTab === 'matches' && (
            <div>
              <h3 className="text-xl font-bold mb-4">Partidos Programados</h3>
              <table className="min-w-full bg-white border border-gray-300">
                <thead>
                  <tr>
                    <th className="border border-gray-300 px-4 py-2">Fecha</th>
                    <th className="border border-gray-300 px-4 py-2">Hora</th>
                    <th className="border border-gray-300 px-4 py-2">
                      Equipo Local
                    </th>
                    <th className="border border-gray-300 px-4 py-2">
                      Equipo Visitante
                    </th>
                    <th className="border border-gray-300 px-4 py-2">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {matches.length > 0 ? (
                    matches.map((match) => (
                      <tr key={match.match_id}>
                        <td className="border border-gray-300 px-4 py-2">
                          {match.date
                            ? new Date(match.date).toLocaleDateString()
                            : 'Fecha no disponible'}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {match.time || 'Hora no disponible'}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {match.home_team_name || 'Equipo no disponible'}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {match.away_team_name || 'Equipo no disponible'}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {match.status || 'Estado no disponible'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        className="border border-gray-300 px-4 py-2"
                        colSpan="5"
                      >
                        No hay partidos programados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LeagueDetailsPage;
