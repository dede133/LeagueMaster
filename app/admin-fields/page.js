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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getUserFields } from '@/lib/services/field';

const AdminFieldManagement = () => {
  const [fields, setFields] = useState([]);
  const [selectedField, setSelectedField] = useState(null);
  const [activeTab, setActiveTab] = useState('reservas');

  useEffect(() => {
    const fetchFields = async () => {
      try {
        const fieldsData = await getUserFields();
        setFields(fieldsData);
        setSelectedField(fieldsData[0]);
      } catch (error) {
        console.error('Error al cargar campos:', error.message);
      }
    };

    fetchFields();
  }, []);

  const handleMockUpdate = (field, value) => {
    setMockedData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex flex-col m-6 mx-auto w-3/4">
      <div className="flex justify-between mb-4">
        <h1 className="text-3xl font-bold">Gestionar {selectedField?.name}</h1>
        <Select
          onValueChange={(value) => setSelectedField(JSON.parse(value))}
          defaultValue={selectedField ? JSON.stringify(selectedField) : ''}
        >
          <SelectTrigger className="w-64 text-black bg-white">
            <SelectValue placeholder="Selecciona un campo" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {fields.map((field) => (
              <SelectItem
                key={field.field_id}
                value={JSON.stringify(field)}
                className="text-black"
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
        <TabsList>
          <TabsTrigger value="reservas">Reservas</TabsTrigger>
          <TabsTrigger value="ligas">Ligas</TabsTrigger>
          <TabsTrigger value="modificar">Modificar Campo</TabsTrigger>
        </TabsList>

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
      </Tabs>
    </div>
  );
};

export default AdminFieldManagement;
