import { createContext } from 'react';
import type { Usuario } from '../types';

interface AuthContextType {
  usuario: Usuario | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<Usuario>) => Promise<void>;
  isAdmin: () => boolean;
  isPropietario: () => boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
