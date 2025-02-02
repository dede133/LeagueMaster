'use client';
import { useState } from 'react';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CheckSquare } from 'lucide-react';

const fieldTypes = ['Fútbol 7', 'Fútbol 5', 'Fútbol Sala'];

const availableServices = [
  'Wi-Fi',
  'Aparcamiento gratuito',
  'Taquillas',
  'Vestuarios',
  'Cafetería',
];

const FieldConfiguration = ({ onSave }) => {
  const [mockedData, setMockedData] = useState({
    name: 'Campo dede',
    address: 'dedelandia',
    latitude: 3.21312,
    longitude: 3.123232,
    field_info: 'Campo de dedelandia',
    field_type: 'Fútbol 7',
    photo_url: 'foto.jpg',
    owner_user_id: 1,
    services: ['Wi-Fi', 'Taquillas'],
  });

  const handleMockUpdate = (field, value) => {
    setMockedData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleService = (service) => {
    setMockedData((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service],
    }));
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-2/3">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Configuración del Campo
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-lg font-medium mb-2">
              Nombre del campo
            </label>
            <Input
              value={mockedData.name}
              onChange={(e) => handleMockUpdate('name', e.target.value)}
              placeholder="Nombre del campo"
            />
          </div>
          <div>
            <label className="block text-lg font-medium mb-2">Dirección</label>
            <Input
              value={mockedData.address}
              onChange={(e) => handleMockUpdate('address', e.target.value)}
              placeholder="Dirección"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-lg font-medium mb-2">Latitud</label>
              <Input
                type="number"
                value={mockedData.latitude}
                onChange={(e) =>
                  handleMockUpdate('latitude', parseFloat(e.target.value))
                }
                placeholder="Latitud"
              />
            </div>
            <div>
              <label className="block text-lg font-medium mb-2">Longitud</label>
              <Input
                type="number"
                value={mockedData.longitude}
                onChange={(e) =>
                  handleMockUpdate('longitude', parseFloat(e.target.value))
                }
                placeholder="Longitud"
              />
            </div>
          </div>
          <div>
            <label className="block text-lg font-medium mb-2">
              Información del campo
            </label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded"
              value={mockedData.field_info}
              onChange={(e) => handleMockUpdate('field_info', e.target.value)}
              placeholder="Información detallada del campo"
            ></textarea>
          </div>
          <div>
            <label className="block text-lg font-medium mb-2">
              Tipo de campo
            </label>
            <Select
              value={mockedData.field_type}
              onValueChange={(value) => handleMockUpdate('field_type', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona el tipo de campo" />
              </SelectTrigger>
              <SelectContent>
                {fieldTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-lg font-medium mb-2">Foto URL</label>
            <Input
              value={mockedData.photo_url}
              onChange={(e) => handleMockUpdate('photo_url', e.target.value)}
              placeholder="URL de la foto del campo"
            />
          </div>
          <div>
            <label className="block text-lg font-medium mb-2">
              Propietario (ID)
            </label>
            <Input
              type="number"
              value={mockedData.owner_user_id}
              onChange={(e) =>
                handleMockUpdate('owner_user_id', parseInt(e.target.value))
              }
              placeholder="ID del propietario del campo"
            />
          </div>

          <div>
            <label className="block text-lg font-medium mb-2">
              Servicios disponibles
            </label>
            <div className="grid grid-cols-2 gap-2">
              {availableServices.map((service) => (
                <label
                  key={service}
                  className={`flex items-center space-x-2 p-2 border rounded-lg cursor-pointer ${
                    mockedData.services.includes(service)
                      ? 'bg-blue-100 border-blue-500'
                      : 'border-gray-300'
                  }`}
                  onClick={() => toggleService(service)}
                >
                  <input
                    type="checkbox"
                    checked={mockedData.services.includes(service)}
                    onChange={() => toggleService(service)}
                    className="hidden"
                  />
                  <span className="text-gray-700">{service}</span>
                </label>
              ))}
            </div>
          </div>

          <Button
            className="mt-6 w-full bg-blue-500 text-white hover:bg-blue-600"
            onClick={() => onSave(mockedData)}
          >
            Guardar Cambios
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FieldConfiguration;
