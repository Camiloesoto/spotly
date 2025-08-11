// Tipos para la API de Spotly

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  telefono?: string;
  fecha_nacimiento?: string;
  genero?: string;
  preferencias?: any;
  rol: string;
  fecha_registro: string;
}

export interface Lugar {
  id: string;
  nombre: string;
  tipo: string;
  direccion: string;
  descripcion?: string;
  telefono?: string;
  email?: string;
  horarios?: any;
  precio_promedio: number;
  capacidad: number;
  coordenadas?: string;
  propietario_id?: string;
  activo: boolean;
  rating_promedio?: number;
  total_resenas?: number;
  menu?: MenuItem[];
  resenas?: Resena[];
}

export interface MenuItem {
  id: string;
  lugar_id: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  categoria: string;
  disponible: boolean;
  imagen_url?: string;
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

export interface Reserva {
  id: string;
  usuario_id: string;
  lugar_id: string;
  fecha_hora: string;
  personas: number;
  notas?: string;
  estado: 'confirmada' | 'cancelada' | 'completada';
  motivo_cancelacion?: string;
  fecha_creacion: string;
  lugar_nombre?: string;
  lugar_direccion?: string;
  lugar_tipo?: string;
}

export interface AuthResponse {
  mensaje: string;
  usuario: Usuario;
  token: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  mensaje?: string;
}

export interface LoginCredentials {
  email: string;
  contraseña: string;
}

export interface RegisterData {
  nombre: string;
  email: string;
  contraseña: string;
  telefono?: string;
  fecha_nacimiento?: string;
  genero?: string;
  preferencias?: any;
}

export interface FiltrosLugares {
  tipo?: string;
  precio_min?: number;
  precio_max?: number;
  ubicacion_lat?: number;
  ubicacion_lng?: number;
  rating_min?: number;
  distancia_max?: number;
  limit?: number;
  offset?: number;
}

export interface Disponibilidad {
  disponible: boolean;
  capacidad_total: number;
  reservas_actuales: number;
  capacidad_disponible: number;
  personas_solicitadas: number;
  motivo?: string;
} 