export const makeReservation = async (reservationData) => {
  try {
    const response = await fetch(
      'http://localhost:5000/api/reservations/reservation',
      {
        method: 'POST',
        credentials: 'include', // Incluir las cookies o sesión
        headers: {
          'Content-Type': 'application/json', // Asegurar que los datos se envíen como JSON
        },
        body: JSON.stringify(reservationData), // Enviar los datos de la reserva como JSON
      }
    );

    if (!response.ok) {
      const errorData = await response.json(); // Leer la respuesta del servidor en caso de error
      throw new Error(errorData.message || 'Error al hacer la reserva.');
    }

    return await response.json(); // Devolver la respuesta si todo sale bien
  } catch (error) {
    console.error('Error en el servidor:', error);
    throw new Error('Hubo un error al intentar realizar la reserva.');
  }
};

export const getReservationsByField = async (fieldId) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/reservations/field/${fieldId}`,
      {
        method: 'GET',
        credentials: 'include', // Para incluir cookies si se necesita autenticación
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
      `http://localhost:5000/api/reservations/field/${fieldId}/by-date?start=${startDate}&end=${endDate}`,
      {
        method: 'GET',
        credentials: 'include', // Para incluir cookies si se necesita autenticación
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

// src/lib/services/reservations.js
export const getReservationsByUser = async (userId) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/reservations/user/${userId}`,
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
      `http://localhost:5000/api/reservations/cancel/${reservationId}`,
      {
        method: 'PUT',
        credentials: 'include', // Incluir cookies para autenticación
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
