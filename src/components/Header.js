// src/components/Header.js
import React from 'react';

const Header = () => {
  return (
    <header className="text-gray-600 body-font">
      <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
        {/* Logotipo o Nombre de la Plataforma */}
        <a
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
        </a>

        {/* Menú de Navegación */}
        <nav className="md:ml-auto md:mr-auto flex flex-wrap items-center text-base justify-center">
          <a href="/" className="mr-5 hover:text-gray-900">
            Inicio
          </a>
          <a href="/fields" className="mr-5 hover:text-gray-900">
            Campos
          </a>
          <a href="/leagues" className="mr-5 hover:text-gray-900">
            Ligas
          </a>
        </nav>

        {/* Botón de Llamada a la Acción: Iniciar Sesión */}
        <button class="inline-flex items-center bg-blue-500 border-0 py-1 px-3 focus:outline-none hover:bg-blue-700 rounded text-white mt-4 md:mt-0">
          <a href="/login" className="flex items-center">
            Iniciar Sesión
            <svg
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="w-4 h-4 ml-1"
              viewBox="0 0 24 24"
            >
              <path d="M5 12h14M12 5l7 7-7 7"></path>
            </svg>
          </a>
        </button>
      </div>
    </header>
  );
};

export default Header;
