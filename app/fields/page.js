// app/fields/pages.js
'use client';
import { useState, useEffect } from 'react';
import { fetchFields } from '@/lib/services/field';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import SearchFilter from '@/components/SearchFilter';

export default function FieldsPage() {
  const [fields, setFields] = useState([]);
  const [filteredFields, setFilteredFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedDate, setSelectedDate] = useState(null); // Fecha seleccionada
  const [fieldType, setFieldType] = useState(''); // Para el tipo de suelo
  const [fieldSize, setFieldSize] = useState(''); // Para el tamaño del campo

  useEffect(() => {
    const loadFields = async () => {
      try {
        const fieldsData = await fetchFields();
        setFields(fieldsData);
        setFilteredFields(fieldsData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadFields();
  }, []);

  const applyFilters = () => {
    let filtered = fields;

    if (search) {
      filtered = filtered.filter((field) =>
        field.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (fieldType) {
      filtered = filtered.filter((field) => field.type === fieldType);
    }

    if (fieldSize) {
      filtered = filtered.filter((field) => field.size === fieldSize);
    }

    if (selectedDate) {
      filtered = filtered.filter(
        (field) =>
          new Date(field.available_date).toLocaleDateString() ===
          selectedDate.toLocaleDateString()
      );
    }

    setFilteredFields(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [search, fieldType, fieldSize, selectedDate]);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50">
      <section className="w-full text-center bg-gradient-to-r from-blue-500 to-purple-500 text-white py-12 px-4 rounded-md shadow-lg mb-8">
        <h1 className="text-3xl font-extrabold">Descubre Nuestros Campos</h1>
        <p className="text-lg md:text-xl mt-4">
          Encuentra el campo perfecto para tus partidos y eventos.
        </p>
      </section>

      <section className="w-full max-w-5xl px-6 mb-8">
        <SearchFilter
          search={search}
          handleSearchChange={(e) => setSearch(e.target.value)}
          selectedDate={selectedDate}
          handleDateChange={setSelectedDate}
          fieldType={fieldType}
          setFieldType={setFieldType}
          fieldSize={fieldSize}
          setFieldSize={setFieldSize}
        />
      </section>
      <section className="w-full max-w-5xl px-6">
        {loading ? (
          <p className="text-center text-gray-500">Cargando campos...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : filteredFields.length === 0 ? (
          <p className="text-center text-gray-500">No hay campos disponibles</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFields.map((field) => (
              <div key={field.field_id} className="flex-shrink-0 p-2">
                <Link
                  href={`/fields/${field.field_id}`}
                  className="block bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow h-full flex flex-col"
                >
                  <div className="overflow-hidden rounded-t-lg flex-grow">
                    {field.photo_url && field.photo_url.length > 0 ? (
                      <img
                        src={`http://localhost:5000/${field.photo_url[0]}`}
                        alt={field.name}
                        className="w-full h-64 object-cover transition-transform duration-300 hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500">
                          No Image Available
                        </span>
                      </div>
                    )}
                  </div>
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg font-bold text-gray-800">
                      {field.name}
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      {field.address}
                    </CardDescription>
                  </CardHeader>
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
