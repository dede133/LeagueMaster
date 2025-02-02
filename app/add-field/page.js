'use client';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { addField } from '@/lib/services/field';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import {
  MapPin,
  FileText,
  Image,
  Info,
  Plus,
  CheckSquare,
  Globe,
} from 'lucide-react';

const fieldTypes = ['Fútbol 7', 'Fútbol 5', 'Fútbol Sala'];

const availableServices = [
  'Wi-Fi',
  'Aparcamiento gratuito',
  'Taquillas',
  'Vestuarios',
  'Cafetería',
];

const AddField = () => {
  const { userRole, isAuthenticated } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [address, setAddress] = useState('');
  const [fieldType, setFieldType] = useState(fieldTypes[0]);
  const [fieldInfo, setFieldInfo] = useState('');
  const [services, setServices] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (isAuthenticated && userRole !== 'admin') {
      router.replace('/new-field');
    }
  }, [isAuthenticated, userRole, router]);

  if (isAuthenticated && userRole !== 'admin') {
    return null;
  }

  const toggleService = (service) => {
    setServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
  };

  const handleAddField = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('latitude', latitude || '');
    formData.append('longitude', longitude || '');
    formData.append('address', address || '');
    formData.append('field_type', fieldType || '');
    formData.append('field_info', fieldInfo || '');
    formData.append('services', JSON.stringify(services));

    for (let i = 0; i < photos.length; i++) {
      formData.append('photos', photos[i]);
    }

    try {
      const response = await addField(formData);

      console.log('Response del servidor:', response);

      if (response && response.field && response.field.field_id) {
        setMessage({
          type: 'success',
          text: 'Campo añadido con éxito. Redirigiendo...',
        });

        setTimeout(() => {
          router.push(`/admin-fields?fieldId=${response.field.field_id}`);
        }, 2000);
      } else {
        throw new Error('La respuesta no contiene el field_id.');
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al añadir el campo.' });
      console.error('Error al añadir el campo:', error);
    }
  };
  return (
    <div className="max-w-lg mx-auto mt-10 p-8 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <Plus className="mr-2 text-blue-500" /> Añadir nuevo campo
      </h2>

      <form onSubmit={handleAddField} className="space-y-5">
        <div>
          <label className="flex items-center text-gray-700 mb-1">
            <FileText className="mr-2 text-blue-500" /> Nombre del campo
          </label>
          <Input
            placeholder="Ej. Campo Municipal"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="flex items-center text-gray-700 mb-1">
            <MapPin className="mr-2 text-blue-500" /> Dirección
          </label>
          <Input
            placeholder="Ej. Calle Fútbol 123"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="flex items-center text-gray-700 mb-1">
              <Globe className="mr-2 text-blue-500" /> Latitud (opcional)
            </label>
            <Input
              type="text"
              placeholder="Ej. 40.7128"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
            />
          </div>
          <div>
            <label className="flex items-center text-gray-700 mb-1">
              <Globe className="mr-2 text-blue-500" /> Longitud (opcional)
            </label>
            <Input
              type="text"
              placeholder="Ej. -74.0060"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="flex items-center text-gray-700 mb-1">
            <Info className="mr-2 text-blue-500" /> Tipo de campo
          </label>
          <select
            value={fieldType}
            onChange={(e) => setFieldType(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500"
          >
            {fieldTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="flex items-center text-gray-700 mb-1">
            <Info className="mr-2 text-blue-500" /> Información del campo
          </label>
          <Textarea
            placeholder="Descripción breve del campo"
            value={fieldInfo}
            onChange={(e) => setFieldInfo(e.target.value)}
          />
        </div>

        <div>
          <label className="flex items-center text-gray-700 mb-1">
            <Image className="mr-2 text-blue-500" /> Fotos del campo
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setPhotos(e.target.files)}
            className="block w-full p-2 border border-gray-300 rounded-lg text-gray-700"
          />
        </div>

        <div>
          <label className="flex items-center text-gray-700 mb-1">
            <CheckSquare className="mr-2 text-blue-500" /> Servicios disponibles
          </label>
          <div className="grid grid-cols-2 gap-2">
            {availableServices.map((service) => (
              <label
                key={service}
                className={`flex items-center space-x-2 p-2 border rounded-lg cursor-pointer ${services.includes(service) ? 'bg-blue-100 border-blue-500' : 'border-gray-300'}`}
                onClick={() => toggleService(service)}
              >
                <input
                  type="checkbox"
                  checked={services.includes(service)}
                  onChange={() => toggleService(service)}
                  className="hidden"
                />
                <span className="text-gray-700">{service}</span>
              </label>
            ))}
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold transition-all duration-300"
        >
          Añadir campo
        </Button>

        {message.text && (
          <div
            className={`mt-4 p-3 text-white text-center rounded-lg ${message.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}
          >
            {message.text}
          </div>
        )}
      </form>
    </div>
  );
};

export default AddField;
