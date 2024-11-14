import { format, parseISO, isWithinInterval, isSameDay } from 'date-fns';

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

const getDayOfTheWeek = (date) => {
  const day = date.getDay(); // Obtiene el día de la semana (0 = domingo, 1 = lunes, ...)
  return day === 0 ? 6 : day - 1; // Convierte domingo (0) a 6, y desplaza el resto
};

export const preprocessScheduleData = (
  availability,
  blockedDates,
  reservations,
  weeks
) => {
  const schedule = {}; // Estructura para almacenar la disponibilidad, bloqueos y reservas
  const today = new Date();

  // Utilidades para obtener la fecha formateada y verificar si está bloqueada
  const formatDate = (date) => format(date, 'yyyy-MM-dd');

  const isDateBlocked = (date) => {
    return blockedDates.some((blocked) => {
      const startDate = parseISO(blocked.start_time);
      const endDate = blocked.end_time ? parseISO(blocked.end_time) : startDate;
      return (
        isSameDay(date, startDate) ||
        isSameDay(date, endDate) ||
        isWithinInterval(date, { start: startDate, end: endDate })
      );
    });
  };

  // Paso 1: Procesar cada semana y cada

  weeks.forEach((weekStart) => {
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(weekStart);
      currentDate.setDate(weekStart.getDate() + i);
      const formattedDate = formatDate(currentDate);

      // Bloquea todo el día si es anterior a `today`
      if (currentDate < today && !isSameDay(currentDate, today)) {
        schedule[formattedDate] = { blocked: true };
        continue;
      }

      // Bloquea el día si está en las fechas bloqueadas
      if (isDateBlocked(currentDate)) {
        schedule[formattedDate] = { blocked: true };
        continue;
      }

      // Marcar horas disponibles según la disponibilidad
      availability.forEach((avail) => {
        if (getDayOfTheWeek(currentDate) === avail.day_of_week % 7) {
          if (!schedule[formattedDate]) schedule[formattedDate] = {};

          const startHour = parseInt(avail.start_time.split(':')[0], 10);
          const endHour = parseInt(avail.end_time.split(':')[0], 10);

          for (let hour = startHour; hour < endHour; hour++) {
            // Si es el día actual, bloquea horas pasadas
            if (isSameDay(currentDate, today) && hour <= today.getHours()) {
              schedule[formattedDate][hour] = { status: 'blocked' };
            } else {
              schedule[formattedDate][hour] = { status: 'available' };
            }
          }
        }
      });
    }
  });

  // Paso 2: Procesar reservas y marcar horas como reservadas
  reservations.forEach((reservation) => {
    const reservationDate = formatDate(parseISO(reservation.reservation_date));
    const reservationHour = parseInt(
      reservation.reservation_start_time.split(':')[0],
      10
    );

    if (
      schedule[reservationDate] &&
      schedule[reservationDate][reservationHour]
    ) {
      schedule[reservationDate][reservationHour] = {
        status: reservation.status === 'cancelled' ? 'cancelled' : 'reserved',
      };
    }
  });
  console.log(schedule);
  return schedule; // Devuelve la estructura con disponibilidad, bloqueos y reservas
};
