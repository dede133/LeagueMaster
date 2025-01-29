'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/user`, {
          method: 'GET',
          credentials: 'include',
        });

        const data = await response.json();
        if (response.ok) {
          setUser(data.user);
        } else {
          console.error(
            'Error al obtener los datos del usuario:',
            data.message
          );
          setError(data.message);
          router.push('/login');
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
