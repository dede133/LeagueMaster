// src/components/Header.js
import React from 'react';

const Header = () => {
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold">LeagueMaster</div>
        {/* Botón de menú para dispositivos pequeños */}
        <div className="block lg:hidden">
          <button className="text-gray-800 focus:outline-none">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>
        {/* Menú de navegación */}
        <nav className="hidden lg:flex space-x-4">
          <a href="/" className="text-gray-600 hover:text-blue-500">
            Inicio
          </a>
          <a href="/features" className="text-gray-600 hover:text-blue-500">
            Características
          </a>
          <a href="/about" className="text-gray-600 hover:text-blue-500">
            Acerca de
          </a>
          <a
            href="/login"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Iniciar Sesión
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
