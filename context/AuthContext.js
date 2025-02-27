'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { checkAuth, login, logout } from '../lib/services/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loginUser = async (email, password) => {
    try {
      const data = await login(email, password);
      setIsAuthenticated(true);
      setUserRole(data.user.user_role);
      setUser(data.user);
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      throw error;
    }
  };

  const logoutUser = async () => {
    try {
      await logout();
      setIsAuthenticated(false);
      setUserRole(null);
      setUser(null);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw error;
    }
  };

  useEffect(() => {
    const authenticate = async () => {
      try {
        const data = await checkAuth();
        if (data.isAuthenticated) {
          setIsAuthenticated(true);
          setUserRole(data.user.user_role);
          setUser(data.user);
        } else {
          setIsAuthenticated(false);
          setUserRole(null);
          setUser(null);
        }
      } catch (error) {
        console.error(error);
        setIsAuthenticated(false);
        setUserRole(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    authenticate();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userRole,
        user,
        loading,
        loginUser,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
