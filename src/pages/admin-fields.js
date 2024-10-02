import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectGroup,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';

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
  const [availability, setAvailability] = useState({
    Lunes: [],
    Martes: [],
    Miércoles: [],
    Jueves: [],
    Viernes: [],
    Sábado: [],
    Domingo: [],
  });
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [price, setPrice] = useState('');
  const [blockedDates, setBlockedDates] = useState([]);
  const [activeTab, setActiveTab] = useState('Horarios'); // Estado para cambiar entre "Horarios" y "Fechas Bloqueadas"

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
          setFields(data.fields);
          setSelectedField(data.fields[0]);
        } else {
          alert('Error al cargar los campos.');
        }
      } catch (error) {
        console.error('Error al cargar los campos:', error);
      }
    };

    fetchFields();
  }, []);

  const handleAddTimeSlot = (day) => {
    if (!startTime || !endTime || !price) {
      alert('Por favor ingresa la hora de inicio, fin y precio.');
      return;
    }
    const newTimeSlot = { startTime, endTime, price };
    setAvailability((prev) => ({
      ...prev,
      [day]: [...prev[day], newTimeSlot],
    }));
    setStartTime('');
    setEndTime('');
    setPrice('');
  };

  const handleDateSelect = (dates) => setBlockedDates(dates);

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-lg font-bold mb-4">Campos</h2>
        <Select onValueChange={(value) => setSelectedField(JSON.parse(value))}>
          <SelectTrigger className="w-full">
            <SelectValue>
              {selectedField ? selectedField.name : 'Selecciona un campo'}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {fields.map((field) => (
                <SelectItem
                  key={field.field_id}
                  value={JSON.stringify(field)} // Convertir el objeto `field` a string
                >
                  {field.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* Botones para cambiar de vista */}
        <div className="mt-6 space-y-4">
          <Button
            className={`w-full ${activeTab === 'Horarios' ? 'bg-blue-600' : ''}`}
            onClick={() => setActiveTab('Horarios')}
          >
            Horarios
          </Button>
          <Button
            className={`w-full ${activeTab === 'Fechas Bloqueadas' ? 'bg-blue-600' : ''}`}
            onClick={() => setActiveTab('Fechas Bloqueadas')}
          >
            Fechas Bloqueadas
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6 bg-black">
          Gestionar {selectedField?.name}
        </h1>

        {activeTab === 'Horarios' && (
          <div className="bg-red-900 flex">
            {/* Horarios - Mostrar Cards por día de la semana */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {daysOfWeek.map((day) => (
                <Card key={day} className="w-3/4 mx-auto">
                  <CardHeader className="bg-gray-900 text-white textsiz">
                    <CardTitle>{day}</CardTitle>
                  </CardHeader>
                  <CardContent className="bg-gray-50">
                    <ScrollArea className="h-15 mb-4">
                      <div className="grid grid-cols-1 gap-2">
                        {availability[day].length ? (
                          availability[day].map((slot, index) => (
                            <div
                              key={index}
                              className="flex justify-between items-center text-gray-700"
                            >
                              <span>{`${slot.startTime} - ${slot.endTime} (€${slot.price})`}</span>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() =>
                                  setAvailability((prev) => ({
                                    ...prev,
                                    [day]: prev[day].filter(
                                      (_, i) => i !== index
                                    ),
                                  }))
                                }
                              >
                                Eliminar
                              </Button>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500">
                            No hay franjas horarias
                          </p>
                        )}
                      </div>
                    </ScrollArea>

                    <div className="grid grid-cols-3 gap-2 mt-2">
                      <Input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        placeholder="Inicio"
                      />
                      <Input
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        placeholder="Fin"
                      />
                      <Input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="Precio (€)"
                      />
                    </div>
                    <Button
                      className="mt-4 w-full"
                      onClick={() => handleAddTimeSlot(day)}
                    >
                      Añadir Franja Horaria
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'Fechas Bloqueadas' && (
          <div className="bg-blue-900">
            {/* Fechas Bloqueadas - Mostrar el calendario */}
            <h2 className="text-xl font-bold mb-4 text-gray-700">
              Fechas Bloqueadas
            </h2>
            <Calendar mode="multiple" onSelect={handleDateSelect} />
            <div className="mt-4">
              {blockedDates.length > 0 ? (
                <p className="text-gray-600">
                  Fechas bloqueadas:{' '}
                  {blockedDates
                    .map((date) => date.toLocaleDateString())
                    .join(', ')}
                </p>
              ) : (
                <p className="text-gray-500">No hay fechas bloqueadas.</p>
              )}
            </div>
          </div>
        )}

        <Button className="mt-8 w-full bg-blue-600 text-white">
          Confirmar Disponibilidad
        </Button>
      </div>
    </div>
  );
};

export default AdminFieldManagement;
