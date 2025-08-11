import React, { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Usuario } from '../types';
import { authService } from '../services/api';
import { AuthContext } from '../contexts/AuthContext';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        const response = await authService.getProfile();
        if (response.success && response.data) {
          setUsuario(response.data);
        } else {
          localStorage.removeItem('authToken');
        }
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      localStorage.removeItem('authToken');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await authService.login(email, password);
      
      if (response.success && response.data) {
        localStorage.setItem('authToken', response.data.token);
        setUsuario(response.data.usuario);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUsuario(null);
  };

  const updateProfile = async (data: Partial<Usuario>) => {
    try {
      const response = await authService.updateProfile(data);
      if (response.success && response.data) {
        setUsuario(response.data);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const isAdmin = () => {
    return usuario?.rol === 'admin';
  };

  const isPropietario = () => {
    return usuario?.rol === 'propietario' || usuario?.rol === 'admin';
  };

  const value = {
    usuario,
    isAuthenticated: !!usuario,
    isLoading,
    login,
    logout,
    updateProfile,
    isAdmin,
    isPropietario,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
