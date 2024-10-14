import { useState, useMemo } from 'react';
import { TableBody, TableRow, TableCell } from '@/components/ui/table';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  format,
  startOfWeek,
  endOfWeek,
  isWithinInterval,
  parseISO,
} from 'date-fns';

const ScheduleTable = ({ availability, blockedDates }) => {
  const [selectedButtons, setSelectedButtons] = useState({});
  const [openDropdown, setOpenDropdown] = useState(null); // Estado para controlar qué dropdown está abierto
  const [selectedDate, setSelectedDate] = useState(new Date()); // Estado para la fecha seleccionada
  const [openCalendar, setCalendarOpen] = useState(false);

  const firstDayOfWeek = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const lastDayOfWeek = endOfWeek(selectedDate, { weekStartsOn: 1 });

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${day}/${month}`;
  };

  const daysOfWeek = [
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
    'Domingo',
  ];

  // Función para obtener el rango de horas basado en los datos de disponibilidad
  const getHoursRange = () => {
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
      hours.push(`${i.toString().padStart(2, '0')}:00`);
    }
    return hours;
  };

  const hours = getHoursRange(); // Rango dinámico de horas

  // Función que comprueba si una hora está disponible para un día dado
  const isAvailable = (day, hour) => {
    const availableDay = availability.find(
      (avail) => avail.day_of_week === day
    );
    if (!availableDay) return false;
    const startHour = parseInt(availableDay.start_time.split(':')[0], 10);
    const endHour = parseInt(availableDay.end_time.split(':')[0], 10);
    return hour >= startHour && hour < endHour;
  };

  // Función que comprueba si un día está bloqueado por una fecha bloqueada

  const isDayBlocked = (day) => {
    return blockedDates.some(({ from, to }) => {
      if (!from) return false; // Si no hay fecha de inicio, no bloqueamos
      return isWithinInterval(day, { start: from, end: to || from }); // Si no hay 'to', usa 'from' como el único día bloqueado
    });
  };
  // Función para manejar la selección de un botón
  const handleSelectButton = (dayIndex, hourIndex) => {
    const key = `${dayIndex}-${hourIndex}`;
    setSelectedButtons((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleContinue = (dayIndex, hourIndex) => {
    handleSelectButton(dayIndex, hourIndex);
    setOpenDropdown(null); // Cierra el dropdown
  };

  return (
    <div className="relative inline-block max-h-96 overflow-auto scrollable-container">
      <div className="flex justify-end items-center mb-2">
        <Popover open={openCalendar} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant={'outline'}
              className={cn(
                'justify-start text-left font-normal',
                !selectedDate && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate
                ? `${formatDate(firstDayOfWeek)} - ${formatDate(lastDayOfWeek)}`
                : 'Selecciona una semana'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                setSelectedDate(date);
                setCalendarOpen(false); // Cierra el popover al seleccionar la fecha
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
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
                const currentDate = new Date(firstDayOfWeek);
                currentDate.setDate(firstDayOfWeek.getDate() + dayIndex);
                const availableDay = availability.find(
                  (avail) => avail.day_of_week === dayIndex + 1
                );

                // Bloquear la hora si no está disponible en este día o está bloqueada
                const isHourBlocked =
                  !isAvailable(
                    dayIndex + 1,
                    parseInt(hour.split(':')[0], 10)
                  ) || isDayBlocked(currentDate);

                return (
                  <TableCell key={dayIndex} className="border-r p-0 h-12">
                    {availableDay ? (
                      <DropdownMenu
                        open={openDropdown === key}
                        onOpenChange={(open) =>
                          setOpenDropdown(open ? key : null)
                        }
                      >
                        <DropdownMenuTrigger asChild>
                          <button
                            onClick={() => setOpenDropdown(key)}
                            className={`inline-block align-top h-full w-full ${
                              isHourBlocked
                                ? 'bg-gray-300 cursor-not-allowed'
                                : selectedButtons[key]
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-white hover:bg-blue-500 text-gray-700'
                            } data-[state=open]:bg-blue-500`}
                            disabled={isHourBlocked} // Bloquear el botón si la hora está fuera del rango o bloqueada
                          ></button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuLabel>
                            {`Reservando: ${daysOfWeek[dayIndex]} - ${hour}`}
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <div className="px-4 py-2">
                            <p className="text-sm text-gray-700">
                              Precio: ${availableDay.price}
                            </p>
                            <button
                              onClick={() =>
                                handleContinue(dayIndex, hourIndex)
                              }
                              className="mt-2 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                            >
                              Continuar
                            </button>
                          </div>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <div className="bg-gray-300 w-full h-full"></div> // No disponible
                    )}
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
