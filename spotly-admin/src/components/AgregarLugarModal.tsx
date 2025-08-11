import React, { useState } from 'react';
import { X, Building2, MapPin, Phone, Globe, Clock } from 'lucide-react';
import { lugaresService } from '../services/api';
import type { Lugar } from '../types';

interface AgregarLugarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AgregarLugarModal: React.FC<AgregarLugarModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    tipo: 'restaurante',
    direccion: '',
    telefono: '',
    email: '',
    sitio_web: '',
    horarios: {
      lunes: { abierto: true, apertura: '08:00', cierre: '22:00' },
      martes: { abierto: true, apertura: '08:00', cierre: '22:00' },
      miercoles: { abierto: true, apertura: '08:00', cierre: '22:00' },
      jueves: { abierto: true, apertura: '08:00', cierre: '22:00' },
      viernes: { abierto: true, apertura: '08:00', cierre: '23:00' },
      sabado: { abierto: true, apertura: '09:00', cierre: '23:00' },
      domingo: { abierto: true, apertura: '09:00', cierre: '22:00' }
    },
    coordenadas: '',
    precio_promedio: 'medio',
    capacidad: '',
    activo: true,
    verificado: false
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Limpiar error del campo
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleHorarioChange = (dia: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      horarios: {
        ...prev.horarios,
        [dia]: {
          ...prev.horarios[dia as keyof typeof prev.horarios],
          [field]: value
        }
      }
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }
    if (!formData.direccion.trim()) {
      newErrors.direccion = 'La dirección es requerida';
    }
    if (!formData.tipo) {
      newErrors.tipo = 'El tipo es requerido';
    }
    if (formData.telefono && !/^[\d\s\-\+\(\)]+$/.test(formData.telefono)) {
      newErrors.telefono = 'Formato de teléfono inválido';
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Formato de email inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const lugarData = {
        ...formData,
        capacidad: formData.capacidad ? parseInt(formData.capacidad) : undefined,
        coordenadas: formData.coordenadas || null
      };

      const response = await lugaresService.create(lugarData);
      
      if (response.success) {
        onSuccess();
        onClose();
        // Reset form
        setFormData({
          nombre: '',
          descripcion: '',
          tipo: 'restaurante',
          direccion: '',
          telefono: '',
          email: '',
          sitio_web: '',
          horarios: {
            lunes: { abierto: true, apertura: '08:00', cierre: '22:00' },
            martes: { abierto: true, apertura: '08:00', cierre: '22:00' },
            miercoles: { abierto: true, apertura: '08:00', cierre: '22:00' },
            jueves: { abierto: true, apertura: '08:00', cierre: '22:00' },
            viernes: { abierto: true, apertura: '08:00', cierre: '23:00' },
            sabado: { abierto: true, apertura: '09:00', cierre: '23:00' },
            domingo: { abierto: true, apertura: '09:00', cierre: '22:00' }
          },
          coordenadas: '',
          precio_promedio: 'medio',
          capacidad: '',
          activo: true,
          verificado: false
        });
      } else {
        alert('Error al crear el lugar: ' + response.message);
      }
    } catch (error) {
      console.error('Error creating lugar:', error);
      alert('Error al crear el lugar. Revisa la consola para más detalles.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Agregar Nuevo Lugar</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Información básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del lugar *
              </label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => handleInputChange('nombre', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.nombre ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ej: Restaurante El Buen Sabor"
              />
              {errors.nombre && <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo *
              </label>
              <select
                value={formData.tipo}
                onChange={(e) => handleInputChange('tipo', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="restaurante">Restaurante</option>
                <option value="bar">Bar</option>
                <option value="café">Café</option>
                <option value="club">Club</option>
                <option value="pizzeria">Pizzería</option>
                <option value="heladeria">Heladería</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dirección *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={formData.direccion}
                  onChange={(e) => handleInputChange('direccion', e.target.value)}
                  className={`w-full pl-10 pr-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
                    errors.direccion ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ej: Calle 123 #45-67"
                />
              </div>
              {errors.direccion && <p className="mt-1 text-sm text-red-600">{errors.direccion}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={formData.telefono}
                  onChange={(e) => handleInputChange('telefono', e.target.value)}
                  className={`w-full pl-10 pr-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
                    errors.telefono ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ej: +57 300 123 4567"
                />
              </div>
              {errors.telefono && <p className="mt-1 text-sm text-red-600">{errors.telefono}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="ejemplo@restaurante.com"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sitio web
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="url"
                  value={formData.sitio_web}
                  onChange={(e) => handleInputChange('sitio_web', e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="https://www.ejemplo.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Precio promedio
              </label>
              <select
                value={formData.precio_promedio}
                onChange={(e) => handleInputChange('precio_promedio', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="bajo">Bajo ($)</option>
                <option value="medio">Medio ($$)</option>
                <option value="alto">Alto ($$$)</option>
                <option value="premium">Premium ($$$$)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Capacidad
              </label>
              <input
                type="number"
                value={formData.capacidad}
                onChange={(e) => handleInputChange('capacidad', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Ej: 50"
                min="1"
              />
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              value={formData.descripcion}
              onChange={(e) => handleInputChange('descripcion', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Describe tu lugar, especialidades, ambiente..."
            />
          </div>

          {/* Horarios */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Horarios de atención
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(formData.horarios).map(([dia, horario]) => (
                <div key={dia} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {dia}
                    </span>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={horario.abierto}
                        onChange={(e) => handleHorarioChange(dia, 'abierto', e.target.checked)}
                        className="mr-2"
                      />
                      <span className="text-xs text-gray-600">Abierto</span>
                    </label>
                  </div>
                  {horario.abierto && (
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="time"
                        value={horario.apertura}
                        onChange={(e) => handleHorarioChange(dia, 'apertura', e.target.value)}
                        className="text-xs px-2 py-1 border border-gray-300 rounded"
                      />
                      <input
                        type="time"
                        value={horario.cierre}
                        onChange={(e) => handleHorarioChange(dia, 'cierre', e.target.value)}
                        className="text-xs px-2 py-1 border border-gray-300 rounded"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Coordenadas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Coordenadas (opcional)
            </label>
            <input
              type="text"
              value={formData.coordenadas}
              onChange={(e) => handleInputChange('coordenadas', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Ej: 4.7110,-74.0721"
            />
            <p className="mt-1 text-xs text-gray-500">
              Formato: latitud,longitud (puedes obtenerlas de Google Maps)
            </p>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creando...' : 'Crear Lugar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AgregarLugarModal;
