// app/admin-fields/pages.js
'use client';
import { useState, useEffect, use } from 'react';
import { getUserFields } from '@/lib/services/field';
import {
  getFieldAvailability,
  getBlockedDates,
  removeBlockedDates,
  addBlockedDates,
  saveWeeklyAvailability,
  deleteWeeklyAvailability,
} from '@/lib/services/availability';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';

import BlockedDatesManager from '../../components/AdminFields/BlockedDatesManager';
import AvailabilityDatesManager from '@/components/AdminFields/AvailabilityDatesManager';

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
  const [blockedDatesList, setBlockedDatesList] = useState([]);
  const [datesToAdd, setDatesToAdd] = useState([]);
  const [datesToRemove, setDatesToRemove] = useState([]);
  const [updatedBlockedDatesList, setUpdatedBlockedDatesList] = useState([]);
  const [isCardActive, setIsCardActive] = useState(
    daysOfWeek.reduce((acc, day) => ({ ...acc, [day]: true }), {})
  );
  const [disabledDays, setDisabledDays] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [availabilityToAdd, setAvailabilityToAdd] = useState({});
  const [availabilityToDelete, setAvailabilityToDelete] = useState({});

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
        const simplifiedBlockedDates = blockedDates.map(({ from, to }) => ({
          from,
          to,
        }));
        const availabilityByDay = weeklyAvailability.reduce(
          (acc, availability) => {
            // Simplificar los tiempos eliminando segundos
            const cleanStartTime = availability.start_time.slice(0, -3);
            const cleanEndTime = availability.end_time.slice(0, -3);

            // Asignar solo los datos esenciales, incluyendo `day_of_week`
            acc[availability.day_of_week] = {
              day_of_week: availability.day_of_week,
              start_time: cleanStartTime,
              end_time: cleanEndTime,
            };

            return acc;
          },
          {}
        );
        console.log(weeklyAvailability, availabilityByDay);
        setAvailability(availabilityByDay);
        setAvailabilityList(availabilityByDay);
        setBlockedDatesList(simplifiedBlockedDates);
        setUpdatedBlockedDatesList(simplifiedBlockedDates);
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

  const handleConfirmChanges = async () => {
    try {
      await saveWeeklyAvailabilityData();
      await manageBlockedDates();
    } catch (error) {
      console.error('Error al confirmar cambios:', error);
    }
  };

  // Encapsulamos la lógica de guardar disponibilidad semanal en una función asíncrona separada
  const saveWeeklyAvailabilityData = async () => {
    const availabilityToAdd = [];
    const availabilityToDelete = [];

    // Usamos `availabilityList` en lugar de `newAvailability`
    Object.values(availabilityList).forEach((dayInfo) => {
      const { day_of_week, start_time, end_time, isActive } = dayInfo;

      if (isActive && start_time && end_time) {
        // Añadir a `availabilityToAdd` si está activo y tiene `start_time` y `end_time`
        availabilityToAdd.push({
          field_id: selectedField.field_id,
          day_of_week,
          start_time,
          end_time,
          price: 60, // Precio constante
          available_durations: [60], // Duración fija
        });
      } else {
        // Añadir a `availabilityToDelete` si está inactivo o le faltan tiempos
        availabilityToDelete.push({
          day_of_week,
        });
      }
    });

    // Mostrar en consola los datos procesados
    console.log('Días para añadir:', availabilityToAdd);
    console.log('Días para borrar:', availabilityToDelete);

    // Guardar disponibilidad si hay datos en `availabilityToAdd`
    if (availabilityToAdd.length > 0) {
      try {
        await saveWeeklyAvailability(availabilityToAdd);
        console.log('Disponibilidad guardada exitosamente.');
      } catch (error) {
        console.error('Error al guardar la disponibilidad semanal:', error);
        throw error;
      }
    }

    // Aquí puedes manejar `availabilityToDelete` para pasarlo a la API de eliminación
    if (availabilityToDelete.length > 0) {
      console.log('Disponibilidad para eliminar:', availabilityToDelete);
      await deleteWeeklyAvailability(
        selectedField.field_id,
        availabilityToDelete
      ); // Llamada a la función para eliminar
    }
  };

  // Encapsulamos la lógica de gestionar fechas bloqueadas en una función asíncrona separada
  const manageBlockedDates = async () => {
    try {
      if (datesToAdd.length > 0) {
        console.log('Fechas a añadir:', datesToAdd);
        await addBlockedDates(datesToAdd, selectedField.field_id);
        console.log('Fechas bloqueadas añadidas correctamente.');
      }

      if (datesToRemove.length > 0) {
        console.log('Fechas a eliminar:', datesToRemove);
        await removeBlockedDates(datesToRemove, selectedField.field_id);
        console.log('Fechas bloqueadas eliminadas correctamente.');
      }

      // Reiniciar las listas después de completar las operaciones
      setDatesToAdd([]);
      setDatesToRemove([]);
    } catch (error) {
      console.error('Error al gestionar las fechas bloqueadas:', error);
      throw error;
    }
  };

  const handleUpdateBlockedDates = ({
    blockedDatesList,
    datesToAdd,
    datesToRemove,
  }) => {
    setBlockedDatesList(blockedDatesList);
    setDatesToAdd(datesToAdd);
    setDatesToRemove(datesToRemove);
  };
  const handleSaveChanges = ({ newAvailability }) => {
    console.log('onupdate', newAvailability);

    // Actualizamos `availabilityList` con los datos de `newAvailability`
    setAvailabilityList(newAvailability);
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

      {/* Layout responsive */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <h2 className="text-lg font-bold mb-2 text-center">
            Horas de abertura
          </h2>
          <AvailabilityDatesManager
            daysOfWeek={daysOfWeek}
            availability={availability}
            onUpdate={handleSaveChanges}
          />
        </div>

        <div className="mt-8 md:mt-0">
          <BlockedDatesManager
            fieldId={selectedField?.field_id}
            initialBlockedDates={blockedDatesList}
            onUpdate={handleUpdateBlockedDates}
          />
          <Button
            onClick={handleConfirmChanges}
            className="mt-8 w-full bg-blue-600 text-white"
          >
            Confirmar cambios
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminFieldManagement;
