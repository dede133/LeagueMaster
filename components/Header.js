'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { PersonIcon } from '@radix-ui/react-icons';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

const Header = () => {
  const { isAuthenticated, userRole, loading } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleProfileClick = () => {
    if (!loading) {
      if (isAuthenticated) {
        router.push('/profile');
      } else {
        router.push('/login');
      }
    }
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6 lg:px-8 py-5 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="w-10 h-10 bg-blue-500 text-white rounded-full p-2"
            viewBox="0 0 24 24"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
          </svg>
          <span className="text-xl font-bold text-gray-800">LeagueMaster</span>
        </Link>

        {/* Botón Hamburguesa */}
        <button
          className="md:hidden text-gray-600 hover:text-blue-500 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>

        {/* Navegación Desktop */}
        <nav className="hidden md:flex space-x-8 text-base font-medium ">
          <Link href="/" className="text-gray-600 hover:text-blue-500">
            Inicio
          </Link>
          <Link href="/fields" className="text-gray-600 hover:text-blue-500">
            Campos
          </Link>
          <Link href="/leagues" className="text-gray-600 hover:text-blue-500">
            Ligas
          </Link>
        </nav>

        {/* Opciones */}
        <div className="hidden md:flex items-center space-x-4">
          {userRole === 'admin' && (
            <Link
              href="/admin-fields"
              className="text-base text-gray-600 hover:text-blue-500"
            >
              Tus Campos
            </Link>
          )}
          <Link
            href={userRole === 'admin' ? '/add-field' : '/new-field'}
            className="text-base text-gray-600 hover:text-blue-500"
          >
            ¿Tienes un campo?
          </Link>
          <button
            onClick={handleProfileClick}
            disabled={loading}
            className="flex items-center space-x-2 bg-blue-500 text-white hover:bg-blue-600 px-5 py-2 rounded-lg transition-all duration-200 text-base font-semibold"
          >
            <PersonIcon />
            <span>Perfil</span>
          </button>
        </div>
      </div>

      {/* Menú Móvil */}
      {menuOpen && (
        <nav className="md:hidden bg-white shadow-md">
          <ul className="space-y-4 px-6 py-4 text-gray-600 text-base font-medium">
            <li>
              <Link
                href="/"
                className="block hover:text-blue-500"
                onClick={closeMenu}
              >
                Inicio
              </Link>
            </li>
            <li>
              <Link
                href="/fields"
                className="block hover:text-blue-500"
                onClick={closeMenu}
              >
                Campos
              </Link>
            </li>
            <li>
              <Link
                href="/leagues"
                className="block hover:text-blue-500"
                onClick={closeMenu}
              >
                Ligas
              </Link>
            </li>
            {userRole === 'admin' && (
              <li>
                <Link
                  href="/admin-fields"
                  className="block hover:text-blue-500"
                  onClick={closeMenu}
                >
                  Tus Campos
                </Link>
              </li>
            )}
            <li>
              <Link
                href={userRole === 'admin' ? '/add-field' : '/new-field'}
                className="block hover:text-blue-500"
                onClick={closeMenu}
              >
                ¿Tienes un campo?
              </Link>
            </li>
            <li>
              <button
                onClick={() => {
                  handleProfileClick();
                  closeMenu();
                }}
                disabled={loading}
                className="flex items-center space-x-2 bg-blue-500 text-white hover:bg-blue-600 px-5 py-2 rounded-lg w-full font-semibold"
              >
                <PersonIcon />
                <span>{loading ? 'Cargando...' : 'Perfil'}</span>
              </button>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;
