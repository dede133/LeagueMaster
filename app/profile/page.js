// src/pages/profile.js
'use client';
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import UserProfile from '@/components/Profile/UserProfile';
import UserReservations from '@/components/Profile/UserReservations';

const ProfilePage = () => {
  const { user, loading, logoutUser } = useAuth();
  const [selectedTab, setSelectedTab] = useState('profile');
  const router = useRouter();

  if (loading) return <div>Loading...</div>;
  if (!user) {
    router.push('/login');
    return null;
  }

  const handleLogout = async () => {
    try {
      await logoutUser();
      router.push('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <div className="flex justify-between mb-4">
        <button
          onClick={() => setSelectedTab('profile')}
          className={`px-4 py-2 ${selectedTab === 'profile' ? 'font-bold' : ''}`}
        >
          Mi Perfil
        </button>
        <button
          onClick={() => setSelectedTab('reservations')}
          className={`px-4 py-2 ${selectedTab === 'reservations' ? 'font-bold' : ''}`}
        >
          Mis Reservas
        </button>
      </div>
      {selectedTab === 'profile' && <UserProfile user={user} />}
      {selectedTab === 'reservations' && <UserReservations userId={user.id} />}
      <button
        onClick={handleLogout}
        className="mt-4 bg-red-500 text-white w-full py-2 rounded"
      >
        Cerrar Sesión
      </button>
    </div>
  );
};

export default ProfilePage;
