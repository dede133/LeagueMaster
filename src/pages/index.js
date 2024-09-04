// src/pages/index.js
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FeatureSection from '../components/FeatureSection';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow p-4 md:p-6">
        <h1 className="text-2xl md:text-4xl font-bold text-center mb-4 md:mb-6">
          Bienvenido a LeagueMaster
        </h1>
        <p className="text-center text-base md:text-lg text-gray-700 mb-6 md:mb-8">
          La mejor plataforma para gestionar reservas de campos y ligas de
          fútbol.
        </p>

        <FeatureSection />

        <div className="text-center mt-8">
          <a
            href="/register"
            className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-700"
          >
            ¡Empieza Ahora!
          </a>
        </div>
      </main>
    </div>
  );
}
