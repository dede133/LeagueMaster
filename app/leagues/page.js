'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getAllLeagues } from '@/lib/services/league'; // Importa la función correcta

export default function LeaguesPage() {
  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeagues = async () => {
      try {
        const leaguesData = await getAllLeagues();
        setLeagues(leaguesData);
      } catch (error) {
        setError('Error al cargar las ligas.');
        console.error('Error:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLeagues();
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="w-full text-center bg-gradient-to-r from-green-500 to-teal-500 text-white py-12 px-4 rounded-md shadow-lg mb-8">
        <h1 className="text-3xl font-extrabold">Explora Nuestras Ligas</h1>
        <p className="text-lg md:text-xl mt-4">
          Participa en las mejores ligas de fútbol y demuestra tu talento.
        </p>
      </section>

      {/* Lista de Ligas */}
      <section className="w-full max-w-5xl px-6">
        {loading ? (
          <p className="text-center text-gray-500">Cargando ligas...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : leagues.length === 0 ? (
          <p className="text-center text-gray-500">No hay ligas disponibles</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {leagues.map((league) => (
              <div
                key={league.league_id} // Usa league_id como clave única
                className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
              >
                {/* Imagen del campo */}
                <img
                  src={`http://localhost:5000/${league.photo_url}`}
                  alt={`Campo de ${league.name}`}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
                {/* Nombre y dirección */}
                <h3 className="text-lg font-bold">{league.name}</h3>
                <p className="text-gray-600">
                  {league.address || 'Sin dirección disponible'}
                </p>
                {/* Botón de detalles */}
                <Link
                  href={`/leagues/${league.league_id}`}
                  className="text-green-500 hover:underline mt-2 inline-block"
                >
                  Ver detalles
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Call-to-Action */}
      <section className="w-full text-center bg-gray-100 py-8 px-4 rounded-md shadow-lg mt-8">
        <h3 className="text-xl font-bold mb-4">
          ¿Quieres crear tu propia liga?
        </h3>
        <p className="text-gray-700 mb-6">
          Regístrate y empieza a gestionar ligas fácilmente.
        </p>
        <Link href="/register">
          <Button className="bg-green-500 text-white hover:bg-green-600 px-6 py-3">
            ¡Crear Liga!
          </Button>
        </Link>
      </section>
    </div>
  );
}
