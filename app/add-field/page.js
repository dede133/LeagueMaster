'use client';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { addField } from '@/lib/services/field';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

const AddField = () => {
  const { userRole, isAuthenticated } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [address, setAddress] = useState('');
  const [fieldType, setFieldType] = useState('');
  const [fieldInfo, setFieldInfo] = useState('');
  const [features, setFeatures] = useState('');
  const [availability, setAvailability] = useState('');
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    if (isAuthenticated && userRole !== 'admin') {
      router.replace('/new-field');
    }
  }, [isAuthenticated, userRole, router]);

  if (isAuthenticated && userRole !== 'admin') {
    return null;
  }
  const handleAddField = async (e) => {
    e.preventDefault();

    const parsedFeatures = features ? JSON.parse(features) : null;

    const parsedAvailability = availability ? JSON.parse(availability) : null;

    const formData = new FormData();
    formData.append('name', name);
    formData.append('latitude', latitude || '');
    formData.append('longitude', longitude || '');
    formData.append('address', address || '');
    formData.append('field_type', fieldType || '');
    formData.append('field_info', fieldInfo || '');
    formData.append('features', features || '');
    formData.append('availability', availability || '');

    for (let i = 0; i < photos.length; i++) {
      formData.append('photos', photos[i]);
    }

    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }

    try {
      await addField(formData);
      alert('Campo añadido con éxito');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Añadir Nuevo Campo</h2>
      <form onSubmit={handleAddField}>
        <Input
          placeholder="Nombre del Campo"
          className="mb-4 mt-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          type="text"
          placeholder="Dirección"
          className="mb-4"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <Input
          type="text"
          placeholder="Tipo de Campo"
          className="mb-4"
          value={fieldType}
          onChange={(e) => setFieldType(e.target.value)}
        />
        <Textarea
          placeholder="Información del Campo"
          className="mb-4"
          value={fieldInfo}
          onChange={(e) => setFieldInfo(e.target.value)}
        />
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => setPhotos(e.target.files)}
          className="mb-4"
        />
        <Textarea
          placeholder="Características (JSON)"
          className="mb-4"
          value={features}
          onChange={(e) => setFeatures(e.target.value)}
        />
        <Textarea
          placeholder="Disponibilidad (JSON)"
          className="mb-4"
          value={availability}
          onChange={(e) => setAvailability(e.target.value)}
        />
        <Button type="submit" className="w-full">
          Añadir Campo
        </Button>
      </form>
    </div>
  );
};

export default AddField;
