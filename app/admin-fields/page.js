'use client';
import { useState, useEffect, use } from 'react';
import { X } from 'lucide-react';
import { getUserFields } from '@/lib/services/field';
import {
  getFieldAvailability,
  getBlockedDates,
} from '@/lib/services/availability';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

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
  const [availability, setAvailability] = useState({});
  const [availabilityList, setAvailabilityList] = useState({});
  const [blockedDate, setBlockedDate] = useState();
  const [blockedDatesList, setBlockedDatesList] = useState([]);
  const [newBlockedDatesList, setNewBlockedDatesList] = useState([]);
  const [isCardActive, setIsCardActive] = useState(
    daysOfWeek.reduce((acc, day) => ({ ...acc, [day]: true }), {})
  );
  const [disabledDays, setDisabledDays] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchFields = async () => {
      try {
        const fieldsData = await getUserFields();
        setFields(fieldsData);
        setSelectedField(fieldsData[0]); // Selecciona el primer campo
      } catch (error) {
        alert(error.message);
      }
    };

    fetchFields();
  }, []);

  useEffect(() => {
    const fetchFieldData = async () => {
      if (!selectedField) return;

      try {
        const weeklyAvailability = await getFieldAvailability(
          selectedField.field_id
        );

        const blockedDates = await getBlockedDates(selectedField.field_id);
        console.log(weeklyAvailability, blockedDates);

        const availabilityByDay = weeklyAvailability.reduce(
          (acc, availability) => {
            // Simplemente recortamos los últimos 3 caracteres de start_time y end_time
            const cleanStartTime = availability.start_time.slice(0, -3);
            const cleanEndTime = availability.end_time.slice(0, -3);

            acc[availability.day_of_week] = {
              start_time: cleanStartTime,
              end_time: cleanEndTime,
            };

            return acc;
          },
          {}
        );

        console.log(availabilityByDay);
        setAvailability(weeklyAvailability);
        setAvailabilityList(availabilityByDay);
        setBlockedDatesList(blockedDates);
        setNewBlockedDatesList(blockedDates);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchFieldData();
  }, [selectedField]);

  const handleSwitchChange = (day) => {
    const dayNumber = daysOfWeek.indexOf(day) + 1; // Obtener el número del día

    // Actualizar isCardActive
    setIsCardActive((prev) => ({ ...prev, [day]: !prev[day] }));

    // Actualizar el estado de disabledDays
    if (isCardActive[day]) {
      setDisabledDays((prev) => [...prev, dayNumber]); // Si se desactiva, añadir el día
    } else {
      setDisabledDays((prev) => prev.filter((d) => d !== dayNumber)); // Si se reactiva, quitar el día
    }
  };

  const handleBlockedDateList = (selectedRange) => {
    if (selectedRange) {
      // Añadir el nuevo rango a la lista existente de fechas bloqueadas
      setBlockedDatesList((prev) => [...prev, selectedRange]);

      // Mostrar en consola para verificar que se ha añadido correctamente
    }

    // Cerrar el modal después de guardar las fechas
    setShowModal(false);
  };

  useEffect(() => {
    console.log('Lista actualizada de fechas bloqueadas:', blockedDatesList);
  }, [blockedDatesList]);

  const handleModalClose = () => {
    setShowModal(false); // Cerrar el modal después de guardar las fechas
  };

  const handleModalOpen = () => {
    setShowModal(true);
  };

  const handleDeleteBlockedDate = (index) => {
    setBlockedDatesList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleConfirmChanges = async () => {
    try {
      // Enviar disponibilidad semanal solo si hay días con horarios definidos y están activos
      const availabilityData = Object.keys(availability).reduce((acc, day) => {
        const startTime = availability[day]?.startTime;
        const endTime = availability[day]?.endTime;

        if (startTime && endTime && isCardActive[day]) {
          acc.push({
            field_id: selectedField.field_id,
            day_of_week: daysOfWeek.indexOf(day) + 1,
            start_time: startTime,
            end_time: endTime,
            price: 60,
            available_durations: [60],
          });
        }
        return acc;
      }, []);

      if (availabilityData.length > 0) {
        console.log('Disponibilidad semanal:', availabilityData);
        await fetch('http://localhost:5000/api/availability/weekly', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(availabilityData),
        });
      }
      console.log('Fechas antes:', blockedDatesList);
      // Ajustar las fechas en blockedDates
      if (blockedDatesList && blockedDatesList.length > 0) {
        console.log('Fechas  before map:', blockedDatesList);
        const blockedData = blockedDatesList.map(({ from, to }) => ({
          field_id: selectedField.field_id,
          // Usar toLocaleDateString o una solución manual para mantener la zona horaria local
          start_time: from ? from.toLocaleDateString('en-CA') : null, // formato ISO pero en local
          end_time: to ? to.toLocaleDateString('en-CA') : null,
        }));
        console.log('Fechas bloqueadas after map:', blockedData);

        // Aquí podrías hacer el fetch para subir blockedData
        await fetch('http://localhost:5000/api/availability/blocked', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(blockedData),
        });
      } else {
        console.log(
          'No hay fechas bloqueadas seleccionadas.',
          blockedDatesList
        );
      }
    } catch (error) {
      console.error('Error al confirmar cambios:', error);
    }
  };

  return (
    <div className="flex flex-col m-6 mx-auto w-3/4">
      {/* Header con Select a la derecha */}
      <div className="flex justify-between mb-4">
        <h1 className="text-3xl font-bold">Gestionar {selectedField?.name}</h1>
        <Select
          onValueChange={(value) => setSelectedField(JSON.parse(value))}
          defaultValue={selectedField ? JSON.stringify(selectedField) : ''}
        >
          <SelectTrigger className="w-64 text-black bg-white">
            <SelectValue placeholder="Selecciona un campo" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {fields.map((field) => (
              <SelectItem
                key={field.field_id}
                value={JSON.stringify(field)}
                className="text-black"
              >
                {field.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-10">
        {/* Sección Horarios a la izquierda */}
        <div>
          <h2 className="text-lg font-bold mb-2 text-center">
            Horas de abertura
          </h2>
          {daysOfWeek.map((day, index) => (
            <Card
              key={day}
              className={`w-full h-auto text-white shadow-md rounded-md transition-opacity duration-300 mb-4 ${isCardActive[day] ? 'opacity-100' : 'opacity-50'}`}
            >
              <CardContent className="flex justify-between items-center">
                <div className="flex flex-col items-start space-y-2">
                  <CardTitle className="text-black text-lg">{day}</CardTitle>
                  <Switch
                    checked={isCardActive[day]}
                    onCheckedChange={() => handleSwitchChange(day)}
                    className="scale-75"
                  />
                </div>

                <div
                  className={`grid grid-cols-2 gap-2 ${isCardActive[day] ? '' : 'pointer-events-none'}`}
                >
                  <div>
                    <h1 className="text-sm text-gray-500">Desde</h1>
                    <Select
                      onValueChange={(value) =>
                        setAvailability((prev) => ({
                          ...prev,
                          [day]: { ...prev[day], startTime: value },
                        }))
                      }
                      value={availability[day]?.startTime || ''}
                    >
                      <SelectTrigger className="w-full text-black bg-white">
                        <SelectValue
                          placeholder={
                            availabilityList[index + 1]?.start_time ||
                            'Abertura'
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 24 }, (_, i) => (
                          <SelectItem
                            key={i}
                            value={`${i.toString().padStart(2, '0')}:00`}
                          >
                            {`${i.toString().padStart(2, '0')}:00`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <h1 className="text-sm text-gray-500">Hasta</h1>
                    <Select
                      onValueChange={(value) =>
                        setAvailability((prev) => ({
                          ...prev,
                          [day]: { ...prev[day], endTime: value },
                        }))
                      }
                      value={availability[day]?.endTime || ''}
                    >
                      <SelectTrigger className="w-full text-black bg-white">
                        <SelectValue
                          placeholder={
                            availabilityList[index + 1]?.end_time || 'Cierre'
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 24 }, (_, i) => (
                          <SelectItem
                            key={i}
                            value={`${i.toString().padStart(2, '0')}:00`}
                          >
                            {`${i.toString().padStart(2, '0')}:00`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Sección Fechas Bloqueadas a la derecha */}
        <div>
          <h2 className="text-lg font-bold mb-4 text-center">
            Fechas Bloqueadas
          </h2>
          <Card className="w-full h-auto shadow-md rounded-md p-4">
            <CardContent className="flex justify-between">
              {/* Lista de fechas seleccionadas */}
              <div className="flex-1 mr-2">
                {blockedDatesList.length > 0 ? (
                  <ul className="space-y-2">
                    {blockedDatesList.map((range, index) => (
                      <li
                        key={index}
                        className="flex justify-between items-center"
                      >
                        <span>
                          {range.from
                            ? `Desde ${new Date(range.from).toISOString().split('T')[0]}`
                            : ''}
                          {range.to
                            ? ` hasta ${new Date(range.to).toISOString().split('T')[0]}`
                            : ''}
                        </span>

                        <button
                          onClick={() => handleDeleteBlockedDate(index)} // Función para eliminar la fecha
                          className="text-red-600 hover:text-red-800 ml-4"
                        >
                          <X size={20} /> {/* Usar el ícono de Lucide */}
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No hay fechas seleccionadas.</p>
                )}
              </div>

              {/* Botón de Añadir siempre en la esquina superior derecha */}
              <div className="flex-none">
                <Button onClick={handleModalOpen} className="ml-auto">
                  Añadir
                </Button>
              </div>
            </CardContent>
          </Card>

          <Button
            onClick={handleConfirmChanges}
            className="mt-8 w-full bg-blue-600 text-white"
          >
            Confirmar cambios
          </Button>
        </div>
      </div>

      {/* Modal para añadir fechas bloqueadas */}
      <Dialog open={showModal} onOpenChange={handleModalClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Añadir fechas bloqueadas</DialogTitle>
          </DialogHeader>
          <Calendar
            mode="range"
            selected={blockedDate}
            onSelect={setBlockedDate}
          />
          <DialogFooter>
            <Button onClick={handleModalClose}>Cerrar</Button>
            <Button onClick={() => handleBlockedDateList(blockedDate)}>
              Guardar fechas bloqueadas
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminFieldManagement;
