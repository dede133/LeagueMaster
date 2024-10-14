export const getFieldAvailability = async (fieldId) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/availability/${fieldId}`,
      {
        method: 'GET',
        credentials: 'include',
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || 'Error al cargar disponibilidad y fechas bloqueadas.'
      );
    }

    // Procesar los datos
    const weeklyAvailability = data.weeklyAvailability.map((item) => ({
      day_of_week: item.day_of_week,
      start_time: item.start_time,
      end_time: item.end_time,
      price: 60, // Precio predeterminado
    }));

    const blockedDates = data.blockedDates.map((date) => ({
      from: date.start_time ? new Date(date.start_time) : null, // Si no hay start_time, se maneja como null
      to: date.end_time ? new Date(date.end_time) : new Date(date.start_time), // Si no hay end_time, usa start_time
    }));

    return { weeklyAvailability, blockedDates };
  } catch (error) {
    console.error('Error al cargar los datos del campo:', error);
    throw new Error('Error al cargar disponibilidad y fechas bloqueadas.');
  }
};
