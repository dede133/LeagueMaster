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
  const [selectedDate, setSelectedDate] = useState(new Date());

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
      availableWeeks
    );
    setSchedule(processedSchedule);
  }, [availability, blockedDates, reservations]);

  const hours = getHoursRange(availability);

  return (
    <div className="relative w-full">
      <div className="overflow-y-auto max-h-[600px] scroll-custom">
        <DateSelector
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          availableWeeks={availableWeeks}
        />
        <table className="table-auto border-collapse border-spacing-0 w-full">
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
    </div>
  );
};

export default ScheduleTable;
