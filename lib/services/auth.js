const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const login = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
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
  const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al cerrar sesión');
  }
};

export const deleteAccount = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/user/${userId}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al eliminar la cuenta');
  }

  return await response.json();
};

export const registerUser = async (name, email, password) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
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

export const fetchUserData = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/user`, {
      method: 'GET',
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al obtener los datos del usuario');
    }

    return data.user;
  } catch (error) {
    throw new Error(error.message || 'Error de red o del servidor');
  }
};

export const checkAuth = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/check-auth`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Error al verificar autenticación');
  }

  const data = await response.json();
  return data;
};
