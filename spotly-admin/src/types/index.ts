// Tipos para el Panel Administrativo de Spotly

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: 'admin' | 'propietario' | 'usuario';
  activo: boolean;
  fecha_creacion: string;
}

export interface Lugar {
  id: string;
  nombre: string;
  tipo: string;
  direccion: string;
  descripcion?: string;
  precio_promedio: number;
  capacidad: number;
  activo: boolean;
  verificado: boolean;
  rating_promedio: number;
  coordenadas?: string;
  fecha_creacion: string;
  propietario_id: string;
}

export interface MenuItem {
  id: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  categoria: string;
  disponible: boolean;
  lugar_id: string;
}

export interface Reserva {
  id: string;
  usuario_id: string;
  lugar_id: string;
  fecha: string;
  hora: string;
  personas: number;
  estado: 'pendiente' | 'confirmada' | 'cancelada' | 'completada';
  notas?: string;
  fecha_creacion: string;
}

export interface Resena {
  id: string;
  usuario_id: string;
  lugar_id: string;
  rating: number;
  comentario?: string;
  fecha_creacion: string;
  usuario_nombre?: string;
}

export interface Estadisticas {
  totalLugares: number;
  lugaresActivos: number;
  lugaresVerificados: number;
  totalReservas: number;
  reservasPendientes: number;
  reservasConfirmadas: number;
  promedioRating: number;
  totalUsuarios: number;
}

export interface FiltrosLugares {
  tipo?: string;
  activo?: boolean;
  verificado?: boolean;
  propietario_id?: string;
}

export interface FiltrosReservas {
  lugar_id?: string;
  usuario_id?: string;
  estado?: string;
  fecha_desde?: string;
  fecha_hasta?: string;
}

// Tipos para formularios
export interface FormLugar {
  nombre: string;
  tipo: string;
  direccion: string;
  descripcion: string;
  precio_promedio: number;
  capacidad: number;
  activo: boolean;
  coordenadas: string;
}

export interface FormMenuItem {
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  disponible: boolean;
}

// Tipos para respuestas de API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
