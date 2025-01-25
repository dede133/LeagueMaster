'use client';
import React, { useRef, useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import Calendar from 'react-calendar';

const SearchFilter = ({
  search,
  handleSearchChange,
  selectedDate,
  handleDateChange,
  fieldType,
  setFieldType,
  fieldSize,
  setFieldSize,
}) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [showFieldTypeSelect, setShowFieldTypeSelect] = useState(false);
  const [showFieldSizeSelect, setShowFieldSizeSelect] = useState(false);

  const calendarRef = useRef(null);
  const fieldTypeRef = useRef(null);
  const fieldSizeRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
      if (
        fieldTypeRef.current &&
        !fieldTypeRef.current.contains(event.target)
      ) {
        setShowFieldTypeSelect(false);
      }
      if (
        fieldSizeRef.current &&
        !fieldSizeRef.current.contains(event.target)
      ) {
        setShowFieldSizeSelect(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-gradient-to-r from-gray-50 to-gray-100 shadow-lg rounded-xl p-6 flex flex-wrap gap-6 items-center">
      <div className="flex-1">
        <Input
          value={search}
          onChange={handleSearchChange}
          placeholder="Buscar por ubicación (e.g., Madrid, Calle Tal)"
          className="w-full bg-white rounded-full px-8 py-4 text-base text-gray-700 shadow-sm border border-gray-300 focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-300"
        />
      </div>

      <div className="relative" ref={calendarRef}>
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
                handleDateChange(date);
                setShowCalendar(false);
              }}
            />
          </div>
        )}
      </div>

      <div className="relative" ref={fieldTypeRef}>
        <Select
          value={fieldType}
          onValueChange={(value) => setFieldType(value)}
        >
          <SelectTrigger
            className="w-44 rounded-full bg-white shadow-sm border border-gray-300 text-sm focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-300"
            onClick={() => setShowFieldTypeSelect(!showFieldTypeSelect)}
          >
            <SelectValue placeholder="Tipo de Suelo" />
          </SelectTrigger>
          {showFieldTypeSelect && (
            <SelectContent>
              <SelectItem value="Césped">Césped</SelectItem>
              <SelectItem value="Tierra">Tierra</SelectItem>
              <SelectItem value="Sintético">Sintético</SelectItem>
            </SelectContent>
          )}
        </Select>
      </div>

      <div className="relative" ref={fieldSizeRef}>
        <Select
          value={fieldSize}
          onValueChange={(value) => setFieldSize(value)}
        >
          <SelectTrigger
            className="w-44 rounded-full bg-white shadow-sm border border-gray-300 text-sm focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-300"
            onClick={() => setShowFieldSizeSelect(!showFieldSizeSelect)}
          >
            <SelectValue placeholder="Tamaño del Campo" />
          </SelectTrigger>
          {showFieldSizeSelect && (
            <SelectContent>
              <SelectItem value="Fut5">Fut5</SelectItem>
              <SelectItem value="Fut7">Fut7</SelectItem>
              <SelectItem value="Fut11">Fut11</SelectItem>
            </SelectContent>
          )}
        </Select>
      </div>

      <Button className="bg-blue-500 text-white hover:bg-blue-600 px-6 py-3 text-sm rounded-full shadow-lg transition duration-300">
        Buscar
      </Button>
    </div>
  );
};

export default SearchFilter;
