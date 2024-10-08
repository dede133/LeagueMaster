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
    const weeklyAvailability = data.weeklyAvailability.reduce((acc, item) => {
      const dayOfWeek = [
        'Lunes',
        'Martes',
        'Miércoles',
        'Jueves',
        'Viernes',
        'Sábado',
        'Domingo',
      ][item.day_of_week - 1];
      acc[dayOfWeek] = {
        startTime: item.start_time,
        endTime: item.end_time,
      };
      return acc;
    }, {});

    const blockedDates = data.blockedDates.map((date) => ({
      from: new Date(date.start_time),
      to: new Date(date.end_time),
    }));

    return { weeklyAvailability, blockedDates };
  } catch (error) {
    console.error('Error al cargar los datos del campo:', error);
    throw new Error('Error al cargar disponibilidad y fechas bloqueadas.');
  }
};
