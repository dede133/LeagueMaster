// src/components/Footer.js
'use client';
import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-800 py-6">
      <div className="container mx-auto px-4 text-white text-center">
        <p>
          &copy; {new Date().getFullYear()} LeagueMaster. Todos los derechos
          reservados.
        </p>
        <nav className="mt-4 space-x-4 text-sm md:text-base">
          <Link href="/privacy" className="text-gray-400 hover:text-white">
            Política de Privacidad
          </Link>
          <Link href="/terms" className="text-gray-400 hover:text-white">
            Términos de Servicio
          </Link>
          <Link href="/contact" className="text-gray-400 hover:text-white">
            Contacto
          </Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
