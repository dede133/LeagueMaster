import { useState, useEffect } from 'react';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';

const AvailabilityDatesManager = ({ daysOfWeek, availability, onUpdate }) => {
  const [currentAvailability, setCurrentAvailability] = useState(
    Array(7).fill({
      day_of_week: '',
      start_time: '',
      end_time: '',
      isActive: false,
    })
  );

  useEffect(() => {
    if (availability) {
      const initialAvailability = Array(7)
        .fill(null)
        .map((_, index) => ({
          ...availability[index],
          isActive: !!availability[index],
          day_of_week: index,
        }));
      setCurrentAvailability(initialAvailability);
    }
  }, [availability]);

  useEffect(() => {
    onUpdate({ newAvailability: currentAvailability });
  }, [currentAvailability, onUpdate]);

  const handleSwitchChange = (index) => {
    setCurrentAvailability((prev) => {
      const updatedAvailability = [...prev];
      updatedAvailability[index] = {
        ...updatedAvailability[index],
        isActive: !updatedAvailability[index].isActive,
      };
      return updatedAvailability;
    });
  };

  const handleAvailabilityChange = (index, key, value) => {
    setCurrentAvailability((prev) => {
      const updatedAvailability = [...prev];
      updatedAvailability[index] = {
        ...updatedAvailability[index],
        [key]: value,
      };
      return updatedAvailability;
    });
  };

  return (
    <div className="space-y-4">
      {daysOfWeek.map((day, index) => (
        <Card
          key={index}
          className={`text-white shadow-md rounded-md ${currentAvailability[index]?.isActive ? 'opacity-100' : 'opacity-50'}`}
        >
          <CardContent className="flex justify-between items-center">
            <div className="flex flex-col items-start space-y-2">
              <CardTitle className="text-black text-lg">{day}</CardTitle>
              <Switch
                checked={currentAvailability[index]?.isActive || false}
                onCheckedChange={() => handleSwitchChange(index)}
                className="scale-75"
              />
            </div>
            <div
              className={`grid grid-cols-2 gap-2 ${currentAvailability[index]?.isActive ? '' : 'pointer-events-none'}`}
            >
              <div>
                <h1 className="text-sm text-gray-500">Desde</h1>
                <Select
                  onValueChange={(value) =>
                    handleAvailabilityChange(index, 'start_time', value)
                  }
                  value={currentAvailability[index]?.start_time || ''}
                >
                  <SelectTrigger className="w-full text-black bg-white">
                    <SelectValue placeholder="Abertura" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 }, (_, i) => (
                      <SelectItem
                        key={i}
                        value={`${i.toString().padStart(2, '0')}:00`}
                      >{`${i.toString().padStart(2, '0')}:00`}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <h1 className="text-sm text-gray-500">Hasta</h1>
                <Select
                  onValueChange={(value) =>
                    handleAvailabilityChange(index, 'end_time', value)
                  }
                  value={currentAvailability[index]?.end_time || ''}
                >
                  <SelectTrigger className="w-full text-black bg-white">
                    <SelectValue placeholder="Cierre" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 }, (_, i) => (
                      <SelectItem
                        key={i}
                        value={`${i.toString().padStart(2, '0')}:00`}
                      >{`${i.toString().padStart(2, '0')}:00`}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AvailabilityDatesManager;
