'use client';
import React, { useState } from 'react';

const UserSettings = ({ user }) => {
  const [settings, setSettings] = useState({
    name: user?.name || 'Roger Tarres Mercader',
    email: user?.email || 'roger.tarres.mercader@gmail.com',
    password: '',
    notifications: true,
    darkMode: false,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSettings((prevSettings) => ({
      ...prevSettings,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setSettings((prevSettings) => ({
      ...prevSettings,
      [name]: checked,
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    alert('Cambios guardados:\n' + JSON.stringify(settings, null, 2));
  };

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <h3 className="text-lg font-bold mb-4">
        Perfil de usuario y configuración
      </h3>
      <form onSubmit={handleSave} className="space-y-4">
        {/* Nombre */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre
          </label>
          <input
            type="text"
            name="name"
            value={settings.name}
            onChange={handleInputChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Correo electrónico */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Correo electrónico
          </label>
          <input
            type="email"
            name="email"
            value={settings.email}
            onChange={handleInputChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Cambiar contraseña */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cambiar Contraseña
          </label>
          <input
            type="password"
            name="password"
            value={settings.password}
            onChange={handleInputChange}
            placeholder="Nueva contraseña"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Notificaciones */}
        <div className="flex items-center">
          <input
            type="checkbox"
            name="notifications"
            checked={settings.notifications}
            onChange={handleCheckboxChange}
            className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 text-sm font-medium text-gray-700">
            Recibir notificaciones por correo
          </label>
        </div>

        {/* Guardar cambios */}
        <div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
          >
            Guardar cambios
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserSettings;
