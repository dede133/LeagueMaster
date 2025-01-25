'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { createTeamWithPlayers } from '@/lib/services/league'; // Importa la función para crear equipo

const JoinLeague = () => {
  const { league_id } = useParams();
  const router = useRouter();
  const [teamName, setTeamName] = useState('');
  const [players, setPlayers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAddPlayer = () => {
    setPlayers((prev) => [
      ...prev,
      { name: '', dni: '', dorsal: '', phone: '' },
    ]);
  };

  const handlePlayerChange = (index, field, value) => {
    const updatedPlayers = [...players];
    updatedPlayers[index][field] = value;
    setPlayers(updatedPlayers);
  };

  const handleRemovePlayer = (index) => {
    const updatedPlayers = players.filter((_, i) => i !== index);
    setPlayers(updatedPlayers);
  };

  const handleSubmit = async () => {
    if (!teamName || players.length === 0) {
      alert(
        'Debes completar el nombre del equipo y añadir al menos un jugador.'
      );
      return;
    }

    const teamData = {
      name: teamName,
      players: players,
    };

    try {
      const response = await createTeamWithPlayers(league_id, teamData);
      console.log('Equipo creado con éxito:', response);
      alert('¡Equipo creado y jugadores añadidos con éxito!');
      router.push(`/leagues/${league_id}`);
    } catch (error) {
      console.error('Error al crear el equipo:', error.message);
      alert('Hubo un error al crear el equipo.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Unirse a la Liga</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nombre del equipo
        </label>
        <input
          type="text"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          className="w-full px-4 py-2 border rounded shadow-sm focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Jugadores</h2>
        {players.map((player, index) => (
          <div key={index} className="flex items-center space-x-2 mb-2">
            <input
              type="text"
              placeholder="Nombre"
              value={player.name}
              onChange={(e) =>
                handlePlayerChange(index, 'name', e.target.value)
              }
              className="flex-1 px-2 py-1 border rounded"
            />
            <input
              type="text"
              placeholder="DNI"
              value={player.dni}
              onChange={(e) => handlePlayerChange(index, 'dni', e.target.value)}
              className="flex-1 px-2 py-1 border rounded"
            />
            <input
              type="text"
              placeholder="Dorsal"
              value={player.dorsal}
              onChange={(e) =>
                handlePlayerChange(index, 'dorsal', e.target.value)
              }
              className="w-16 px-2 py-1 border rounded"
            />
            <input
              type="text"
              placeholder="Teléfono"
              value={player.phone}
              onChange={(e) =>
                handlePlayerChange(index, 'phone', e.target.value)
              }
              className="flex-1 px-2 py-1 border rounded"
            />
            <Button
              onClick={() => handleRemovePlayer(index)}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              X
            </Button>
          </div>
        ))}
        <Button
          onClick={handleAddPlayer}
          className="bg-gray-300 text-black px-4 py-1 mt-4"
        >
          Añadir Jugador
        </Button>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={loading}
        className={`w-full ${
          loading ? 'bg-gray-400' : 'bg-green-500'
        } text-white py-2`}
      >
        {loading ? 'Enviando...' : 'Enviar equipo'}
      </Button>
    </div>
  );
};

export default JoinLeague;
