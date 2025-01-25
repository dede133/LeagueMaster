'use client';
import React, { useEffect, useState } from 'react';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

const options = {
  disableDefaultUI: true,
  zoomControl: true,
};

const Map = ({ latitude, longitude }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_API_MAPS,
  });

  const [mapCenter, setMapCenter] = useState(null);

  useEffect(() => {
    if (isLoaded && latitude && longitude) {
      const lat = Number(latitude);
      const lng = Number(longitude);

      if (!isNaN(lat) && !isNaN(lng)) {
        setMapCenter({ lat, lng });
      } else {
        console.error('Latitud o longitud no son números válidos:', lat, lng);
      }
    }
  }, [isLoaded, latitude, longitude]);

  if (loadError) return <p>Error cargando el mapa</p>;
  if (!isLoaded) return <p>Cargando...</p>;
  if (!mapCenter) return null;

  return (
    <div className="w-full h-96">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={14}
        center={mapCenter}
        options={options}
      >
        <Marker position={mapCenter} />
      </GoogleMap>
    </div>
  );
};

export default Map;
