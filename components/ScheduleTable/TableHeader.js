const TableHeader = () => {
  const daysOfWeek = [
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
    'Domingo',
  ];

  return (
    <thead className="sticky top-0 bg-white z-10">
      <tr>
        <th className="sticky top-0 left-0 z-20 bg-white px-3 py-2 text-center text-sm">
          Horas / Días
        </th>
        {daysOfWeek.map((day, index) => (
          <th
            key={index}
            className="sticky top-0 bg-white px-3 py-2 text-center text-sm w-tableDays"
          >
            {day}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHeader;
