'use client';
import { useState, useEffect } from 'react';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import ReservationManager from '../../components/AdminFields/ReservationManager';
import FieldLeaguesManager from '../../components/AdminFields/FieldLeaguesManager';
import FieldConfiguration from '../../components/AdminFields/FieldConfiguration';
import { getUserFields } from '@/lib/services/field';
import { MapPin, Settings, Calendar, ListChecks } from 'lucide-react';

import { useSearchParams } from 'next/navigation';

const AdminFieldManagement = () => {
  const searchParams = useSearchParams();
  const fieldIdFromUrl = searchParams.get('fieldId');

  const [fields, setFields] = useState([]);
  const [selectedField, setSelectedField] = useState(null);
  const [activeTab, setActiveTab] = useState('reservas');

  useEffect(() => {
    const fetchFields = async () => {
      try {
        const fieldsData = await getUserFields();
        setFields(fieldsData);

        if (fieldIdFromUrl) {
          const fieldFromUrl = fieldsData.find(
            (field) => field.field_id === parseInt(fieldIdFromUrl)
          );
          setSelectedField(fieldFromUrl || fieldsData[0]);
        } else {
          setSelectedField(fieldsData[0]);
        }
      } catch (error) {
        console.error('Error al cargar campos:', error.message);
      }
    };

    fetchFields();
  }, [fieldIdFromUrl]);

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">
          Gestionar {selectedField?.name}
        </h1>
        <Select
          onValueChange={(value) => setSelectedField(JSON.parse(value))}
          value={selectedField ? JSON.stringify(selectedField) : ''}
        >
          <SelectTrigger className="w-64 border border-gray-300 bg-white text-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500">
            <MapPin className="mr-2 text-blue-500" />
            <SelectValue placeholder="Selecciona un campo" />
          </SelectTrigger>
          <SelectContent className="bg-white shadow-md rounded-lg">
            {fields.map((field) => (
              <SelectItem
                key={field.field_id}
                value={JSON.stringify(field)}
                className="text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-md transition-all"
              >
                {field.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs
        defaultValue="reservas"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="flex justify-center bg-gray-100 p-2 rounded-lg">
          <TabsTrigger
            value="reservas"
            className="px-4 py-2 flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-all"
          >
            <Calendar className="w-4 h-4" />
            <span>Reservas</span>
          </TabsTrigger>
          <TabsTrigger
            value="ligas"
            className="px-4 py-2 flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-all"
          >
            <ListChecks className="w-4 h-4" />
            <span>Ligas</span>
          </TabsTrigger>
          <TabsTrigger
            value="modificar"
            className="px-4 py-2 flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-all"
          >
            <Settings className="w-4 h-4" />
            <span>Modificar Campo</span>
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="reservas">
            {selectedField && (
              <ReservationManager fieldId={selectedField.field_id} />
            )}
          </TabsContent>

          <TabsContent value="ligas">
            {selectedField && (
              <FieldLeaguesManager fieldId={selectedField.field_id} />
            )}
          </TabsContent>

          <TabsContent value="modificar">
            <FieldConfiguration />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default AdminFieldManagement;
