// src/components/ServiceCard.js
import React from 'react';
import {
  Wifi,
  ParkingCircle, // Prueba este icono para "Aparcamiento gratuito"
  Lock,
  User, // Ícono alternativo para "Vestuarios"
  Coffee,
} from 'lucide-react'; // Importa los íconos necesarios de Lucide
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
// Mapa de iconos para cada servicio
const iconMap = {
  'Wi-Fi': <Wifi />,
  'Aparcamiento gratuito': <ParkingCircle />, // Cambiado a ParkingCircle
  Taquillas: <Lock />,
  Vestuarios: <User />, // Cambiado a User en vez de DressingRoom
  Cafeteria: <Coffee />,
};

const ServiceCard = ({ services }) => {
  // No renderizar nada si `services` es nulo, indefinido o está vacío
  if (!services || services.length === 0) {
    return null;
  }

  return (
    <Card className="w-full h-auto lg:max-w-4.5xl shadow-md">
      <CardHeader>
        <CardTitle>Servicios</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap space-x-4">
          {services.map((service) => (
            <div key={service} className="relative group p-2 text-center">
              <span className="text-2xl">
                {iconMap[service] || <span className="text-gray-500">?</span>}
              </span>
              <div className="absolute hidden group-hover:block bg-gray-700 text-white text-xs rounded p-1 -bottom-8 left-1/2 transform -translate-x-1/2">
                {service}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;
