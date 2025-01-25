// app/login/pages.js
'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const { loginUser } = useAuth();
  const router = useRouter();

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      await loginUser(email, password);
      setMessage('Inicio de sesión exitoso');
      router.push('/profile');
    } catch (error) {
      console.error('Error de red o del servidor:', error);
      setError(error.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Iniciar Sesión</h2>
      {error && <p className="text-red-500">{error}</p>}
      {message && <p className="text-green-500">{message}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Correo electrónico"
          className="w-full p-2 mb-4 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          className="w-full p-2 mb-4 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white w-full py-2 rounded"
        >
          Iniciar Sesión
        </button>
      </form>
      <p className="mt-4">
        ¿No tienes cuenta?{' '}
        <Link href="/register" className="text-blue-500">
          Crea una aquí
        </Link>
      </p>
      <p className="mt-4">
        ¿Olvidaste tu contraseña?{' '}
        <Link href="/reset-password" className="text-blue-500">
          Recupérala aquí
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
