// src/components/Profile/UserReservations.js
import React, { useState, useEffect } from 'react';
import {
  getReservationsByUser,
  cancelReservation,
} from '@/lib/services/reservation';

const UserReservations = ({ userId }) => {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const data = await getReservationsByUser(userId);
        setReservations(data);
      } catch (error) {
        console.error('Error al obtener reservas:', error);
      }
    };

    if (userId) fetchReservations();
  }, [userId]);

  const handleCancelReservation = async (reservationId) => {
    if (!confirm('¿Estás seguro de que deseas cancelar esta reserva?')) return;

    try {
      await cancelReservation(reservationId);
      // Actualizar la lista de reservas después de cancelar
      setReservations((prevReservations) =>
        prevReservations.map((reservation) =>
          reservation.reservation_id === reservationId
            ? { ...reservation, status: 'cancelled' }
            : reservation
        )
      );
      alert('Reserva cancelada con éxito');
    } catch (error) {
      console.error('Error al cancelar la reserva:', error);
      alert('No se pudo cancelar la reserva');
    }
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-bold mb-4">Mis Reservas</h3>
      {reservations.length > 0 ? (
        <ul>
          {reservations.map((reservation) => (
            <li
              key={reservation.reservation_id}
              className="border p-2 mb-2 rounded"
            >
              <p>
                <strong>Fecha de Reserva:</strong>{' '}
                {new Date(reservation.reservation_date).toLocaleDateString()}
              </p>
              <p>
                <strong>Hora de Inicio:</strong>{' '}
                {reservation.reservation_start_time.slice(0, 5)}
              </p>
              <p>
                <strong>Hora de Fin:</strong>{' '}
                {reservation.reservation_end_time.slice(0, 5)}
              </p>
              <p>
                <strong>Precio:</strong> ${reservation.price}
              </p>
              <p>
                <strong>Estado:</strong> {reservation.status}
              </p>
              {reservation.status !== 'cancelled' && (
                <button
                  onClick={() =>
                    handleCancelReservation(reservation.reservation_id)
                  }
                  className="mt-2 bg-red-500 text-white px-4 py-1 rounded"
                >
                  Cancelar Reserva
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No tienes reservas activas.</p>
      )}
    </div>
  );
};

export default UserReservations;
