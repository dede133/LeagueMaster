// src/pages/profile.js
'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useRequireAuth from '../../hooks/useRequireAuth';

const ProfilePage = () => {
  const { user, loading, error, setUser } = useRequireAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const router = useRouter();

  //useRequireAuth(user);

  useEffect(() => {
    // Actualiza los estados específicos cuando el usuario está cargado
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleSave = (e) => {
    e.preventDefault();
    // Lógica para guardar cambios
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        console.log('Sesión cerrada con éxito');
        router.push('/login');
      } else {
        console.error('Error al cerrar sesión');
      }
    } catch (error) {
      console.error('Error de red o del servidor:', error);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) {
      console.error('Usuario no encontrado');
      return;
    }

    if (
      !confirm(
        '¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.'
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/auth/user/${user.id}`,
        {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log('Cuenta eliminada con éxito');
        alert('Cuenta eliminada con éxito.');
        router.push('/');
      } else {
        console.error(data.message || 'Error al eliminar la cuenta.');
        alert(data.message || 'Error al eliminar la cuenta.');
      }
    } catch (error) {
      console.error('Error al eliminar la cuenta:', error);
      alert('Error al eliminar la cuenta.');
    }
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
      <button
        onClick={handleLogout}
        className="mt-4 bg-red-500 text-white w-full py-2 rounded"
      >
        Cerrar Sesión
      </button>
      <button
        onClick={handleDeleteAccount}
        className="mt-4 bg-red-700 text-white w-full py-2 rounded"
      >
        Eliminar Cuenta
      </button>
    </div>
  );
};

export default ProfilePage;
