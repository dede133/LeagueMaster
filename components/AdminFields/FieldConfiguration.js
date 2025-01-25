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

const FieldConfiguration = ({ onSave }) => {
  const [mockedData, setMockedData] = useState({
    name: 'Highlands',
    address:
      'Av. de Jacint Esteva Fontanet, 105, 08950 Esplugues de Llobregat, Barcelona',
    latitude: 41.38268,
    longitude: 2.089039,
    field_info: 'Información detallada del campo...',
    field_type: 'football',
    photo_url: 'foto.jpg',
    owner_user_id: 1,
  });

  const handleMockUpdate = (field, value) => {
    setMockedData((prev) => ({ ...prev, [field]: value }));
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
                <SelectItem value="football">Fútbol 5</SelectItem>
                <SelectItem value="basketball">Futbol 7</SelectItem>
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
