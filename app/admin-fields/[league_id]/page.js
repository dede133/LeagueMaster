'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  getLeagueInfo,
  updateLeague,
  getTeamsByLeague,
  startLeague,
  getLeagueDetails,
  getLeagueLinks,
} from '@/lib/services/league';
import ConfigureLeague from '@/components/AdminFields/ConfigureLeague';
import TeamsManager from '@/components/AdminFields/TeamsManager';
import CalendarManager from '@/components/AdminFields/CalendarManager';

const LeagueConfiguration = () => {
  const { league_id } = useParams();
  const router = useRouter();
  const [league, setLeague] = useState(null);
  const [leagueDetails, setLeagueDetails] = useState(null);
  const [leagueLinks, setLeagueLinks] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loadingLeague, setLoadingLeague] = useState(true);
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [activeTab, setActiveTab] = useState('configuration');

  useEffect(() => {
    console.log('League ID:');
    const fetchLeague = async () => {
      try {
        const leagueData = await getLeagueInfo(league_id);
        setLeague(leagueData);

        const leagueDetails = await getLeagueDetails(league_id);
        setLeagueDetails(leagueDetails);
        console.log('League Details:', leagueDetails);

        const leagueLinks = await getLeagueLinks(league_id);
        console.log('League Links 2:', leagueLinks);
        setLeagueLinks(leagueLinks.links);
      } catch (error) {
        console.error(
          'Error al cargar la liga, detalles o links:',
          error.message
        );
      } finally {
        setLoadingLeague(false);
      }
    };

    fetchLeague();
  }, [league_id]);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoadingTeams(true);
        const teamsData = await getTeamsByLeague(league_id);
        setTeams(teamsData);
        console.log('Teams:', teamsData);
      } catch (error) {
        console.error('Error al obtener equipos:', error.message);
      } finally {
        setLoadingTeams(false);
      }
    };

    if (activeTab === 'teams') {
      fetchTeams();
    }
  }, [league_id, activeTab]);

  const handleStartLeague = async (leagueId) => {
    try {
      const result = await startLeague(leagueId);
      alert(result.message);
    } catch (error) {
      console.error('Error al iniciar la liga:', error.message);
      alert('Hubo un error al intentar iniciar la liga.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLeague((prev) => ({ ...prev, [name]: value }));
  };

  const handleGameTimesChange = (index, value) => {
    setLeague((prev) => {
      const updatedTimes = [...prev.game_times];
      updatedTimes[index] = value;
      return { ...prev, game_times: updatedTimes };
    });
  };

  const handleSaveChanges = async () => {
    try {
      await updateLeague(league_id, league);
      alert('Cambios guardados con éxito.');
    } catch (error) {
      console.error('Error al guardar los cambios:', error.message);
      alert('Error al guardar los cambios.');
    }
  };

  if (loadingLeague) {
    return <p>Cargando configuración de la liga...</p>;
  }

  if (!league) {
    return <p>La liga no se encontró o hubo un error.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md">
      <button
        onClick={() => router.back()}
        className="mb-4 text-sm font-medium text-blue-600 hover:text-blue-800"
      >
        ← Volver atrás
      </button>

      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold">Gestión de la Liga {league.name}</h1>
        <button
          onClick={() => {
            if (league.status !== 'pendiente') {
              alert('¿Estás seguro que quieres cancelar la liga?');
            } else {
              handleStartLeague(league_id);
            }
          }}
          className={`text-white text-sm px-4 py-2 rounded-md transition ${
            league.status === 'pendiente'
              ? 'bg-green-500 hover:bg-green-600'
              : 'bg-red-500 hover:bg-red-600'
          }`}
        >
          {league.status === 'pendiente' ? 'Empezar Liga' : 'Cancelar'}
        </button>
      </div>

      <p className="text-sm text-gray-500 italic">Estado {league.status}</p>

      {/* Tabs Navigation */}
      <div className="border-b border-gray-300 mb-6">
        <nav className="flex space-x-4">
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'configuration'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600'
            }`}
            onClick={() => setActiveTab('configuration')}
          >
            Configuración
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'teams'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600'
            }`}
            onClick={() => setActiveTab('teams')}
          >
            Equipos
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'calendar'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600'
            }`}
            onClick={() => setActiveTab('calendar')}
          >
            Calendario
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'standings'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600'
            }`}
            onClick={() => setActiveTab('standings')}
          >
            Clasificación
          </button>
        </nav>
      </div>

      {/* Configuración Tab */}
      {activeTab === 'configuration' && (
        <ConfigureLeague
          league={league}
          setLeague={setLeague}
          handleSaveChanges={handleSaveChanges}
          handleInputChange={handleInputChange}
          handleGameTimesChange={handleGameTimesChange}
        />
      )}

      {/* Equipos Tab */}
      {activeTab === 'teams' && <TeamsManager teams={teams} />}

      {/* Calendario Tab */}
      {activeTab === 'calendar' && (
        <CalendarManager
          matches={leagueDetails?.matches}
          leagueId={league_id}
          leagueLinks={leagueLinks}
        />
      )}

      {/* Clasificación Tab */}
      {activeTab === 'standings' && (
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
            Clasificación
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-blue-500 text-white text-left">
                  <th className="px-4 py-3 rounded-l-lg">Equipo</th>
                  <th className="px-4 py-3">J</th>
                  <th className="px-4 py-3">G</th>
                  <th className="px-4 py-3">E</th>
                  <th className="px-4 py-3">P</th>
                  <th className="px-4 py-3">GF</th>
                  <th className="px-4 py-3">GC</th>
                  <th className="px-4 py-3 rounded-r-lg">Pts</th>
                </tr>
              </thead>
              <tbody>
                {leagueDetails?.standings.map((standing, index) => (
                  <tr
                    key={standing.standing_id}
                    className={`text-gray-700 text-center ${
                      index % 2 === 0 ? 'bg-gray-100' : 'bg-white'
                    }`}
                  >
                    <td className="px-4 py-3 font-semibold text-left">
                      {standing.team_name}
                    </td>
                    <td className="px-4 py-3">{standing.played}</td>
                    <td className="px-4 py-3">{standing.won}</td>
                    <td className="px-4 py-3">{standing.drawn}</td>
                    <td className="px-4 py-3">{standing.lost}</td>
                    <td className="px-4 py-3">{standing.goals_for}</td>
                    <td className="px-4 py-3">{standing.goals_against}</td>
                    <td className="px-4 py-3 font-bold text-blue-600">
                      {standing.points}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeagueConfiguration;
