import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';
import type { 
  Usuario, 
  Lugar, 
  MenuItem, 
  Reserva, 
  Resena, 
  Estadisticas,
  FormLugar,
  FormMenuItem,
  ApiResponse,
  FiltrosLugares,
  FiltrosReservas
} from '../types';

// Configuración base de la API
const API_BASE_URL = 'http://localhost:3000/api';

// Crear instancia de axios
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token de autenticación
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Servicio de autenticación
export const authService = {
  login: async (email: string, password: string): Promise<ApiResponse<{ token: string; usuario: Usuario }>> => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('usuario');
  },

  getProfile: async (): Promise<ApiResponse<Usuario>> => {
    const response = await api.get('/auth/perfil');
    return response.data;
  },

  updateProfile: async (data: Partial<Usuario>): Promise<ApiResponse<Usuario>> => {
    const response = await api.put('/auth/perfil', data);
    return response.data;
  },
};

// Servicio de lugares
export const lugaresService = {
  getAll: async (filtros?: FiltrosLugares): Promise<ApiResponse<Lugar[]>> => {
    const response = await api.get('/lugares', { params: filtros });
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<Lugar>> => {
    const response = await api.get(`/lugares/${id}`);
    return response.data;
  },

  create: async (data: FormLugar): Promise<ApiResponse<Lugar>> => {
    const response = await api.post('/lugares', data);
    return response.data;
  },

  update: async (id: string, data: Partial<FormLugar>): Promise<ApiResponse<Lugar>> => {
    const response = await api.put(`/lugares/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/lugares/${id}`);
    return response.data;
  },

  verify: async (id: string): Promise<ApiResponse<Lugar>> => {
    const response = await api.patch(`/lugares/${id}/verificar`);
    return response.data;
  },

  getMenu: async (id: string): Promise<ApiResponse<MenuItem[]>> => {
    const response = await api.get(`/lugares/${id}/menu`);
    return response.data;
  },

  addMenuItem: async (lugarId: string, data: FormMenuItem): Promise<ApiResponse<MenuItem>> => {
    const response = await api.post(`/lugares/${lugarId}/menu`, data);
    return response.data;
  },

  updateMenuItem: async (lugarId: string, itemId: string, data: Partial<FormMenuItem>): Promise<ApiResponse<MenuItem>> => {
    const response = await api.put(`/lugares/${lugarId}/menu/${itemId}`, data);
    return response.data;
  },

  deleteMenuItem: async (lugarId: string, itemId: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/lugares/${lugarId}/menu/${itemId}`);
    return response.data;
  },
};

// Servicio de reservas
export const reservasService = {
  getAll: async (filtros?: FiltrosReservas): Promise<ApiResponse<Reserva[]>> => {
    const response = await api.get('/reservas', { params: filtros });
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<Reserva>> => {
    const response = await api.get(`/reservas/${id}`);
    return response.data;
  },

  update: async (id: string, data: Partial<Reserva>): Promise<ApiResponse<Reserva>> => {
    const response = await api.put(`/reservas/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/reservas/${id}`);
    return response.data;
  },

  getByLugar: async (lugarId: string): Promise<ApiResponse<Reserva[]>> => {
    const response = await api.get(`/reservas/lugar/${lugarId}`);
    return response.data;
  },
};

// Servicio de reseñas
export const resenasService = {
  getAll: async (lugarId?: string): Promise<ApiResponse<Resena[]>> => {
    const response = await api.get('/resenas', { params: { lugar_id: lugarId } });
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/resenas/${id}`);
    return response.data;
  },
};

// Servicio de estadísticas
export const statsService = {
  getDashboardStats: async (): Promise<ApiResponse<Estadisticas>> => {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  getLugarStats: async (lugarId: string): Promise<ApiResponse<any>> => {
    const response = await api.get(`/lugares/${lugarId}/estadisticas`);
    return response.data;
  },
};

// Servicio de usuarios
export const usuariosService = {
  getAll: async (): Promise<ApiResponse<Usuario[]>> => {
    const response = await api.get('/admin/usuarios');
    return response.data;
  },

  updateRole: async (id: string, rol: string): Promise<ApiResponse<Usuario>> => {
    const response = await api.put(`/admin/usuarios/${id}/rol`, { rol });
    return response.data;
  },

  toggleStatus: async (id: string): Promise<ApiResponse<Usuario>> => {
    const response = await api.patch(`/admin/usuarios/${id}/toggle-status`);
    return response.data;
  },
};

export default api;
