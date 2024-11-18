import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useState } from 'react';
import { format, startOfWeek, addDays } from 'date-fns';
import { makeReservation } from '@/lib/services/reservation';

const ReservationButton = ({
  status,
  day,
  hour,
  user,
  field_id,
  setSchedule,
}) => {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const buttonColor =
    status === 'available' || status === 'cancelled'
      ? 'bg-white hover:bg-blue-500 text-gray-700'
      : status === 'reserved'
        ? 'bg-gray-500 cursor-not-allowed'
        : 'bg-gray-300 cursor-not-allowed';

  const formattedHour = format(hour, 'HH:mm');

  const handleContinue = async () => {
    if (!user) {
      setErrorMessage('No autorizado. Inicia sesión para continuar.');
      return;
    }

    const endTime = new Date(hour);
    endTime.setHours(endTime.getHours() + 1);

    const reservationData = {
      field_id: field_id,
      reservation_date: day,
      reservation_start_time: format(hour, 'HH:mm:ss'),
      reservation_end_time: format(endTime, 'HH:mm:ss'),
      price: 60,
    };

    try {
      await makeReservation(reservationData);
      setErrorMessage('');
      alert('Reserva realizada con éxito');

      setSchedule((prevSchedule) => {
        const updatedSchedule = { ...prevSchedule };
        const hourKey = format(hour, 'HH');

        if (updatedSchedule[day] && updatedSchedule[day][hourKey]) {
          updatedSchedule[day][hourKey] = {
            status: 'reserved',
            user: user.id,
          };
        }

        return updatedSchedule;
      });
    } catch (error) {
      setErrorMessage(error.message || 'Error al realizar la reserva.');
    }
  };
  return (
    <div
      className={`inline-block align-top h-full w-full ${buttonColor}`}
      disabled={status !== 'available' && status !== 'cancelled'}
    >
      {(status === 'available' || status === 'cancelled') && (
        <DropdownMenu open={openDropdown} onOpenChange={setOpenDropdown}>
          <DropdownMenuTrigger asChild>
            <div
              className={`h-full w-full ${buttonColor}`}
              onClick={() => setOpenDropdown(true)}
            ></div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>{`Reservando para el día ${day} - ${formattedHour}`}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <button
              onClick={handleContinue}
              className="mt-2 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
            >
              Continuar
            </button>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default ReservationButton;
