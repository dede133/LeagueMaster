// src/pages/login.js
import React, { useState } from 'react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes añadir la lógica para enviar las credenciales al backend
    // y manejar respuestas de éxito o error
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Iniciar Sesión</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit}>
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
        <a href="/register" className="text-blue-500">
          Create una aquí
        </a>
      </p>
      <p className="mt-4">
        ¿Olvidaste tu contraseña?{' '}
        <a href="/reset-password" className="text-blue-500">
          Recupérala aquí
        </a>
      </p>
    </div>
  );
};

export default LoginPage;
