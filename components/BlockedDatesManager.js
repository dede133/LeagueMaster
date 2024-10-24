// BlockedDatesManager.js
'use client';
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';

const BlockedDatesManager = ({ fieldId, initialBlockedDates, onUpdate }) => {
  const [blockedDatesList, setBlockedDatesList] = useState(
    initialBlockedDates || []
  );
  const [blockedDate, setBlockedDate] = useState();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setBlockedDatesList(initialBlockedDates);
  }, [initialBlockedDates]);

  const handleModalOpen = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleAddBlockedDate = (selectedRange) => {
    if (selectedRange) {
      setBlockedDatesList((prev) => [...prev, selectedRange]);
    }
    setShowModal(false);
  };

  const handleDeleteBlockedDate = (index) => {
    setBlockedDatesList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleConfirmChanges = async () => {
    try {
      // Find new dates to add and dates to remove based on the initialBlockedDates
      const datesToAdd = blockedDatesList.filter(
        (newDate) =>
          !initialBlockedDates.some(
            (initialDate) =>
              initialDate.from === newDate.from && initialDate.to === newDate.to
          )
      );

      const datesToRemove = initialBlockedDates.filter(
        (initialDate) =>
          !blockedDatesList.some(
            (newDate) =>
              newDate.from === initialDate.from && newDate.to === initialDate.to
          )
      );

      // Call the API or pass the updates back to the parent component
      if (datesToAdd.length > 0) {
        await fetch('/api/addBlockedDates', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(datesToAdd),
        });
      }

      if (datesToRemove.length > 0) {
        await fetch('/api/removeBlockedDates', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(datesToRemove),
        });
      }

      // Update the parent component's state
      onUpdate(blockedDatesList);
    } catch (error) {
      console.error('Error al confirmar cambios:', error);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-bold mb-4 text-center">Fechas Bloqueadas</h2>
      <Card className="w-full h-auto shadow-md rounded-md p-4">
        <CardContent className="flex justify-between">
          <div className="flex-1 mr-2">
            {blockedDatesList.length > 0 ? (
              <ul className="space-y-2">
                {blockedDatesList.map((range, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <span>
                      {range.from
                        ? `Desde ${new Date(range.from).toISOString().split('T')[0]}`
                        : ''}
                      {range.to
                        ? ` hasta ${new Date(range.to).toISOString().split('T')[0]}`
                        : ''}
                    </span>

                    <button
                      onClick={() => handleDeleteBlockedDate(index)}
                      className="text-red-600 hover:text-red-800 ml-4"
                    >
                      <X size={20} />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No hay fechas seleccionadas.</p>
            )}
          </div>

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
            <Button onClick={() => handleAddBlockedDate(blockedDate)}>
              Guardar fechas bloqueadas
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BlockedDatesManager;
