import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  Usuario, 
  Lugar, 
  Reserva, 
  MenuItem,
  Resena,
  AuthResponse, 
  LoginCredentials, 
  RegisterData, 
  FiltrosLugares,
  Disponibilidad 
} from '../types';

// Configuración de la API
const API_BASE_URL = 'http://127.0.0.1:3000/api';

// Crear instancia de axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token a las requests
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expirado, limpiar storage
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('usuario');
    }
    return Promise.reject(error);
  }
);

// Servicios de autenticación
export const authService = {
  // Registrar usuario
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post('/auth/registro', data);
    return response.data;
  },

  // Login
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Obtener perfil
  async getProfile(): Promise<Usuario> {
    const response = await api.get('/auth/perfil');
    return response.data.usuario;
  },

  // Actualizar perfil
  async updateProfile(data: Partial<Usuario>): Promise<Usuario> {
    const response = await api.put('/auth/perfil', data);
    return response.data.usuario;
  },

  // Cambiar contraseña
  async changePassword(contraseña_actual: string, nueva_contraseña: string): Promise<void> {
    await api.put('/auth/cambiar-contraseña', {
      contraseña_actual,
      nueva_contraseña,
    });
  },

  // Renovar token
  async renewToken(): Promise<{ token: string }> {
    const response = await api.post('/auth/renovar-token');
    return response.data;
  },
};

// Servicios de lugares
export const lugaresService = {
  // Buscar lugares
  async buscarLugares(filtros: FiltrosLugares = {}): Promise<{
    lugares: Lugar[];
    total: number;
    pagina: number;
    total_paginas: number;
  }> {
    const params = new URLSearchParams();
    Object.entries(filtros).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const response = await api.get(`/lugares?${params.toString()}`);
    return response.data;
  },

  // Buscar lugares cercanos
  async buscarLugaresCercanos(lat: number, lng: number, radio: number = 5000): Promise<{
    lugares: Lugar[];
    total: number;
    ubicacion: { lat: number; lng: number };
    radio: number;
  }> {
    const response = await api.get(`/lugares/cercanos?lat=${lat}&lng=${lng}&radio=${radio}`);
    return response.data;
  },

  // Obtener lugar específico
  async obtenerLugar(id: string): Promise<Lugar> {
    const response = await api.get(`/lugares/${id}`);
    return response.data.lugar;
  },

  // Verificar disponibilidad
  async verificarDisponibilidad(id: string, fecha: string): Promise<Disponibilidad> {
    const response = await api.get(`/lugares/${id}/disponibilidad?fecha=${fecha}`);
    return response.data.disponibilidad;
  },

  // Obtener menú
  async obtenerMenu(id: string): Promise<MenuItem[]> {
    const response = await api.get(`/lugares/${id}/menu`);
    return response.data.menu;
  },

  // Obtener reseñas
  async obtenerResenas(id: string, limit: number = 10, offset: number = 0): Promise<{
    resenas: Resena[];
    total: number;
    pagina: number;
    total_paginas: number;
  }> {
    const response = await api.get(`/lugares/${id}/resenas?limit=${limit}&offset=${offset}`);
    return response.data;
  },
};

// Servicios de reservas
export const reservasService = {
  // Crear reserva
  async crearReserva(data: {
    lugar_id: string;
    fecha_hora: string;
    personas: number;
    notas?: string;
  }): Promise<Reserva> {
    const response = await api.post('/reservas', data);
    return response.data.reserva;
  },

  // Crear reserva grupal
  async crearReservaGrupal(data: {
    lugar_id: string;
    fecha_hora: string;
    personas: number;
    notas?: string;
    invitados?: Array<{ usuario_id: string; confirmado: boolean }>;
  }): Promise<Reserva> {
    const response = await api.post('/reservas/grupal', data);
    return response.data.reserva;
  },

  // Obtener reservas del usuario
  async obtenerReservasUsuario(estado?: string): Promise<{
    reservas: Reserva[];
    total: number;
  }> {
    const params = estado ? `?estado=${estado}` : '';
    const response = await api.get(`/reservas/usuario${params}`);
    return response.data;
  },

  // Obtener reserva específica
  async obtenerReserva(id: string): Promise<Reserva> {
    const response = await api.get(`/reservas/${id}`);
    return response.data.reserva;
  },

  // Actualizar reserva
  async actualizarReserva(id: string, data: {
    fecha_hora?: string;
    personas?: number;
    notas?: string;
  }): Promise<Reserva> {
    const response = await api.put(`/reservas/${id}`, data);
    return response.data.reserva;
  },

  // Cancelar reserva
  async cancelarReserva(id: string, motivo?: string): Promise<Reserva> {
    const response = await api.delete(`/reservas/${id}`, {
      data: { motivo },
    });
    return response.data.reserva;
  },

  // Verificar disponibilidad
  async verificarDisponibilidad(lugar_id: string, fecha_hora: string, personas: number): Promise<Disponibilidad> {
    const response = await api.get(`/reservas/lugar/${lugar_id}/disponibilidad?fecha_hora=${fecha_hora}&personas=${personas}`);
    return response.data.disponibilidad;
  },
};

// Servicios de storage local
export const storageService = {
  // Guardar token
  async saveToken(token: string): Promise<void> {
    await AsyncStorage.setItem('token', token);
  },

  // Obtener token
  async getToken(): Promise<string | null> {
    return await AsyncStorage.getItem('token');
  },

  // Eliminar token
  async removeToken(): Promise<void> {
    await AsyncStorage.removeItem('token');
  },

  // Guardar usuario
  async saveUser(user: Usuario): Promise<void> {
    await AsyncStorage.setItem('usuario', JSON.stringify(user));
  },

  // Obtener usuario
  async getUser(): Promise<Usuario | null> {
    const userStr = await AsyncStorage.getItem('usuario');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Eliminar usuario
  async removeUser(): Promise<void> {
    await AsyncStorage.removeItem('usuario');
  },

  // Limpiar todo
  async clearAll(): Promise<void> {
    await AsyncStorage.clear();
  },
};

export default api; 