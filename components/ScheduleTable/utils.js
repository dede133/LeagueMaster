import { format, parseISO } from 'date-fns';

export const getHoursRange = (availability) => {
  let earliest = 24;
  let latest = 0;

  // Encontrar la hora más temprana y la más tardía en la disponibilidad
  availability.forEach((day) => {
    const start = parseInt(day.start_time.split(':')[0], 10);
    const end = parseInt(day.end_time.split(':')[0], 10);
    if (start < earliest) earliest = start;
    if (end > latest) latest = end;
  });

  const hours = [];
  for (let i = earliest; i <= latest; i++) {
    // Crear un nuevo objeto Date con la hora `i`
    const date = new Date();
    date.setHours(i, 0, 0, 0); // Establecer la hora, minutos, segundos y milisegundos
    hours.push(date);
  }

  return hours;
};

export const preprocessScheduleData = (
  availability,
  blockedDates,
  reservations,
  weeks
) => {
  const schedule = {}; // Estructura para almacenar la disponibilidad, bloqueos y reservas
  const today = new Date();
  // Paso 1: Iterar sobre las semanas y Availability
  weeks.forEach((weekStart) => {
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(weekStart);
      currentDate.setDate(weekStart.getDate() + i); // Ajustar al día correspondiente

      const formattedDate = format(currentDate, 'yyyy-MM-dd');

      if (currentDate < today) {
        schedule[formattedDate] = { blocked: true };
        continue;
      }

      // Verificar si el día está bloqueado en Blocked Dates
      const isBlocked = blockedDates.some((blocked) => {
        const blockedDate = parseISO(blocked.start_time);
        return format(blockedDate, 'yyyy-MM-dd') === formattedDate; // Comparar fechas formateadas
      });

      // Si el día está bloqueado, saltamos a la siguiente iteración
      if (isBlocked) {
        schedule[formattedDate] = { blocked: true };
        continue;
      }

      // Iterar sobre la disponibilidad
      availability.forEach((avail) => {
        const dayOfWeek = avail.day_of_week;
        const startHour = parseInt(avail.start_time.split(':')[0], 10);
        const endHour = parseInt(avail.end_time.split(':')[0], 10);

        // Verificar si el día de la semana coincide
        if (currentDate.getDay() === dayOfWeek % 7) {
          // Si el día no está bloqueado, inicializamos la entrada en el schedule si no existe
          if (!schedule[formattedDate]) schedule[formattedDate] = {};
          for (let hour = startHour; hour < endHour; hour++) {
            schedule[formattedDate][hour] = { status: 'available' };
          }
        }
      });
    }
  });

  // Paso 2: Marcar las horas como reservadas si ya hay una reserva
  reservations.forEach((reservation) => {
    const reservationDate = format(
      parseISO(reservation.reservation_date),
      'yyyy-MM-dd'
    );
    const reservationHour = parseInt(
      reservation.reservation_start_time.split(':')[0],
      10
    );

    if (
      schedule[reservationDate] &&
      schedule[reservationDate][reservationHour]
    ) {
      schedule[reservationDate][reservationHour] = {
        status: 'reserved',
      };
    }
  });

  return schedule; // Devuelve la estructura con disponibilidad, bloqueos y reservas
};
