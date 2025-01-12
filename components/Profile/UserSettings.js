'use client';
import React, { useState } from 'react';

const UserSettings = () => {
  // Datos mockeados iniciales
  const [settings, setSettings] = useState({
    name: 'Roger Tarres Mercader',
    email: 'roger.tarres@gmail.com',
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

  const handleSave = () => {
    alert('Cambios guardados:\n' + JSON.stringify(settings, null, 2));
  };

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <h3 className="text-lg font-bold mb-4">Configuración de Cuenta</h3>
      <div className="space-y-4">
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
          />
        </div>

        {/* Correo */}
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
          />
        </div>

        {/* Contraseña */}
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

        {/* Botón de guardar */}
        <div>
          <button
            onClick={handleSave}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
