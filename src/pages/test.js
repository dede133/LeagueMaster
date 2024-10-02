import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { PlusIcon, PencilIcon, TrashIcon } from 'lucide-react';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

const daysOfWeek = [
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
  'Domingo',
];

const AdminFieldManagement = () => {
  const [fields, setFields] = useState([]);
  const [selectedField, setSelectedField] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState('60'); // Duración en minutos
  const [availability, setAvailability] = useState({
    Lunes: [],
    Martes: [],
    Miércoles: [],
    Jueves: [],
    Viernes: [],
    Sábado: [],
    Domingo: [],
  }); // Guardar franjas seleccionadas
  const [blockedDates, setBlockedDates] = useState([]); // Fechas bloqueadas

  // Cargar campos desde la API
  useEffect(() => {
    const fetchFields = async () => {
      try {
        const response = await fetch(
          'http://localhost:5000/api/field/user-fields',
          {
            method: 'GET',
            credentials: 'include',
          }
        );
        const data = await response.json();
        if (response.ok) {
          setFields(data.fields); // Guardar los campos del usuario admin
          setSelectedField(data.fields[0]); // Seleccionar el primer campo por defecto
        } else {
          alert('No se pudo cargar los campos.');
        }
      } catch (error) {
        console.error('Error al cargar los campos:', error);
      }
    };

    fetchFields();
  }, []);

  // Generar franjas horarias según la duración seleccionada
  const generateTimeSlots = (slotDurationInMinutes) => {
    const totalMinutesInDay = 24 * 60; // 24 horas por 60 minutos
    const numberOfSlots = totalMinutesInDay / slotDurationInMinutes; // Número total de slots

    const timeSlots = [];

    for (let i = 0; i < numberOfSlots; i++) {
      const startMinutes = i * slotDurationInMinutes;
      const endMinutes = startMinutes + slotDurationInMinutes;

      // Convertir minutos a formato HH:MM
      const startTime = formatMinutesToTime(startMinutes);
      const endTime = formatMinutesToTime(endMinutes % totalMinutesInDay); // Corregido para evitar que se salga del rango de 24h

      timeSlots.push(`${startTime} - ${endTime}`);
    }

    return timeSlots;
  };

  // Función auxiliar para convertir minutos a formato HH:MM
  const formatMinutesToTime = (minutes) => {
    const hours = Math.floor(minutes / 60) % 24; // Asegurar que las horas no excedan 24
    const mins = minutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
  };

  // Añadir disponibilidad diaria
  const handleAddAvailability = (day, slot) => {
    if (availability[day].includes(slot)) {
      setAvailability((prev) => ({
        ...prev,
        [day]: prev[day].filter((time) => time !== slot),
      }));
    } else {
      setAvailability((prev) => ({
        ...prev,
        [day]: [...prev[day], slot],
      }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Administrar Campo
      </h1>

      {/* Seleccionar Campo */}
      <div className="mb-4">
        <Select
          onValueChange={(value) =>
            setSelectedField(fields.find((f) => f.field_id === parseInt(value)))
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue>
              {selectedField ? selectedField.name : 'Selecciona un campo'}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {fields.map((field) => (
              <SelectItem
                key={field.field_id}
                value={field.field_id.toString()}
              >
                {field.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Seleccionar Duración */}
      <div className="mb-4">
        <Select onValueChange={(value) => setSelectedDuration(parseInt(value))}>
          <SelectTrigger className="w-full">
            <SelectValue>Selecciona la duración de la franja</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="30">30 minutos</SelectItem>
            <SelectItem value="60">1 hora</SelectItem>
            <SelectItem value="90">1 hora 30 minutos</SelectItem>
            <SelectItem value="120">2 horas</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {/* Mostrar la disponibilidad diaria en formato tabla */}
      <div className="grid grid-cols-8 gap-2">
        {/* Columna vacía para las horas */}
        <div></div>
        {daysOfWeek.map((day) => (
          <div key={day} className="text-center font-bold bg-gray-300 p-2">
            {day}
          </div>
        ))}

        {generateTimeSlots(selectedDuration).map((timeSlot) => (
          <>
            {/* Primera columna con las horas */}
            <div className="text-right pr-2 font-medium">
              {timeSlot.split(' - ')[0]}
            </div>
            {daysOfWeek.map((day) => (
              <div key={`${day}-${timeSlot}`} className="border p-1">
                <button
                  className={`w-full h-full p-2 text-sm rounded-lg ${
                    availability[day].includes(timeSlot)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                  onClick={() => handleAddAvailability(day, timeSlot)}
                >
                  {availability[day].includes(timeSlot)
                    ? 'Reservado'
                    : 'Disponible'}
                </button>
              </div>
            ))}
          </>
        ))}
      </div>
      {/* Fechas bloqueadas */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4 text-gray-700">
          Fechas Bloqueadas
        </h2>
        <Calendar
          mode="multiple"
          onSelect={(dates) => setBlockedDates(dates)}
        />
      </div>

      {/* Guardar disponibilidad */}
      <Button className="w-full bg-blue-600 text-white p-3">
        Confirmar Disponibilidad
      </Button>
    </div>
  );
};

export default AdminFieldManagement;
