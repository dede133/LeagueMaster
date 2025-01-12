export const updateMatchScore = async (matchId, scoreData) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/matches/${matchId}/update-score`,
      {
        method: 'POST',
        credentials: 'include', // Asegura que las cookies de la sesión se envíen con la solicitud
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scoreData), // Enviar los datos del marcador en el cuerpo de la solicitud
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || 'Error al actualizar el marcador del partido.'
      );
    }

    const data = await response.json();
    console.log('Marcador actualizado:', data);
    return data; // Devuelve la respuesta del backend
  } catch (error) {
    console.error('Error al actualizar el marcador:', error.message);
    throw new Error('Error al actualizar el marcador.');
  }
};

export const getMatchesByLeagueAndDate = async (leagueId, date) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/matches/${leagueId}/matches?date=${date}`,
      {
        method: 'GET',
        credentials: 'include', // Envía las cookies de la sesión
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || 'Error al obtener los partidos de la liga.'
      );
    }

    const data = await response.json();
    console.log('Partidos obtenidos:', data);
    return data.matches; // Devuelve los partidos
  } catch (error) {
    console.error('Error al obtener los partidos:', error.message);
    throw error;
  }
};
