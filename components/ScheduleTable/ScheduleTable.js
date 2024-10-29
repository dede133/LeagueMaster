// ScheduleTable.js
import { useState, useEffect } from 'react';
import { startOfWeek, addWeeks } from 'date-fns';
import { preprocessScheduleData, getHoursRange } from './utils';
import DateSelector from './DateSelector';
import TableHeader from './TableHeader';
import TableBody from './TableBody';

const ScheduleTable = ({
  availability,
  blockedDates,
  reservations,
  user,
  field_id,
}) => {
  const [schedule, setSchedule] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date()); // Estado para la fecha seleccionada

  // Calcular las tres semanas disponibles basadas en la semana actual (solo se hace una vez)
  const firstDayOfCurrentWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
  const secondWeek = startOfWeek(addWeeks(firstDayOfCurrentWeek, 1), {
    weekStartsOn: 1,
  });
  const thirdWeek = startOfWeek(addWeeks(firstDayOfCurrentWeek, 2), {
    weekStartsOn: 1,
  });
  const availableWeeks = [firstDayOfCurrentWeek, secondWeek, thirdWeek];
  useEffect(() => {
    const processedSchedule = preprocessScheduleData(
      availability,
      blockedDates,
      reservations,
      availableWeeks // Pasar las semanas disponibles como argumento
    );
    setSchedule(processedSchedule);
  }, [availability, blockedDates, reservations]);

  const hours = getHoursRange(availability);

  return (
    <div className="relative inline-block max-h-96 overflow-auto scrollable-container">
      <DateSelector
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        availableWeeks={availableWeeks} // Pasar las semanas calculadas solo una vez
      />
      <table className="min-w-max table-fixed border-collapse border-spacing-0">
        <TableHeader selectedDate={selectedDate} />
        <TableBody
          hours={hours}
          schedule={schedule}
          setSchedule={setSchedule}
          user={user}
          field_id={field_id}
          selectedDate={selectedDate}
        />
      </table>
    </div>
  );
};

export default ScheduleTable;
