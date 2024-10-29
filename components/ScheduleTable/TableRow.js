import ReservationButton from './ReservationButton';
import { getAvailableDaysInWeek } from './utils';
import { format, startOfWeek, addDays } from 'date-fns';

const TableRow = ({
  hour,
  schedule,
  setSchedule,
  user,
  field_id,
  selectedDate,
}) => {
  const formattedHour = format(hour, 'HH:mm');
  // Calcular el inicio de la semana en base a la fecha seleccionada
  const startOfWeekDate = startOfWeek(selectedDate, { weekStartsOn: 1 });
  console.log('startOfWeekDate', startOfWeekDate);
  const daysOfWeek = Array.from({ length: 7 }, (_, i) =>
    addDays(startOfWeekDate, i)
  ); // Lista de días en la semana seleccionada

  return (
    <tr className="hover:bg-gray-50 border-none">
      <td className="bg-gray-100 text-center text-sm border-b border-r border-t">
        {formattedHour}
      </td>
      {daysOfWeek.map((day, dayIndex) => {
        const formattedDate = format(day, 'yyyy-MM-dd');
        const daySchedule = schedule[formattedDate]; // Obtener el horario del día formateado
        const hourStatus = daySchedule?.[hour.getHours()]?.status || 'blocked';
        return (
          <td key={dayIndex} className="border-r p-0 h-12">
            <ReservationButton
              status={hourStatus}
              day={formattedDate}
              hour={hour}
              user={user}
              field_id={field_id}
              setSchedule={setSchedule}
            />
          </td>
        );
      })}
    </tr>
  );
};

export default TableRow;
