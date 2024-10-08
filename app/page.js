'use client'; // Indica que esta página es un componente cliente

import React, { useState, useEffect } from 'react';
import FeatureSection from '../components/FeatureSection';
import Link from 'next/link';
import CustomCarousel from '../components/CustomCarousel';

export default function Home() {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFields = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/field');
        if (!response.ok) {
          throw new Error('Error al cargar los campos');
        }
        const data = await response.json();
        setFields(data.fields);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFields();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow p-4 md:p-6">
        <h1 className="text-2xl md:text-4xl font-bold text-center mb-4 md:mb-6">
          Bienvenido a LeagueMaster
        </h1>
        <p className="text-center text-base md:text-lg text-gray-700 mb-6 md:mb-6">
          La mejor plataforma para gestionar reservas de campos y ligas de
          fútbol.
        </p>

        {/* Sección de características */}
        <FeatureSection />

        {/* Carrusel de campos */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-center mb-4">
            Campos Disponibles
          </h2>
          {loading ? (
            <p className="text-center">Cargando campos...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : fields.length === 0 ? (
            <p className="text-center text-gray-700">
              No hay campos disponibles
            </p>
          ) : (
            <CustomCarousel
              items={fields}
              renderItem={(field) => (
                <div className="mb-4">
                  <img
                    src={`http://localhost:5000/${field.photo_url[0]}`}
                    alt={field.name}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <h3 className="text-lg font-bold mt-2">{field.name}</h3>
                  <p className="text-sm text-gray-600">{field.address}</p>
                  <Link
                    href={`/fields/${field.field_id}`}
                    className="text-blue-500"
                  >
                    Ver detalles
                  </Link>
                </div>
              )}
            />
          )}
        </div>

        {/* Botón de registro */}
        <div className="text-center mt-8">
          <Link
            href="/register"
            className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-700"
          >
            Regístrate aquí
          </Link>
        </div>
      </main>
    </div>
  );
}
