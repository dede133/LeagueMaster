// app/fields/pages.js
'use client';
import { useState, useEffect } from 'react';
import { fetchFields } from '@/lib/services/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function FieldsPage() {
  const [fields, setFields] = useState([]);
  const [filteredFields, setFilteredFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [showCalendar, setShowCalendar] = useState(false); // Control del calendario
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

  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    setFilteredFields(
      fields.filter((field) => field.name.toLowerCase().includes(value))
    );
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="w-full text-center bg-gradient-to-r from-blue-500 to-purple-500 text-white py-12 px-4 rounded-md shadow-lg mb-8">
        <h1 className="text-3xl font-extrabold">Descubre Nuestros Campos</h1>
        <p className="text-lg md:text-xl mt-4">
          Encuentra el campo perfecto para tus partidos y eventos.
        </p>
      </section>

      {/* Filtros */}
      <section className="w-full max-w-5xl px-6 mb-8">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 shadow-lg rounded-xl p-6 flex flex-wrap gap-6 items-center">
          {/* Buscar por ubicación */}
          <div className="flex-1">
            <Input
              value={search}
              onChange={handleSearchChange}
              placeholder="Buscar por ubicación (e.g., Madrid, Calle Tal)"
              className="w-full bg-white rounded-full px-8 py-4 text-base text-gray-700 shadow-sm border border-gray-300 focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-300"
            />
          </div>

          {/* Selector de fecha */}
          <div className="relative">
            <Button
              className="bg-white rounded-full px-4 py-2 text-sm text-gray-700 shadow-sm flex items-center justify-between w-44 border border-gray-300 focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-300"
              onClick={() => setShowCalendar(!showCalendar)}
            >
              {selectedDate ? (
                <span>{selectedDate.toLocaleDateString('es-ES')}</span>
              ) : (
                <span className="text-gray-500">Seleccionar Fecha</span>
              )}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </Button>
            {showCalendar && (
              <div className="absolute z-10 bg-white border border-gray-300 shadow-xl rounded-xl p-4 mt-2">
                <Calendar
                  selected={selectedDate}
                  onChange={(date) => {
                    setSelectedDate(date);
                    setShowCalendar(false);
                    handleDateChange(date);
                  }}
                />
              </div>
            )}
          </div>

          {/* Tipo de suelo */}
          <Select
            value={fieldType}
            onValueChange={(value) => setFieldType(value)}
          >
            <SelectTrigger className="w-44 rounded-full bg-white shadow-sm border border-gray-300 text-sm focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-300">
              <SelectValue placeholder="Tipo de Suelo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="placeholder" disabled>
                Tipo de Suelo
              </SelectItem>
              <SelectItem value="Césped">Césped</SelectItem>
              <SelectItem value="Tierra">Tierra</SelectItem>
              <SelectItem value="Sintético">Sintético</SelectItem>
            </SelectContent>
          </Select>

          {/* Tamaño del campo */}
          <Select
            value={fieldSize}
            onValueChange={(value) => setFieldSize(value)}
          >
            <SelectTrigger className="w-44 rounded-full bg-white shadow-sm border border-gray-300 text-sm focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-300">
              <SelectValue placeholder="Tamaño del Campo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="placeholder" disabled>
                Tamaño del Campo
              </SelectItem>
              <SelectItem value="Fut5">Fut5</SelectItem>
              <SelectItem value="Fut7">Fut7</SelectItem>
              <SelectItem value="Fut11">Fut11</SelectItem>
            </SelectContent>
          </Select>

          {/* Botón de Buscar */}
          <Button className="bg-blue-500 text-white hover:bg-blue-600 px-6 py-3 text-sm rounded-full shadow-lg transition duration-300">
            Buscar
          </Button>
        </div>
      </section>

      {/* Lista de Campos */}
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
