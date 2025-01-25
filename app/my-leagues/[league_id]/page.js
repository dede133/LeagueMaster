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
  const [activeTab, setActiveTab] = useState('standings');
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
        console.log(leagueDetails);
        setLeague(leagueDetails.league);
        setTeams(leagueDetails.teams);
        setMatches(leagueDetails.matches);
        setStandings(leagueDetails.standings || []);
      } catch (err) {
        setError('Error al obtener los detalles de la liga.');
      } finally {
        setLoading(false);
      }
    };

    fetchLeagueDetails();
  }, [league_id]);

  if (loading) return <div className="text-center mt-10">Cargando...</div>;
  if (error)
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  if (!league)
    return <div className="text-center mt-10">Liga no encontrada.</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-gray-50 rounded-lg shadow-lg">
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h1 className="text-3xl font-bold mb-2">{league.name}</h1>
        <p className="text-gray-600">
          <strong>Campo:</strong> {league.field_id || 'No especificado'}
        </p>
        <p className="text-gray-600">
          <strong>Estado:</strong> {league.status || 'Desconocido'}
        </p>
        <p className="text-gray-600">
          <strong>Fechas:</strong>{' '}
          {league.start_date && league.end_date
            ? `${new Date(league.start_date).toLocaleDateString()} - ${new Date(
                league.end_date
              ).toLocaleDateString()}`
            : 'No especificadas'}
        </p>
        <p className="text-gray-600">
          <strong>Días de partido:</strong>{' '}
          {league.game_days || 'No especificados'}
        </p>
      </div>

      {league.status !== 'pendiente' && (
        <>
          <div className="flex justify-center border-b border-gray-200 mb-6">
            {['standings', 'teams', 'matches'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 ${
                  activeTab === tab
                    ? 'text-blue-600 border-b-2 border-blue-600 font-bold'
                    : 'text-gray-500 hover:text-blue-600'
                }`}
              >
                {tab === 'standings' && 'Clasificación'}
                {tab === 'teams' && 'Equipos'}
                {tab === 'matches' && 'Partidos'}
              </button>
            ))}
          </div>

          {activeTab === 'standings' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Clasificación</h2>
              {standings.length > 0 ? (
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-100">
                    <tr>
                      {[
                        'Posición',
                        'Equipo',
                        'Jugados',
                        'Ganados',
                        'Empatados',
                        'Perdidos',
                        'Puntos',
                      ].map((header) => (
                        <th key={header} className="px-4 py-2 border-b">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {standings.map((standing, index) => (
                      <tr
                        key={standing.standing_id}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-4 py-2 border-b">{index + 1}</td>
                        <td className="px-4 py-2 border-b">
                          {standing.team_name}
                        </td>
                        <td className="px-4 py-2 border-b">
                          {standing.played}
                        </td>
                        <td className="px-4 py-2 border-b">{standing.won}</td>
                        <td className="px-4 py-2 border-b">{standing.drawn}</td>
                        <td className="px-4 py-2 border-b">{standing.lost}</td>
                        <td className="px-4 py-2 border-b">
                          {standing.points}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No hay clasificación disponible.</p>
              )}
            </div>
          )}

          {activeTab === 'teams' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Equipos Participantes</h2>
              {teams.length > 0 ? (
                <ul className="list-disc list-inside">
                  {teams.map((team) => (
                    <li key={team.team_id}>
                      {team.name || 'Equipo sin nombre'}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No hay equipos en esta liga.</p>
              )}
            </div>
          )}

          {activeTab === 'matches' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Partidos Programados</h2>
              {matches.length > 0 ? (
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-100">
                    <tr>
                      {[
                        'Fecha',
                        'Hora',
                        'Equipo Local',
                        'Equipo Visitante',
                        'Estado',
                      ].map((header) => (
                        <th key={header} className="px-4 py-2 border-b">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {matches.map((match) => (
                      <tr key={match.match_id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 border-b">
                          {match.date || 'No disponible'}
                        </td>
                        <td className="px-4 py-2 border-b">
                          {match.time || 'No disponible'}
                        </td>
                        <td className="px-4 py-2 border-b">
                          {match.home_team_name || 'No disponible'}
                        </td>
                        <td className="px-4 py-2 border-b">
                          {match.away_team_name || 'No disponible'}
                        </td>
                        <td className="px-4 py-2 border-b">
                          {match.status || 'No disponible'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No hay partidos programados.</p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LeagueDetailsPage;
