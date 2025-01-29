const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
export const updateMatchScore = async (matchId, scoreData) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/matches/${matchId}/update-score`,
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scoreData),
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
    return data;
  } catch (error) {
    console.error('Error al actualizar el marcador:', error.message);
    throw new Error('Error al actualizar el marcador.');
  }
};

export const getMatchesByLeagueAndDate = async (leagueId, date) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/matches/${leagueId}/matches?date=${date}`,
      {
        method: 'GET',
        credentials: 'include',
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
    return data.matches;
  } catch (error) {
    console.error('Error al obtener los partidos:', error.message);
    throw error;
  }
};
