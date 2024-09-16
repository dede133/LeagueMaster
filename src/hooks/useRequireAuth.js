// src/hooks/useAuth.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/auth/user', {
          method: 'GET',
          credentials: 'include', // Incluye cookies para la autenticación
        });

        const data = await response.json();
        if (response.ok) {
          setUser(data.user); // Almacena los datos del usuario
        } else {
          console.error(
            'Error al obtener los datos del usuario:',
            data.message
          );
          setError(data.message);
          router.push('/login'); // Redirige si no está autenticado
        }
      } catch (error) {
        console.error('Error de red o del servidor:', error);
        setError('Error de red o del servidor');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  return { user, loading, error, setUser };
};

export default useAuth;
