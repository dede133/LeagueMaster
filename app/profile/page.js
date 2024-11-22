// app/profile/pages.js
'use client';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import UserProfile from '@/components/Profile/UserProfile';
import UserReservations from '@/components/Profile/UserReservations';
import UserPayments from '@/components/Profile/UserPayments';
import UserNotifications from '@/components/Profile/UserNotifications';
import UserSettings from '@/components/Profile/UserSettings';

const ProfilePage = () => {
  const { user, loading, logoutUser } = useAuth();
  const [selectedTab, setSelectedTab] = useState('profile');
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login'); // Redirige si el usuario no está autenticado
    }
  }, [loading, user, router]);

  if (loading) return <div>Loading...</div>;

  const handleLogout = async () => {
    try {
      await logoutUser();
      router.push('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded shadow">
      {/* Tabs */}
      <div className="flex justify-between mb-6 border-b">
        {[
          { label: 'Mi Perfil', value: 'profile' },
          { label: 'Mis Reservas', value: 'reservations' },
          { label: 'Historial de Pagos', value: 'payments' },
          { label: 'Notificaciones', value: 'notifications' },
          { label: 'Configuración', value: 'settings' },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setSelectedTab(tab.value)}
            className={`px-4 py-2 ${
              selectedTab === tab.value
                ? 'font-bold border-b-2 border-blue-500'
                : 'text-gray-500'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {selectedTab === 'profile' && <UserProfile user={user} />}
        {selectedTab === 'reservations' && (
          <UserReservations userId={user.id} />
        )}
        {selectedTab === 'payments' && <UserPayments userId={user.id} />}
        {selectedTab === 'notifications' && (
          <UserNotifications userId={user.id} />
        )}
        {selectedTab === 'settings' && <UserSettings user={user} />}
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="mt-6 bg-red-500 text-white w-full py-2 rounded"
      >
        Cerrar Sesión
      </button>
    </div>
  );
};

export default ProfilePage;
