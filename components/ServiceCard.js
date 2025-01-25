import React from 'react';
import { Wifi, ParkingCircle, Lock, User, Coffee } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const iconMap = {
  'Wi-Fi': <Wifi size={24} className="text-blue-500" />,
  'Aparcamiento gratuito': (
    <ParkingCircle size={24} className="text-green-500" />
  ),
  Taquillas: <Lock size={24} className="text-yellow-500" />,
  Vestuarios: <User size={24} className="text-indigo-500" />,
  Cafeteria: <Coffee size={24} className="text-red-500" />,
};

const ServiceCard = ({ services }) => {
  if (!services || services.length === 0) return null;

  return (
    <Card className="w-full h-auto lg:max-w-4xl shadow-md border border-gray-200">
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 items-center">
          {services.map((service) => (
            <div
              key={service}
              className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 group"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 group-hover:bg-gray-200 transition">
                {iconMap[service] || <span className="text-gray-400">?</span>}
              </div>
              <p className="mt-2 text-xs font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                {service}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;
