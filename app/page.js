'use client';
import { useState, useEffect } from 'react';
import { fetchFields } from '@/lib/services/field';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import FeatureSection from '../components/FeatureSection';
import Link from 'next/link';
import CustomCarousel from '../components/CustomCarousel';

export default function Home() {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadFields = async () => {
      try {
        const fieldsData = await fetchFields();
        setFields(fieldsData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadFields();
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen">
      <section className="w-full text-center bg-gradient-to-r from-blue-500 to-purple-500 text-white py-16 px-4 rounded-md shadow-lg">
        <h1 className="text-4xl font-extrabold mb-4">
          Bienvenido a LeagueMaster
        </h1>
        <p className="text-lg md:text-xl mb-6">
          Gestiona tus reservas y organiza tus ligas de fútbol de manera
          sencilla y rápida.
        </p>
        <Link href="/register">
          <Button className="bg-white text-blue-500 hover:bg-gray-200 px-6 py-3">
            Regístrate Ahora
          </Button>
        </Link>
      </section>

      <section className="w-full px-4 sm:px-6 lg:px-8 mb-12">
        <FeatureSection />
      </section>

      <section className="w-full max-w-5xl px-4 mb-12">
        <h2 className="text-2xl font-bold text-center mb-6">
          Muchos campos disponibles
        </h2>
        {loading ? (
          <p className="text-center text-gray-500">Cargando campos...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : fields.length === 0 ? (
          <p className="text-center text-gray-500">No hay campos disponibles</p>
        ) : (
          <CustomCarousel items={fields} />
        )}
      </section>

      <section className="w-full text-center bg-gray-100 py-8 px-4 rounded-md shadow-lg">
        <h3 className="text-xl font-bold mb-4">¿Listo para comenzar?</h3>
        <p className="text-gray-700 mb-6">
          Regístrate y descubre la mejor forma de gestionar tus partidos y
          reservas.
        </p>
        <Link href="/register">
          <Button className="bg-blue-500 text-white hover:bg-blue-600 px-6 py-3">
            ¡Únete Hoy!
          </Button>
        </Link>
      </section>
    </div>
  );
}
