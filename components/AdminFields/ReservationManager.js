'use client';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import AvailabilityDatesManager from '@/components/AdminFields/AvailabilityDatesManager';
import BlockedDatesManager from '@/components/AdminFields/BlockedDatesManager';
import {
  getFieldAvailability,
  getBlockedDates,
  saveWeeklyAvailability,
  deleteWeeklyAvailability,
  addBlockedDates,
  removeBlockedDates,
} from '@/lib/services/availability';

const daysOfWeek = [
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
  'Domingo',
];

const ReservationManager = ({ fieldId }) => {
  const [availability, setAvailability] = useState({});
  const [availabilityList, setAvailabilityList] = useState({});
  const [blockedDatesList, setBlockedDatesList] = useState([]);
  const [datesToAdd, setDatesToAdd] = useState([]);
  const [datesToRemove, setDatesToRemove] = useState([]);
  const [isCardActive, setIsCardActive] = useState(
    daysOfWeek.reduce((acc, day) => ({ ...acc, [day]: true }), {})
  );
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchFieldData = async () => {
      if (!fieldId) return;

      try {
        const weeklyAvailability = await getFieldAvailability(fieldId);
        const blockedDates = await getBlockedDates(fieldId);

        const simplifiedBlockedDates = blockedDates.map(({ from, to }) => ({
          from,
          to,
        }));

        const availabilityByDay = weeklyAvailability.reduce(
          (acc, availability) => {
            const cleanStartTime = availability.start_time.slice(0, -3);
            const cleanEndTime = availability.end_time.slice(0, -3);

            acc[availability.day_of_week] = {
              day_of_week: availability.day_of_week,
              start_time: cleanStartTime,
              end_time: cleanEndTime,
            };

            return acc;
          },
          {}
        );

        setAvailability(availabilityByDay);
        setAvailabilityList(availabilityByDay);
        setBlockedDatesList(simplifiedBlockedDates);
      } catch (error) {
        console.error('Error al cargar datos del campo:', error.message);
      }
    };

    fetchFieldData();
  }, [fieldId]);

  const handleSwitchChange = (day) => {
    setIsCardActive((prev) => ({ ...prev, [day]: !prev[day] }));
  };

  const handleConfirmChanges = async () => {
    try {
      await saveWeeklyAvailabilityData();
      await manageBlockedDates();
      setMessage({
        type: 'success',
        text: 'Los cambios se han guardado correctamente.',
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Hubo un error al guardar los cambios.',
      });
      console.error('Error al confirmar cambios:', error);
    }
  };

  const saveWeeklyAvailabilityData = async () => {
    const availabilityToAdd = [];
    const availabilityToDelete = [];

    Object.values(availabilityList).forEach((dayInfo) => {
      const { day_of_week, start_time, end_time, isActive } = dayInfo;

      if (isActive && start_time && end_time) {
        availabilityToAdd.push({
          field_id: fieldId,
          day_of_week,
          start_time,
          end_time,
          price: 60,
          available_durations: [60],
        });
      } else {
        availabilityToDelete.push({ day_of_week });
      }
    });

    if (availabilityToAdd.length > 0) {
      await saveWeeklyAvailability(availabilityToAdd);
    }

    if (availabilityToDelete.length > 0) {
      await deleteWeeklyAvailability(fieldId, availabilityToDelete);
    }
  };

  const manageBlockedDates = async () => {
    if (datesToAdd.length > 0) {
      await addBlockedDates(datesToAdd, fieldId);
    }
    if (datesToRemove.length > 0) {
      await removeBlockedDates(datesToRemove, fieldId);
    }
    setDatesToAdd([]);
    setDatesToRemove([]);
  };

  const handleBlockedDatesUpdate = ({
    blockedDatesList,
    datesToAdd,
    datesToRemove,
  }) => {
    setBlockedDatesList(blockedDatesList);
    setDatesToAdd(datesToAdd);
    setDatesToRemove(datesToRemove);
  };

  const handleSaveChanges = ({ newAvailability }) => {
    setAvailabilityList(newAvailability);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      <div>
        <h2 className="text-lg font-bold mb-2 text-center">
          Horas de abertura
        </h2>
        <AvailabilityDatesManager
          daysOfWeek={daysOfWeek}
          availability={availability}
          isCardActive={isCardActive}
          onSwitchChange={handleSwitchChange}
          onUpdate={handleSaveChanges}
        />
      </div>

      <div className="mt-8 md:mt-0">
        <BlockedDatesManager
          fieldId={fieldId}
          initialBlockedDates={blockedDatesList}
          onUpdate={handleBlockedDatesUpdate}
        />
        <Button
          onClick={handleConfirmChanges}
          className="mt-8 w-full bg-blue-600 text-white"
        >
          Confirmar cambios
        </Button>

        {message.text && (
          <div
            className={`mt-4 p-3 text-white text-center rounded-lg ${
              message.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            }`}
          >
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservationManager;
