'use client';
import React, { memo } from 'react';
import { useState, useEffect } from 'react';
import { getFieldDetails } from '@/lib/services/field';
import {
  getFieldAvailability,
  getBlockedDatesByDate,
} from '@/lib/services/availability';
import { getReservationsByFieldAndDate } from '@/lib/services/reservation';
import { fetchUserData } from '@/lib/services/auth';
import CustomCarousel from '../../../components/CustomCarousel';
import ScheduleTable from '@/components/ScheduleTable/ScheduleTable';
import ServiceCard from '@/components/ServiceCard';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { startOfToday, addWeeks, format } from 'date-fns';

const FieldDetails = memo(({ params }) => {
  const { field_id } = params;
  const [field, setField] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [availability, setAvailability] = useState(null);
  const [blockedDates, setBlockedDates] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [user, setUser] = useState(null); // Estado para almacenar los datos del usuario
  // Obtener los detalles del campo y la disponibilidad
  useEffect(() => {
    const fetchFieldDetails = async () => {
      if (!field_id) return;
      try {
        const fieldData = await getFieldDetails(field_id); // Detalles del campo
        // Calcular el rango de las próximas dos semanas
        const today = startOfToday();
        const twoWeeksLater = addWeeks(today, 2);
        const startDate = format(today, 'yyyy-MM-dd');
        const endDate = format(twoWeeksLater, 'yyyy-MM-dd');
        // Hacer las peticiones de disponibilidad y fechas bloqueadas en paralelo
        const [weeklyAvailability, blockedDates, reservations] =
          await Promise.all([
            getFieldAvailability(field_id), // Disponibilidad semanal
            getBlockedDatesByDate(field_id, startDate, endDate), // Fechas bloqueadas dentro del rango
            getReservationsByFieldAndDate(field_id, startDate, endDate),
          ]);
        setAvailability(weeklyAvailability);
        setBlockedDates(blockedDates);
        setReservations(reservations);
        setField(fieldData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFieldDetails();
  }, [field_id]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await fetchUserData();
        setUser(userData);
      } catch (error) {
        console.error('Error al obtener los datos del usuario:', error);
      }
    };
    fetchUser();

    return () => {
      console.log('Cleaning up Fetch User effect');
    };
  }, []);

  if (loading) return <p>Cargando detalles del campo...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!field) return <p>No se encontró el campo</p>;

  return (
    <>
      <div className="relative w-full h-64 bg-gray-800">
        <img
          src={`http://localhost:5000/${field.photo_url[0]}`}
          alt={field.name}
          className="absolute w-full h-full object-cover"
        />
        <div className="absolute bottom-0 w-full px-8 mb-10 text-white">
          <div className="container mx-auto">
            <h1 className="text-4xl font-bold"> {field.name} </h1>
            <p className="mt-4">Dirección: {field.address}</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-2">
          {/* Columna Principal (2 tarjetas principales en el centro) */}
          <div className="lg:col-span-3 space-y-4">
            <Card className="w-full h-auto lg:max-w-4.5xl shadow-md">
              <CardHeader>
                <CardTitle>Horario de Pistas</CardTitle>
              </CardHeader>
              <CardContent className=" flex justify-center">
                <ScheduleTable
                  availability={availability}
                  blockedDates={blockedDates}
                  reservations={reservations}
                  user={user}
                  field_id={field_id}
                />
              </CardContent>
            </Card>

            {field.field_info && (
              <Card className="w-full h-auto lg:max-w-4.5xl shadow-md">
                <CardHeader>
                  <CardTitle>Informacion</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{field.field_info}</p>
                </CardContent>
              </Card>
            )}

            {field.photo_url && field.photo_url.length > 0 && (
              <Card className="w-full h-auto lg:max-w-4.5xl shadow-md">
                <CardContent>
                  <CustomCarousel
                    items={field.photo_url} // Pasamos el array de fotos
                    renderItem={(photoUrl) => (
                      <div>
                        <img
                          src={`http://localhost:5000/${photoUrl}`} // Mostrar la imagen usando su URL
                          alt={field.name}
                          className="w-full h-64 object-cover"
                        />
                      </div>
                    )}
                  />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Columna Derecha (Tarjetas más pequeñas alineadas a la derecha) */}
          <div className="space-y-4">
            {/* Card 4: Mapa */}
            {field.address && (
              <Card className="w-full h-auto lg:max-w-4.5xl shadow-md">
                <CardHeader>
                  <CardTitle>Ubicación</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mt-4">{field.address}</p>
                </CardContent>
              </Card>
            )}

            <ServiceCard services={field.services} />

            {field.field_type && (
              <Card>
                <CardHeader>
                  <CardTitle>Detalles</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mt-4">Tipo: {field.field_type}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  );
});

export default FieldDetails;
