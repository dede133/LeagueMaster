'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { getOwnerLeagues, createLeague } from '@/lib/services/league';
import Link from 'next/link';

const daysOfWeek = [
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
  'Domingo',
];

const formatDate = (isoDate) => {
  const date = new Date(isoDate);
  return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1)
    .toString()
    .padStart(2, '0')}/${date.getFullYear()}`;
};

const FieldLeaguesManager = ({ fieldId }) => {
  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newLeague, setNewLeague] = useState({
    name: '',
    start_date: '',
    end_date: '',
    game_days: '',
    game_times: ['', ''],
  });

  useEffect(() => {
    const fetchLeagues = async () => {
      if (!fieldId) return;
      setLoading(true);
      try {
        const userLeagues = await getOwnerLeagues();
        setLeagues(userLeagues.filter((league) => league.field_id === fieldId));
      } catch (error) {
        console.error('Error al cargar las ligas:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLeagues();
  }, [fieldId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewLeague((prev) => ({ ...prev, [name]: value }));
  };

  const handleGameTimesChange = (index, value) => {
    setNewLeague((prev) => {
      const updatedTimes = [...prev.game_times];
      updatedTimes[index] = value;
      return { ...prev, game_times: updatedTimes };
    });
  };

  const handleCreateLeague = async () => {
    try {
      await createLeague({ ...newLeague, field_id: fieldId });
      setNewLeague({
        name: '',
        start_date: '',
        end_date: '',
        game_days: '',
        game_times: ['', ''],
      });
      setShowCreateForm(false);
      setLeagues((prev) => [...prev, newLeague]);
    } catch (error) {
      console.error('Error al crear la liga:', error.message);
    }
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-lg">
      <h2 className="text-lg font-bold mb-4 text-center text-gray-800">
        Gestionar ligas
      </h2>
      <Button
        onClick={() => setShowCreateForm((prev) => !prev)}
        className="mb-4 bg-blue-600 hover:bg-blue-700 text-white transition-all"
      >
        {showCreateForm ? 'Cancelar' : 'Crear Liga'}
      </Button>

      {showCreateForm && (
        <div className="p-6 bg-white shadow-lg rounded-lg mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
            Crear nueva liga
          </h3>
          <div className="space-y-4">
            <input
              type="text"
              name="name"
              value={newLeague.name}
              onChange={handleInputChange}
              placeholder="Nombre de la liga"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="date"
                name="start_date"
                value={newLeague.start_date}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="date"
                name="end_date"
                value={newLeague.end_date}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <select
              name="game_days"
              value={newLeague.game_days}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="" disabled>
                Selecciona un día
              </option>
              {daysOfWeek.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Horarios de juego
              </label>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="time"
                  value={newLeague.game_times[0]}
                  onChange={(e) => handleGameTimesChange(0, e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Desde"
                />
                <input
                  type="time"
                  value={newLeague.game_times[1]}
                  onChange={(e) => handleGameTimesChange(1, e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Hasta"
                />
              </div>
            </div>
          </div>
          <Button
            onClick={handleCreateLeague}
            className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white transition-all"
          >
            Guardar liga
          </Button>
        </div>
      )}

      {loading ? (
        <p className="text-center text-gray-500">Cargando ligas...</p>
      ) : leagues.length > 0 ? (
        <ul className="space-y-4">
          {leagues.map((league) => (
            <Link
              href={`/admin-fields/${league.league_id}`}
              key={league.league_id}
            >
              <li className="p-4 bg-white shadow-md rounded-lg transition-all transform hover:scale-105 hover:shadow-lg">
                <h3 className="text-md font-bold text-gray-800">
                  {league.name}
                </h3>
                <p className="text-sm text-gray-600">Estado: {league.status}</p>
                <p className="text-sm text-gray-600">
                  Fechas: {formatDate(league.start_date)} -{' '}
                  {formatDate(league.end_date)}
                </p>
              </li>
            </Link>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500">
          No hay ligas creadas para este campo.
        </p>
      )}
    </div>
  );
};

export default FieldLeaguesManager;
