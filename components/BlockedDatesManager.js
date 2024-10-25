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

const BlockedDatesManager = ({ initialBlockedDates, onUpdate }) => {
  const [blockedDatesList, setBlockedDatesList] = useState(
    initialBlockedDates || []
  );
  const [blockedDate, setBlockedDate] = useState();
  const [showModal, setShowModal] = useState(false);

  // Actualizar el estado cuando initialBlockedDates cambia
  useEffect(() => {
    setBlockedDatesList(initialBlockedDates);
  }, [initialBlockedDates]);

  const handleModalOpen = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleAddBlockedDate = () => {
    if (blockedDate) {
      // Formatear las fechas 'from' y 'to' para mantener la zona horaria local
      const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}T00:00:00.000Z`; // Mantener la hora fija en 00:00:00
      };

      const fromDate = formatDate(new Date(blockedDate.from));
      const toDate = blockedDate.to
        ? formatDate(new Date(blockedDate.to))
        : fromDate;

      // Crear el objeto con los valores formateados
      const newBlockedDate = { from: fromDate, to: toDate };

      // Verificar si la fecha o el rango ya existe en la lista
      const exists = blockedDatesList.some(
        (date) =>
          date.from === newBlockedDate.from && date.to === newBlockedDate.to
      );

      if (!exists) {
        const newList = [...blockedDatesList, newBlockedDate];
        setBlockedDatesList(newList);
        console.log(newList);
        onUpdate(newList); // Notificar al componente padre con la lista actualizada
      } else {
        alert('Esta fecha ya está bloqueada');
      }
    }
    setShowModal(false);
  };

  const handleDeleteBlockedDate = (index) => {
    const newList = blockedDatesList.filter((_, i) => i !== index);
    setBlockedDatesList(newList);
    console.log(newList);
    onUpdate(newList); // Notificar al componente padre con la lista actualizada
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
            <Button onClick={handleAddBlockedDate}>
              Guardar fechas bloqueadas
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BlockedDatesManager;
