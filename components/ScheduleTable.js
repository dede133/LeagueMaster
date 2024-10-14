import { useState } from 'react';
import { TableBody, TableRow, TableCell } from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

const ScheduleTable = ({ availability, blockedDates }) => {
  const [selectedButtons, setSelectedButtons] = useState({});

  const daysOfWeek = [
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
    'Domingo',
  ];
  const hours = [
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
  ];

  const isAvailable = (day, hour) => {
    const availableDay = availability.find(
      (avail) => avail.day_of_week === day
    );
    if (!availableDay) return false;
    const startHour = parseInt(availableDay.start_time.split(':')[0], 10);
    const endHour = parseInt(availableDay.end_time.split(':')[0], 10);
    return hour >= startHour && hour < endHour;
  };

  const handleSelectButton = (dayIndex, hourIndex) => {
    const key = `${dayIndex}-${hourIndex}`;
    setSelectedButtons((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="relative inline-block max-h-96 overflow-auto scrollable-container">
      <table className="min-w-max table-fixed border-collapse border-spacing-0">
        <thead className="sticky top-0 bg-white z-10 ">
          <tr>
            <th className="sticky top-0 left-0 z-20 bg-white px-3 py-2 text-center text-sm">
              Horas / Días
            </th>
            {daysOfWeek.map((day, index) => (
              <th
                key={index}
                className="sticky top-0 bg-white px-3 py-2 text-center text-sm w-tableDays"
              >
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <TableBody>
          {hours.map((hour, hourIndex) => (
            <TableRow key={hourIndex} className="hover:bg-gray-50 border-none">
              <TableCell className="bg-gray-100 text-center text-sm border-b border-r border-t">
                {hour}
              </TableCell>
              {daysOfWeek.map((day, dayIndex) => {
                const key = `${dayIndex}-${hourIndex}`;
                return (
                  <TableCell key={dayIndex} className="border-r p-0 h-12">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          onClick={() =>
                            handleSelectButton(dayIndex, hourIndex)
                          }
                          className={`inline-block align-top h-full w-full ${
                            isAvailable(
                              dayIndex + 1,
                              parseInt(hour.split(':')[0], 10)
                            )
                              ? 'bg-blue-500 text-white'
                              : selectedButtons[key]
                                ? 'bg-blue-500 text-white'
                                : 'bg-white hover:bg-blue-500 text-gray-700'
                          } data-[state=open]:bg-blue-500`}
                        ></button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>
                          {`Reservando: ${daysOfWeek[dayIndex]} - ${hour}`}
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <div className="px-4 py-2">
                          <p className="text-sm text-gray-700">Precio: $30</p>
                          <button
                            onClick={() =>
                              handleSelectButton(dayIndex, hourIndex)
                            }
                            className="mt-2 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                          >
                            Continuar
                          </button>
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </table>
    </div>
  );
};

export default ScheduleTable;
