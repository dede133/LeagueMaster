// src/pages/login.js
'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Error al iniciar sesión');
      } else {
        const data = await response.json();
        console.log('Inicio de sesión exitoso:', data);
        setMessage('Inicio de sesión exitoso');
        router.push('/profile');
      }
    } catch (error) {
      console.error('Error de red o del servidor:', error);
      setError('Error de red o del servidor');
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
