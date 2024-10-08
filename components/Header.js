'use client';

import React from 'react';
import Link from 'next/link';
import { PersonIcon } from '@radix-ui/react-icons';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true); // Estado de carga
  const router = useRouter();

  useEffect(() => {
    console.log('useEffect ejecutándose');
    const checkAuth = async () => {
      try {
        console.log('Iniciando petición para verificar autenticación...');

        const response = await fetch(
          'http://localhost:5000/api/auth/check-auth',
          {
            method: 'GET',
            credentials: 'include', // Esto asegura que las cookies se envíen
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          console.error(
            'Error en la respuesta del servidor:',
            response.statusText
          );
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }

        const data = await response.json();
        console.log('Respuesta del servidor:', data);
        console.log('User role:', data.user.user_role);

        if (data.isAuthenticated) {
          console.log('Usuario autenticado');
          setIsAuthenticated(true);
          setUserRole(data.user.user_role);
        } else {
          console.log('Usuario no autenticado');
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error al hacer el fetch:', error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false); // Detener la carga después de verificar la autenticación
      }
    };

    // Llamada inicial para verificar autenticación
    checkAuth();
  }, [router]);

  const handleProfileClick = () => {
    if (!loading) {
      if (isAuthenticated) {
        console.log('Redirigiendo al perfil');
        router.push('/profile'); // Si está autenticado, redirigir al perfil
      } else {
        console.log('Redirigiendo al login');
        router.push('/login'); // Si no está autenticado, redirigir al login
      }
    }
  };

  return (
    <header className="text-gray-600 body-font">
      <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
        {/* Logotipo o Nombre de la Plataforma */}
        <Link
          href="/"
          className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full"
            viewBox="0 0 24 24"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
          </svg>
          <span className="ml-3 text-xl hover:text-blue-700">LeagueMaster</span>
        </Link>

        {/* Menú de Navegación */}
        <nav className="md:ml-auto md:mr-auto flex flex-wrap items-center text-base justify-center">
          <Link href="/" className="mr-5 hover:text-gray-900">
            Inicio
          </Link>
          <Link href="/fields" className="mr-5 hover:text-gray-900">
            Campos
          </Link>
          <Link href="/leagues" className="mr-5 hover:text-gray-900">
            Ligas
          </Link>
        </nav>

        <Link href="/add-field" className="mr-5 hover:text-gray-900">
          ¿Tienes un campo?
        </Link>
        {userRole === 'admin' && (
          <Link href="/admin-fields" className="mr-5 hover:text-gray-900">
            Tus campos
          </Link>
        )}
        {/* Botón de Llamada a la Acción: Iniciar Sesión */}
        <button
          onClick={handleProfileClick}
          disabled={loading} // Deshabilitar el botón mientras está cargando
          className="inline-flex items-center bg-blue-500 border-0 py-1 px-3 focus:outline-none hover:bg-blue-700 rounded text-white mt-4 md:mt-0"
        >
          <PersonIcon />
          {loading ? 'Cargando...' : 'Perfil'}
        </button>
      </div>
    </header>
  );
};

export default Header;
