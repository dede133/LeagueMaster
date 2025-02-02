'use client';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import UserProfile from '@/components/Profile/UserProfile';
import UserReservations from '@/components/Profile/UserReservations';
import UserPayments from '@/components/Profile/UserPayments';
import UserNotifications from '@/components/Profile/UserNotifications';
import UserSettings from '@/components/Profile/UserSettings';
import {
  User,
  CalendarCheck,
  CreditCard,
  Bell,
  Settings,
  LogOut,
} from 'lucide-react';

const Profile = () => {
  const { user, loading, logoutUser } = useAuth();
  const [selectedTab, setSelectedTab] = useState('profile');
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Cargando...
      </div>
    );

  const handleLogout = async () => {
    try {
      await logoutUser();
      router.push('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
        <User className="mr-2 text-blue-500" /> Panel de usuario
      </h2>

      {/* Tabs con estilo mejorado */}
      <div className="flex justify-between mb-6 border-b">
        {[
          {
            label: 'Mi perfil',
            value: 'profile',
            icon: <User className="w-4 h-4" />,
          },
          {
            label: 'Mis reservas',
            value: 'reservations',
            icon: <CalendarCheck className="w-4 h-4" />,
          },
          {
            label: 'Historial de pagos',
            value: 'payments',
            icon: <CreditCard className="w-4 h-4" />,
          },
          {
            label: 'Notificaciones',
            value: 'notifications',
            icon: <Bell className="w-4 h-4" />,
          },
          {
            label: 'Configuración',
            value: 'settings',
            icon: <Settings className="w-4 h-4" />,
          },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setSelectedTab(tab.value)}
            className={`px-4 py-2 flex items-center space-x-2 transition-all duration-200 ${
              selectedTab === tab.value
                ? 'font-bold border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Contenido de cada pestaña */}
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

      {/* Botón de cerrar sesión mejorado */}
      <button
        onClick={handleLogout}
        className="mt-6 w-full flex items-center justify-center space-x-2 bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-semibold transition-all duration-300 shadow-md"
      >
        <LogOut className="w-5 h-5" />
        <span>Cerrar sesión</span>
      </button>
    </div>
  );
};

export default Profile;
