// src/pages/profile.js
import React, { useState } from 'react';

const ProfilePage = () => {
  const [name, setName] = useState('Nombre del Usuario');
  const [email, setEmail] = useState('usuario@ejemplo.com');

  const handleSave = (e) => {
    e.preventDefault();
    // Lógica para guardar cambios
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Perfil de Usuario</h2>
      <form onSubmit={handleSave}>
        <input
          type="text"
          placeholder="Nombre"
          className="w-full p-2 mb-4 border rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Correo electrónico"
          className="w-full p-2 mb-4 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white w-full py-2 rounded"
        >
          Guardar Cambios
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;
