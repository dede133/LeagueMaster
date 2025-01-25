export const getLeaguesByField = async (fieldId) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/leagues?field_id=${fieldId}`,
      {
        method: 'GET',
        credentials: 'include',
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al obtener las ligas.');
    }

    const data = await response.json();
    return data.leagues || [];
  } catch (error) {
    console.error('Error al obtener las ligas:', error.message);
    throw new Error('Error al obtener las ligas.');
  }
};

export const getLeaguesByUserAndField = async (fieldId) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/leagues/user-field-leagues?field_id=${fieldId}`,
      {
        method: 'GET',
        credentials: 'include',
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al obtener las ligas.');
    }

    const data = await response.json();
    return data.leagues || [];
  } catch (error) {
    console.error('Error al obtener ligas por usuario y campo:', error.message);
    throw new Error('Error al obtener ligas.');
  }
};

export const getLeagueInfo = async (leagueId) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/leagues/${leagueId}`,
      {
        method: 'GET',
        credentials: 'include',
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || 'Error al obtener los detalles de la liga.'
      );
    }

    const data = await response.json();
    console.log('League info:', data);
    return data.league;
  } catch (error) {
    console.error('Error al obtener los detalles de la liga:', error.message);
    throw new Error('Error al obtener los detalles de la liga.');
  }
};

export const getLeagueDetails = async (leagueId) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/leagues/details/${leagueId}`,
      {
        method: 'GET',
        credentials: 'include',
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || 'Error al obtener los detalles de la liga.'
      );
    }

    const data = await response.json();
    console.log('League details:', data);
    return data;
  } catch (error) {
    console.error('Error al obtener los detalles de la liga:', error.message);
    throw new Error('Error al obtener los detalles de la liga.');
  }
};

export const createLeague = async (leagueData) => {
  try {
    const response = await fetch('http://localhost:5000/api/leagues/create', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(leagueData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al crear la liga.');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al crear la liga:', error.message);
    throw new Error('Error al crear la liga.');
  }
};

export const updateLeague = async (leagueId, leagueData) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/leagues/${leagueId}/update`,
      {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leagueData),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al actualizar la liga.');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al actualizar la liga:', error.message);
    throw new Error('Error al actualizar la liga.');
  }
};

export const getAllLeagues = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/leagues', {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al obtener todas las ligas.');
    }

    const data = await response.json();
    return data.leagues || [];
  } catch (error) {
    console.error('Error al obtener todas las ligas:', error.message);
    throw new Error('Error al obtener todas las ligas.');
  }
};

export const getOwnerLeagues = async () => {
  try {
    const response = await fetch(
      'http://localhost:5000/api/leagues/owner-leagues',
      {
        method: 'GET',
        credentials: 'include',
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || 'Error al obtener las ligas del usuario.'
      );
    }

    const data = await response.json();
    return data.leagues || [];
  } catch (error) {
    console.error('Error al obtener las ligas del usuario:', error.message);
    throw new Error('Error al obtener las ligas del usuario.');
  }
};

export const getUserLeagues = async () => {
  try {
    const response = await fetch(
      'http://localhost:5000/api/leagues/user-leagues',
      {
        method: 'GET',
        credentials: 'include',
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || 'Error al obtener las ligas del usuario.'
      );
    }

    const data = await response.json();
    return data.leagues || [];
  } catch (error) {
    console.error('Error al obtener las ligas del usuario:', error.message);
    throw new Error('Error al obtener las ligas del usuario.');
  }
};

export const createTeamWithPlayers = async (leagueId, teamData) => {
  console.log('Creating team with players:', teamData);
  try {
    const response = await fetch(
      `http://localhost:5000/api/leagues/${leagueId}/join`,
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(teamData),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al crear el equipo.');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al crear equipo:', error.message);
    throw error;
  }
};

export const getTeamsByLeague = async (leagueId) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/leagues/${leagueId}/teams`,
      {
        method: 'GET',
        credentials: 'include',
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al obtener equipos.');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al obtener equipos:', error.message);
    throw error;
  }
};

export const startLeague = async (leagueId) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/leagues/${leagueId}/start`,
      {
        method: 'POST',
        credentials: 'include',
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || 'Error al iniciar la liga. Verifica los datos.'
      );
    }

    const data = await response.json();
    console.log('Liga iniciada:', data);
    return data;
  } catch (error) {
    console.error('Error al iniciar la liga:', error.message);
    throw new Error('Error al iniciar la liga.');
  }
};

export const generateLeagueLink = async (leagueId, date) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/leagues/${leagueId}/generate-links`,
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || 'Error al generar el link para la liga.'
      );
    }

    return await response.json();
  } catch (error) {
    console.error('Error al generar el link:', error.message);
    throw error;
  }
};

export const getLeagueLinks = async (leagueId) => {
  console.log('Obteniendo links para la liga:', leagueId);
  try {
    const response = await fetch(
      `http://localhost:5000/api/leagues/${leagueId}/links`,
      {
        method: 'GET',
        credentials: 'include',
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || 'Error al obtener los links de la liga.'
      );
    }

    const data = await response.json();
    console.log('Response:', data);
    return data;
  } catch (error) {
    console.error('Error al obtener los links:', error.message);
    throw error;
  }
};
