import TableRow from './TableRow';

const TableBody = ({
  hours,
  schedule,
  setSchedule,
  user,
  field_id,
  selectedDate,
}) => {
  return (
    <tbody>
      {hours.map((hour, hourIndex) => (
        <TableRow
          key={hourIndex}
          hour={hour}
          schedule={schedule}
          setSchedule={setSchedule}
          user={user}
          field_id={field_id}
          hourIndex={hourIndex}
          selectedDate={selectedDate}
        />
      ))}
    </tbody>
  );
};

export default TableBody;
