'use client';
import React from 'react';
import { TrendingUp, Calendar, BarChart } from 'lucide-react';

const features = [
  {
    title: 'Gestión de Ligas',
    description:
      'Organiza y gestiona ligas de fútbol fácilmente con nuestras herramientas intuitivas.',
    icon: <TrendingUp className="w-8 h-8 text-blue-500" />,
  },
  {
    title: 'Reservas en Línea',
    description:
      'Reserva campos y partidos de forma rápida y segura desde cualquier dispositivo.',
    icon: <Calendar className="w-8 h-8 text-green-500" />,
  },
  {
    title: 'Estadísticas en Tiempo Real',
    description:
      'Sigue los resultados y estadísticas de los partidos en tiempo real.',
    icon: <BarChart className="w-8 h-8 text-purple-500" />,
  },
];

const FeatureSection = () => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-8">
          Características Destacadas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-center justify-center mb-4">
                <div className="bg-gray-100 p-3 rounded-full group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-lg font-semibold text-center mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-center">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
