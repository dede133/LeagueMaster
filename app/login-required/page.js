'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

const LoginRequired = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-4">Inicia sesión para continuar</h1>
      <p className="text-gray-600 mb-8">
        Debes iniciar sesión para poder unirte a una liga. Por favor, accede a
        tu cuenta.
      </p>
      <Button
        onClick={() => router.push('/login')}
        className="bg-blue-600 text-white font-semibold py-2 px-4 rounded"
      >
        Iniciar sesión
      </Button>
    </div>
  );
};

export default LoginRequired;
