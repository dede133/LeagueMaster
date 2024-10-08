export const login = async (email, password) => {
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
    throw new Error(errorData.message || 'Error al iniciar sesión');
  }

  return await response.json();
};

export const logout = async () => {
  const response = await fetch('http://localhost:5000/api/auth/logout', {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al cerrar sesión');
  }
};

export const deleteAccount = async (userId) => {
  const response = await fetch(
    `http://localhost:5000/api/auth/user/${userId}`,
    {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al eliminar la cuenta');
  }

  return await response.json();
};

export const registerUser = async (name, email, password) => {
  const response = await fetch('http://localhost:5000/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || 'Ocurrió un error al registrar el usuario.'
    );
  }

  return await response.json();
};
