// src/components/Footer.js
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 py-6">
      <div className="container mx-auto px-4 text-white text-center">
        <p>
          &copy; {new Date().getFullYear()} LeagueMaster. Todos los derechos
          reservados.
        </p>
        <nav className="mt-4 space-x-4 text-sm md:text-base">
          <a href="/privacy" className="text-gray-400 hover:text-white">
            Política de Privacidad
          </a>
          <a href="/terms" className="text-gray-400 hover:text-white">
            Términos de Servicio
          </a>
          <a href="/contact" className="text-gray-400 hover:text-white">
            Contacto
          </a>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
