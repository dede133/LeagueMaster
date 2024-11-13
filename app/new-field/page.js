// src/pages/new-field.js
import React from 'react';
import Link from 'next/link';

const NewField = () => {
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Beneficios de Añadir un Campo</h2>
      <p className="mb-4">
        Al añadir tu campo en nuestra plataforma, puedes gestionar tus reservas,
        recibir pagos y tener un mayor control sobre el uso de tus
        instalaciones.
      </p>
      <p className="mb-4">
        Sin embargo, solo los usuarios administradores pueden añadir campos. Si
        estás interesado, por favor regístrate y solicita ser administrador.
      </p>
      <Link href="/register" className="text-blue-500 hover:underline">
        Registrarse y solicitar ser administrador
      </Link>
    </div>
  );
};

export default NewField;
