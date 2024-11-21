'use client';
import React, { useEffect, useState } from 'react';

const UserPayments = ({ userId }) => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const fetchPayments = async () => {
      // Lógica para obtener los pagos del usuario
    };

    if (userId) fetchPayments();
  }, [userId]);

  return (
    <div>
      <h3 className="text-lg font-bold mb-4">Historial de Pagos</h3>
      {payments.length > 0 ? (
        <ul>
          {payments.map((payment) => (
            <li key={payment.id} className="border p-2 mb-2 rounded">
              <p>
                <strong>Fecha:</strong> {payment.date}
              </p>
              <p>
                <strong>Monto:</strong> ${payment.amount}
              </p>
              <p>
                <strong>Método:</strong> {payment.method}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No tienes pagos registrados.</p>
      )}
    </div>
  );
};

export default UserPayments;
