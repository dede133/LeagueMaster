import { useState } from 'react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon } from 'lucide-react';
import {
  format,
  isWithinInterval,
  addDays,
  startOfWeek,
  endOfWeek,
} from 'date-fns';

const DateSelector = ({ selectedDate, setSelectedDate, availableWeeks }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Definir el inicio y fin del periodo disponible basados en las semanas proporcionadas
  const startOfAvailablePeriod = availableWeeks[0];
  const endOfAvailablePeriod = addDays(availableWeeks[2], 6);

  const handleDateSelect = (date) => {
    console.log('first', date);
    setSelectedDate(date);
    setIsOpen(false); // Cierra el popover al seleccionar una fecha
  };

  return (
    <div className="flex justify-end items-center mb-2">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={'outline'}
            className="justify-start text-left font-normal"
            onClick={() => setIsOpen(!isOpen)} // Abre o cierra el popover
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate
              ? `${format(
                  startOfWeek(selectedDate, { weekStartsOn: 1 }),
                  'dd/MM'
                )} - ${format(
                  endOfWeek(selectedDate, { weekStartsOn: 1 }),
                  'dd/MM'
                )}`
              : 'Selecciona una semana'}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            initialFocus
            disabled={(date) =>
              !isWithinInterval(date, {
                start: startOfAvailablePeriod,
                end: endOfAvailablePeriod,
              })
            }
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DateSelector;
