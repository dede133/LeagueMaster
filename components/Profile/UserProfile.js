// src/components/Profile/UserProfile.js
import React, { useState, useEffect } from 'react';

const UserProfile = ({ user }) => {
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  const handleSave = (e) => {
    e.preventDefault();
    // Lógica para guardar cambios en el perfil
  };

  return (
    <div>
      <h3 className="text-lg font-bold mb-4">Perfil de Usuario</h3>
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

export default UserProfile;
