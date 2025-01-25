'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getAllLeagues } from '@/lib/services/league';
import SearchFilter from '@/components/SearchFilter';

export default function LeaguesPage() {
  const [leagues, setLeagues] = useState([]);
  const [filteredLeagues, setFilteredLeagues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [fieldType, setFieldType] = useState('');
  const [fieldSize, setFieldSize] = useState('');

  useEffect(() => {
    const fetchLeagues = async () => {
      try {
        const leaguesData = await getAllLeagues();
        setLeagues(leaguesData);
        setFilteredLeagues(leaguesData);
      } catch (error) {
        setError('Error al cargar las ligas.');
        console.error('Error:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLeagues();
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    filterLeagues(value, selectedDate, fieldType, fieldSize);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    filterLeagues(search, date, fieldType, fieldSize);
  };

  const filterLeagues = (searchValue, dateValue, typeValue, sizeValue) => {
    const filtered = leagues.filter((league) => {
      const matchesSearch =
        searchValue === '' ||
        league.name.toLowerCase().includes(searchValue) ||
        (league.address && league.address.toLowerCase().includes(searchValue));
      const matchesDate =
        !dateValue ||
        (new Date(league.start_date) <= dateValue &&
          new Date(league.end_date) >= dateValue);
      const matchesType = typeValue === '' || league.field_type === typeValue;
      const matchesSize = sizeValue === '' || league.field_size === sizeValue;

      return matchesSearch && matchesDate && matchesType && matchesSize;
    });

    setFilteredLeagues(filtered);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 space-y-8">
      <section className="w-full text-center bg-gradient-to-r from-green-500 to-teal-500 text-white py-12 px-4 rounded-md shadow-lg">
        <h1 className="text-3xl font-extrabold">Explora Nuestras Ligas</h1>
        <p className="text-lg md:text-xl mt-4">
          Participa en las mejores ligas de fútbol y demuestra tu talento.
        </p>
      </section>

      <div className="w-full max-w-5xl px-6">
        <SearchFilter
          search={search}
          handleSearchChange={handleSearchChange}
          selectedDate={selectedDate}
          handleDateChange={handleDateChange}
          fieldType={fieldType}
          setFieldType={setFieldType}
          fieldSize={fieldSize}
          setFieldSize={setFieldSize}
        />
      </div>

      <section className="w-full max-w-5xl px-6">
        {loading ? (
          <p className="text-center text-gray-500">Cargando ligas...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : filteredLeagues.length === 0 ? (
          <p className="text-center text-gray-500">No hay ligas disponibles</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLeagues.map((league) => (
              <div
                key={league.league_id}
                className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
              >
                <img
                  src={`http://localhost:5000/${league.photo_url}`}
                  alt={`Campo de ${league.name}`}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />

                <h3 className="text-lg font-bold">{league.name}</h3>
                <p className="text-gray-600">
                  {league.address || 'Sin dirección disponible'}
                </p>

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

      <section className="w-full text-center bg-gray-100 py-8 px-4 rounded-md shadow-lg">
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
