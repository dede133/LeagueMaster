'use client';
import { useState, useEffect } from 'react';
import { getFieldDetails } from '@/lib/services/field';
import CustomCarousel from '../../../components/CustomCarousel';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const FieldDetails = ({ params }) => {
  const { field_id } = params; // Aquí obtienes el field_id directamente de params
  const [field, setField] = useState(null); // Estado para almacenar los datos del campo
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFieldDetails = async () => {
      if (!field_id) return;

      try {
        const fieldData = await getFieldDetails(field_id);
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
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-2 p-8">
          {/* Columna Principal (2 tarjetas principales en el centro) */}
          <div className="lg:col-span-3 space-y-4">
            {/* Card 1: Horario de Pistas */}
            <Card className="w-full h-auto shadow-md">
              <CardHeader>
                <CardTitle>Mapa de reservas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-2">
                  <div className="bg-gray-100 p-2 rounded">Lunes</div>
                  <div className="bg-gray-100 p-2 rounded">Martes</div>
                  <div className="bg-gray-100 p-2 rounded">Miercoles</div>
                  <div className="bg-gray-100 p-2 rounded">Jueves</div>
                  <div className="bg-gray-100 p-2 rounded">Viernes</div>
                  <div className="bg-gray-100 p-2 rounded">Sabado</div>
                </div>
              </CardContent>
            </Card>

            {/* Card 2: Información del Club */}
            <Card className="w-full h-auto lg:max-w-4xl shadow-md">
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

            <Card className="w-full h-auto lg:max-w-4xl shadow-md">
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
                <iframe
                  className="w-full h-48 rounded"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3105!2d-3.703!3d40.4167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd422!2sForus Caja Mágica"
                  allowFullScreen=""
                  loading="lazy"
                ></iframe>
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
        {/* Aquí puedes añadir más detalles sobre el campo */}
      </div>
    </>
  );
};

export default FieldDetails;
