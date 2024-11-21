'use client';
import React, { useEffect, useState } from 'react';

const UserNotifications = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      // Lógica para obtener notificaciones del usuario
    };

    if (userId) fetchNotifications();
  }, [userId]);

  return (
    <div>
      <h3 className="text-lg font-bold mb-4">Notificaciones</h3>
      {notifications.length > 0 ? (
        <ul>
          {notifications.map((notification) => (
            <li key={notification.id} className="border p-2 mb-2 rounded">
              <p>{notification.message}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No tienes notificaciones nuevas.</p>
      )}
    </div>
  );
};

export default UserNotifications;
