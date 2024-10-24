export const getFieldAvailability = async (fieldId) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/availability/field/${fieldId}/availability`,
      {
        method: 'GET',
        credentials: 'include',
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al cargar disponibilidad.');
    }

    return data.weeklyAvailability; // Retorna los datos tal como los recibes, sin mapear
  } catch (error) {
    console.error('Error al cargar la disponibilidad:', error);
    throw error;
  }
};

export const getBlockedDatesByDate = async (fieldId, startDate, endDate) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/availability/field/${fieldId}/blocked-dates/by-date?start_date=${startDate}&end_date=${endDate}`,
      {
        method: 'GET',
        credentials: 'include',
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al cargar fechas bloqueadas.');
    }

    return data.blockedDates; // Simplemente retorna los datos si no es necesario procesarlos
  } catch (error) {
    console.error('Error al cargar las fechas bloqueadas:', error);
    throw error;
  }
};

export const getBlockedDates = async (fieldId) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/availability/field/${fieldId}/blocked-dates`,
      {
        method: 'GET',
        credentials: 'include',
      }
    );

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Error al cargar fechas bloqueadas.');
    }

    return data.blockedDates; // Simplemente retorna los datos si no es necesario procesarlos
  } catch (error) {
    console.error('Error al cargar las fechas bloqueadas:', error);
    throw error;
  }
};
