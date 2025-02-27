const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
export const getFieldAvailability = async (fieldId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/availability/field/${fieldId}/availability`,
      {
        method: 'GET',
        credentials: 'include',
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al cargar disponibilidad.');
    }

    return data.weeklyAvailability;
  } catch (error) {
    console.error('Error al cargar la disponibilidad:', error);
    throw error;
  }
};

export const getBlockedDatesByDate = async (fieldId, startDate, endDate) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/availability/field/${fieldId}/blocked-dates/by-date?start_date=${startDate}&end_date=${endDate}`,
      {
        method: 'GET',
        credentials: 'include',
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al cargar fechas bloqueadas.');
    }

    return data.blockedDates;
  } catch (error) {
    console.error('Error al cargar las fechas bloqueadas:', error);
    throw error;
  }
};

export const getBlockedDates = async (fieldId) => {
  console.log('getBlockedDates');
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/availability/field/${fieldId}/blocked-dates`,
      {
        method: 'GET',
        credentials: 'include',
      }
    );

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Error al cargar fechas bloqueadas.');
    }
    console.log('Blockeeed', data.blockedDates);
    return data.blockedDates;
  } catch (error) {
    console.error('Error al cargar las fechas bloqueadas:', error);
    throw error;
  }
};

export const saveWeeklyAvailability = async (availabilityData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/availability/weekly`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(availabilityData),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(
        data.message || 'Error al guardar la disponibilidad semanal.'
      );
    }

    return data;
  } catch (error) {
    console.error('Error al guardar la disponibilidad semanal:', error);
    throw error;
  }
};

export const deleteWeeklyAvailability = async (
  field_id,
  deleteAvailabilityData
) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/availability/weekly/${field_id}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(deleteAvailabilityData),
      }
    );

    const data = await response.json();
    if (!response.ok) {
      throw new Error(
        data.message || 'Error al eliminar la disponibilidad semanal.'
      );
    }

    return data;
  } catch (error) {
    console.error('Error al eliminar la disponibilidad semanal:', error);
    throw error;
  }
};

export const addBlockedDates = async (datesToAdd, fieldId) => {
  console.log('Add', datesToAdd);
  try {
    const blockedData = datesToAdd.map(({ from, to }) => ({
      field_id: fieldId,
      start_time: from ? new Date(from).toISOString() : null,
      end_time: to ? new Date(to).toISOString() : null,
    }));

    const response = await fetch(`${API_BASE_URL}/api/availability/blocked`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(blockedData),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Error al añadir las fechas bloqueadas.');
    }

    return data;
  } catch (error) {
    console.error('Error al añadir las fechas bloqueadas:', error);
    throw error;
  }
};

export const removeBlockedDates = async (datesToRemove, fieldId) => {
  console.log('Remove', datesToRemove);
  try {
    for (const { from, to } of datesToRemove) {
      const start_time = new Date(from).toISOString();
      const end_time = to ? new Date(to).toISOString() : start_time;

      const response = await fetch(
        `${API_BASE_URL}/api/availability/blocked?field_id=${fieldId}&start_time=${encodeURIComponent(start_time)}&end_time=${encodeURIComponent(end_time)}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          data.message || 'Error al eliminar las fechas bloqueadas.'
        );
      }
    }

    return { message: 'Fechas bloqueadas eliminadas con éxito' };
  } catch (error) {
    console.error('Error al eliminar las fechas bloqueadas:', error);
    throw error;
  }
};
