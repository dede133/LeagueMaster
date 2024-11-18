import { addDays, startOfWeek, format } from 'date-fns';

const TableHeader = (selectedDate) => {
  const daysOfWeek = [
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
    'Domingo',
  ];
  const startOfWeekDate = startOfWeek(selectedDate, { weekStartsOn: 1 });

  const daysOfWeekDate = Array.from({ length: 7 }, (_, i) =>
    addDays(startOfWeekDate, i)
  ); // Lista de días en la semana seleccionada

  return (
    <thead className=" bg-white z-10">
      <tr>
        <th className="sticky top-0 z-20 bg-white px-3 py-2 text-center text-sm">
          Horas / Días
        </th>
        {daysOfWeek.map((day, index) => (
          <th
            key={index}
            className="sticky top-0 z-20 bg-white px-3 py-2 text-center text-sm w-tableDays"
          >
            {day}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHeader;
