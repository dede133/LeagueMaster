// src/components/Map.js
'use client';
import React, { useState, useEffect } from 'react';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';

// Estilos y configuración del contenedor del mapa
const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

// Opciones de configuración para el mapa
const options = {
  disableDefaultUI: true,
  zoomControl: true,
};

// Coordenadas iniciales para centrar el mapa (opcional)
const defaultCenter = {
  lat: 40.4168, // Madrid, por ejemplo
  lng: -3.7038,
};

const Map = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_API_MAPS, // Reemplaza 'TU_API_KEY' con tu clave de API de Google Maps
  });

  const [markers, setMarkers] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(defaultCenter);

  useEffect(() => {
    // Obtener la ubicación actual del usuario
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });

          // Simula la obtención de campos cercanos de la API de tu backend
          fetchFieldsNearby(latitude, longitude);
        },
        (error) => console.error('Error obteniendo ubicación:', error)
      );
    } else {
      console.error('La geolocalización no es compatible con este navegador.');
    }
  }, []);

  const fetchFieldsNearby = (lat, lng) => {
    // Simula una llamada a tu API para obtener campos de fútbol cercanos
    // Aquí podrías llamar a tu backend con lat/lng y obtener una lista de campos cercanos
    const mockFields = [
      {
        id: 1,
        name: 'Campo 1',
        location: { lat: lat + 0.01, lng: lng + 0.01 },
      },
      {
        id: 2,
        name: 'Campo 2',
        location: { lat: lat - 0.01, lng: lng - 0.01 },
      },
      {
        id: 3,
        name: 'Campo 3',
        location: { lat: lat + 0.02, lng: lng + 0.02 },
      },
    ];
    setMarkers(mockFields);
  };

  if (loadError) return <p>Error cargando el mapa</p>;
  if (!isLoaded) return <p>Cargando...</p>;

  return (
    <div className="w-full md:w-2/3 lg:w-2/3 h-96 mx-auto mb-6">
      <GoogleMap
        mapContainerClassName="w-full h-full"
        zoom={14}
        center={currentLocation}
        options={options}
      >
        {markers.map((field) => (
          <Marker key={field.id} position={field.location} label={field.name} />
        ))}
      </GoogleMap>
    </div>
  );
};

export default Map;
