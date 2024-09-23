// src/components/Header.js
import React from 'react';
import Link from 'next/link';
import { PersonIcon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';

const Header = () => {
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
        {/* Botón de Llamada a la Acción: Iniciar Sesión */}
        <Link
          href="/login"
          className="inline-flex items-center bg-blue-500 border-0 py-1 px-3 focus:outline-none hover:bg-blue-700 rounded text-white mt-4 md:mt-0"
        >
          <PersonIcon />
        </Link>
      </div>
    </header>
  );
};

export default Header;
