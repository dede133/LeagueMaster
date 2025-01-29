const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
export const makeReservation = async (reservationData) => {
  console.log(reservationData);
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/reservations/reservation`,
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reservationData),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al hacer la reserva.');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en el servidor:', error);
    throw new Error('Hubo un error al intentar realizar la reserva.');
  }
};

export const getReservationsByField = async (fieldId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/reservations/field/${fieldId}`,
      {
        method: 'GET',
        credentials: 'include',
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al obtener las reservas');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al obtener reservas:', error);
    throw error;
  }
};

export const getReservationsByFieldAndDate = async (
  fieldId,
  startDate,
  endDate
) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/reservations/field/${fieldId}/by-date?start=${startDate}&end=${endDate}`,
      {
        method: 'GET',
        credentials: 'include',
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al obtener las reservas.');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al obtener reservas:', error);
    throw error;
  }
};

export const getReservationsByUser = async (userId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/reservations/user/${userId}`,
      {
        method: 'GET',
        credentials: 'include',
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al obtener las reservas');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al obtener reservas:', error);
    throw error;
  }
};

export const cancelReservation = async (reservationId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/reservations/cancel/${reservationId}`,
      {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Error al cancelar la reserva');
    }

    return data;
  } catch (error) {
    console.error('Error al cancelar la reserva:', error);
    throw error;
  }
};
