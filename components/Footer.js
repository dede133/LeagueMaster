// src/components/Footer.js
'use client';
import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 py-8">
      <div className="container mx-auto px-6 lg:px-8">
        <nav className="flex flex-wrap justify-center space-x-6 mb-6">
          <Link href="/privacy" className="hover:text-white">
            Política de Privacidad
          </Link>
          <Link href="/terms" className="hover:text-white">
            Términos de Servicio
          </Link>
          <Link href="/contact" className="hover:text-white">
            Contacto
          </Link>
        </nav>

        <div className="text-center">
          <p className="mb-4">
            &copy; {new Date().getFullYear()} LeagueMaster. Todos los derechos
            reservados.
          </p>
          <div className="flex justify-center space-x-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878V14.89h-2.54v-2.89h2.54V10.7c0-2.506 1.492-3.89 3.778-3.89 1.094 0 2.24.196 2.24.196v2.46h-1.263c-1.245 0-1.63.772-1.63 1.564v1.89h2.773l-.443 2.89h-2.33v7.002C18.344 21.129 22 16.992 22 12z" />
              </svg>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M8 19c11 0 17-9 17-17 0-.26-.008-.523-.025-.783A12.207 12.207 0 0 0 26 0c-1.12.497-2.308.826-3.553.975a6.153 6.153 0 0 0 2.688-3.392 12.29 12.29 0 0 1-3.894 1.488A6.124 6.124 0 0 0 12.674 6c0 .483.05.955.15 1.407a17.356 17.356 0 0 1-12.611-6.391 6.137 6.137 0 0 0 1.896 8.185 6.086 6.086 0 0 1-2.77-.766v.077c0 2.387 1.693 4.374 3.94 4.826a6.066 6.066 0 0 1-1.61.215c-.395 0-.78-.038-1.158-.11a6.133 6.133 0 0 0 5.722 4.26 12.312 12.312 0 0 1-9.142 2.55A17.344 17.344 0 0 0 8 19" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
