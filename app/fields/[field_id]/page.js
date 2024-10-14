'use client';
import { useState, useEffect } from 'react';
import { getFieldDetails } from '@/lib/services/field';
import { getFieldAvailability } from '@/lib/services/availability';
import CustomCarousel from '../../../components/CustomCarousel';
import ScheduleTable from '@/components/ScheduleTable';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const mockAvailability = [
  { day_of_week: 1, start_time: '03:00:00', end_time: '09:00:00', price: 60 },
  { day_of_week: 2, start_time: '09:00:00', end_time: '14:00:00', price: 60 },
];

const mockBlockedDates = [
  { start_time: '2024-10-18', end_time: null, reason: '' },
  { start_time: '2024-10-26', end_time: '2024-10-29', reason: '' },
];

const FieldDetails = ({ params }) => {
  const { field_id } = params;
  const [field, setField] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [availability, setAvailability] = useState(null);
  const [blockedDates, setBlockedDates] = useState([]);

  useEffect(() => {
    const fetchFieldDetails = async () => {
      if (!field_id) return;

      try {
        const fieldData = await getFieldDetails(field_id);
        const { weeklyAvailability, blockedDates } =
          await getFieldAvailability(field_id);

        setAvailability(weeklyAvailability);
        setBlockedDates(blockedDates);
        setField(fieldData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFieldDetails();
  }, [field_id]);

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
                />
              </CardContent>
            </Card>

            <Card className="w-full h-auto lg:max-w-4.5xl shadow-md">
              <CardHeader>
                <CardTitle>El club</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Forus Caja Mágica: la joya de la corona del pádel...</p>
                <p className="mt-4">
                  Las pistas de pádel y de tenis del club...
                </p>
                <p className="mt-4">
                  Sede del Mutua Madrid Open, el torneo más importante...
                </p>
              </CardContent>
            </Card>

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
          </div>

          {/* Columna Derecha (Tarjetas más pequeñas alineadas a la derecha) */}
          <div className="space-y-4">
            {/* Card 3: Oferta */}
            <Card className="lg:max-h-xl shadow-md">
              <CardHeader>
                <CardTitle>Recarga Bono Monedero 100€</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Regalo 15€</CardDescription>
                <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
                  Compra esta oferta
                </button>
              </CardContent>
            </Card>

            {/* Card 4: Mapa */}
            <Card>
              <CardHeader>
                <CardTitle>Ubicación</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mt-4">Camino de Perales, s/n, 28041</p>
              </CardContent>
            </Card>

            {/* Card 5: Servicios */}
            <Card>
              <CardHeader>
                <CardTitle>Servicios</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4">
                  <span className="bg-gray-100 py-1 px-2 rounded">
                    Vestuarios
                  </span>
                  <span className="bg-gray-100 py-1 px-2 rounded">
                    Accesible
                  </span>
                  <span className="bg-gray-100 py-1 px-2 rounded">
                    Ludoteca infantil
                  </span>
                  <span className="bg-gray-100 py-1 px-2 rounded">Tienda</span>
                  <span className="bg-gray-100 py-1 px-2 rounded">
                    Taquillas
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <p className="mt-4">Tipo: {field.field_type}</p>
        <p className="mt-4">{field.field_info}</p>
      </div>
    </>
  );
};

export default FieldDetails;
