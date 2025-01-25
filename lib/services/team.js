export const updateTeamStatus = async (teamId, statusData) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/teams/team/${teamId}/status`,
      {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(statusData),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || 'Error al actualizar el estado del equipo.'
      );
    }

    return await response.json();
  } catch (error) {
    console.error('Error al actualizar estado del equipo:', error.message);
    throw error;
  }
};

export const addPlayer = async (teamId, playerData) => {
  try {
    const response = await fetch(`/api/teams/${teamId}/players`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(playerData),
    });

    if (!response.ok) throw new Error('Error al añadir jugador.');

    return await response.json();
  } catch (error) {
    console.error(error);
    throw new Error('Error al añadir jugador.');
  }
};
