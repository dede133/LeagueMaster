import { useState, useEffect } from 'react';
import { makeReservation } from '@/lib/services/reservation';
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';

const ScheduleTable = ({
  availability,
  blockedDates,
  reservations,
  user,
  field_id,
}) => {
  const [schedule, setSchedule] = useState({});
  const [selectedButtons, setSelectedButtons] = useState({});
  const [openDropdown, setOpenDropdown] = useState(null); // Estado para controlar qué dropdown está abierto
  const [selectedDate, setSelectedDate] = useState(new Date()); // Estado para la fecha seleccionada
  const [openCalendar, setCalendarOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); // Estado para manejar mensajes de error o éxito

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

  const handleContinue = async (dayIndex, hourIndex, price) => {
    // Verificar si el usuario está logueado
    if (!user) {
      setErrorMessage('No autorizado. Inicia sesión para continuar.');
      return;
    }

    // Preparar los datos de la reserva
    const currentDate = new Date(firstDayOfWeek);
    currentDate.setDate(firstDayOfWeek.getDate() + dayIndex);

    const reservationData = {
      field_id: field_id, // Usar `field_id` pasado al componente
      reservation_date: format(currentDate, 'yyyy-MM-dd'),
      reservation_start_time: `${hours[hourIndex]}:00`, // Interpolación correcta
      reservation_end_time: `${hours[hourIndex + 1]}:00`, // Interpolación correcta
      price: price || 60, // Precio por defecto si no se pasa uno
    };

    // Hacer la reserva
    try {
      await makeReservation(reservationData);
      setErrorMessage(''); // Limpiar mensaje de error si la reserva fue exitosa
      alert('Reserva realizada con éxito');

      // Paso 1: Actualizar el estado localmente
      setSchedule((prevSchedule) => {
        const updatedSchedule = { ...prevSchedule };
        const dayOfWeek = dayIndex + 1; // Asumimos que dayIndex va de 0 a 6, y dayOfWeek de 1 a 7
        const hour = parseInt(hours[hourIndex], 10);

        if (updatedSchedule[dayOfWeek] && updatedSchedule[dayOfWeek][hour]) {
          updatedSchedule[dayOfWeek][hour] = {
            status: 'reserved',
            user: user.id, // Usa la ID del usuario logueado
          };
        }

        return updatedSchedule;
      });
    } catch (error) {
      setErrorMessage(error.message || 'Error al realizar la reserva.');
    }
  };

  const preprocessScheduleData = (availability, blockedDates, reservations) => {
    const schedule = {}; // Estructura para almacenar la disponibilidad, bloqueos y reservas

    // Paso 1: Iterar sobre Availability y verificar contra Blocked Dates
    availability.forEach((avail) => {
      const dayOfWeek = avail.day_of_week; // Día de la semana (1 = lunes, 7 = domingo)
      const startHour = parseInt(avail.start_time.split(':')[0], 10);
      const endHour = parseInt(avail.end_time.split(':')[0], 10);

      // Verificar la fecha actual
      const currentDate = new Date().getDay() || 7; // Fecha de hoy
      const isInPast = new Date(dayOfWeek) < currentDate;

      // Verificar si el día completo está bloqueado en Blocked Dates
      const isBlocked = blockedDates.some((blocked) => {
        const blockedDay = new Date(blocked.start_time).getDay() || 7;
        return blockedDay === dayOfWeek;
      });

      // Si el día está bloqueado o está en el pasado, saltamos a la siguiente iteración
      if (isBlocked || isInPast) return;

      // Paso 2: Si el día no está bloqueado y no está en el pasado, marcamos las horas disponibles
      if (!schedule[dayOfWeek]) schedule[dayOfWeek] = {};
      for (let hour = startHour; hour < endHour; hour++) {
        schedule[dayOfWeek][hour] = { status: 'available' };
      }
    });

    // Paso 3: Marcar las horas como reservadas si ya hay una reserva
    reservations.forEach((reservation) => {
      const reservationDay =
        new Date(reservation.reservation_date).getDay() || 7;
      const reservationHour = parseInt(
        reservation.reservation_start_time.split(':')[0],
        10
      );

      if (
        schedule[reservationDay] &&
        schedule[reservationDay][reservationHour]
      ) {
        schedule[reservationDay][reservationHour] = {
          status: 'reserved',
        };
      }
    });

    return schedule; // Devuelve la estructura con disponibilidad, bloqueos y reservas
  };

  useEffect(() => {
    const processedSchedule = preprocessScheduleData(
      availability,
      blockedDates,
      reservations
    );

    setSchedule(processedSchedule); // Actualizar el estado con la estructura combinada
    console.log(availability, blockedDates, reservations);
  }, [availability, blockedDates, reservations]);

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

      {/* Verificar si hay horas disponibles */}
      {hours.length === 0 ? (
        <p className="text-center text-gray-500 py-4">
          No hay reservas disponibles
        </p>
      ) : (
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
              <TableRow
                key={hourIndex}
                className="hover:bg-gray-50 border-none"
              >
                <TableCell className="bg-gray-100 text-center text-sm border-b border-r border-t">
                  {hour}
                </TableCell>

                {daysOfWeek.map((day, dayIndex) => {
                  const daySchedule = schedule[dayIndex + 1]; // Día de la semana, +1 porque `schedule` usa de 1 a 7
                  const hourStatus =
                    daySchedule?.[parseInt(hour.split(':')[0], 10)]?.status ||
                    'blocked'; // Verificar estado o bloquear

                  const buttonColor =
                    hourStatus === 'available'
                      ? 'bg-white hover:bg-blue-500 text-gray-700'
                      : hourStatus === 'reserved'
                        ? 'bg-gray-500 cursor-not-allowed' // Gris oscuro para reservados
                        : 'bg-gray-300 cursor-not-allowed'; // Gris claro para bloqueados

                  return (
                    <TableCell key={dayIndex} className="border-r p-0 h-12">
                      <div
                        className={`inline-block align-top h-full w-full ${buttonColor}`}
                        disabled={hourStatus !== 'available'} // Solo habilitar si está disponible
                      >
                        {hourStatus === 'available' && (
                          <DropdownMenu
                            open={openDropdown === `${dayIndex}-${hourIndex}`}
                            onOpenChange={(open) =>
                              setOpenDropdown(
                                open ? `${dayIndex}-${hourIndex}` : null
                              )
                            }
                          >
                            <DropdownMenuTrigger asChild>
                              <div
                                onClick={() =>
                                  setOpenDropdown(`${dayIndex}-${hourIndex}`)
                                }
                                className={`h-full w-full ${buttonColor}`}
                              ></div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuLabel>
                                {`Reservando: ${daysOfWeek[dayIndex]} - ${hour}`}
                              </DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <div className="px-4 py-2">
                                <p className="text-sm text-gray-700">
                                  Precio: $60
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
                        )}
                      </div>
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </table>
      )}
    </div>
  );
};

export default ScheduleTable;
