import { format, parseISO, isWithinInterval, isSameDay } from 'date-fns';

export const getHoursRange = (availability) => {
  let earliest = 24;
  let latest = 0;

  availability.forEach((day) => {
    const start = parseInt(day.start_time.split(':')[0], 10);
    const end = parseInt(day.end_time.split(':')[0], 10);
    if (start < earliest) earliest = start;
    if (end > latest) latest = end;
  });

  const hours = [];
  for (let i = earliest; i <= latest; i++) {
    const date = new Date();
    date.setHours(i, 0, 0, 0);
    hours.push(date);
  }

  return hours;
};

const getDayOfTheWeek = (date) => {
  const day = date.getDay();
  return day === 0 ? 6 : day - 1;
};

export const preprocessScheduleData = (
  availability,
  blockedDates,
  reservations,
  weeks
) => {
  const schedule = {};
  const today = new Date();

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

  weeks.forEach((weekStart) => {
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(weekStart);
      currentDate.setDate(weekStart.getDate() + i);
      const formattedDate = formatDate(currentDate);

      if (currentDate < today && !isSameDay(currentDate, today)) {
        schedule[formattedDate] = { blocked: true };
        continue;
      }

      if (isDateBlocked(currentDate)) {
        schedule[formattedDate] = { blocked: true };
        continue;
      }

      availability.forEach((avail) => {
        if (getDayOfTheWeek(currentDate) === avail.day_of_week % 7) {
          if (!schedule[formattedDate]) schedule[formattedDate] = {};

          const startHour = parseInt(avail.start_time.split(':')[0], 10);
          const endHour = parseInt(avail.end_time.split(':')[0], 10);

          for (let hour = startHour; hour < endHour; hour++) {
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
  return schedule;
};
