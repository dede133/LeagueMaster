// src/components/FeatureSection.js
'use client';
import React from 'react';

const FeatureSection = () => {
  return (
    <section className="py-8 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-4 md:p-6 rounded shadow">
            <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-4">
              Gestión de Ligas
            </h3>
            <p className="text-sm md:text-base text-gray-700">
              Organiza y gestiona ligas de fútbol fácilmente con nuestras
              herramientas intuitivas.
            </p>
          </div>

          <div className="bg-white p-4 md:p-6 rounded shadow">
            <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-4">
              Reservas en Línea
            </h3>
            <p className="text-sm md:text-base text-gray-700">
              Reserva campos y partidos de forma rápida y segura desde cualquier
              dispositivo.
            </p>
          </div>

          <div className="bg-white p-4 md:p-6 rounded shadow">
            <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-4">
              Estadísticas en Tiempo Real
            </h3>
            <p className="text-sm md:text-base text-gray-700">
              Sigue los resultados y estadísticas de los partidos en tiempo
              real.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
