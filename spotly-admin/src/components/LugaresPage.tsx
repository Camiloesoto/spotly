import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle, 
  Search,
  Filter
} from 'lucide-react';
import { lugaresService } from '../services/api';
import type { Lugar, FiltrosLugares } from '../types';
import AgregarLugarModal from './AgregarLugarModal';

const LugaresPage: React.FC = () => {
  const [lugares, setLugares] = useState<Lugar[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtros, setFiltros] = useState<FiltrosLugares>({});
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    loadLugares();
  }, [filtros]);

  const loadLugares = async () => {
    try {
      setIsLoading(true);
      const response = await lugaresService.getAll(filtros);
      if (response.success && response.data) {
        setLugares(response.data);
      }
    } catch (error) {
      console.error('Error loading lugares:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificar = async (id: string) => {
    try {
      const response = await lugaresService.verify(id);
      if (response.success) {
        loadLugares(); // Recargar la lista
      }
    } catch (error) {
      console.error('Error verifying lugar:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este lugar?')) {
      try {
        const response = await lugaresService.delete(id);
        if (response.success) {
          loadLugares(); // Recargar la lista
        }
      } catch (error) {
        console.error('Error deleting lugar:', error);
      }
    }
  };

  const handleAddSuccess = () => {
    loadLugares(); // Recargar la lista después de agregar
  };

  const filteredLugares = lugares.filter(lugar =>
    lugar.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lugar.direccion.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lugar.tipo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (lugar: Lugar) => {
    if (!lugar.activo) {
      return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Inactivo</span>;
    }
    if (!lugar.verificado) {
      return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">Pendiente</span>;
    }
    return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Verificado</span>;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Cargando lugares...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Lugares</h1>
          <p className="mt-1 text-sm text-gray-600">
            Administra todos los lugares registrados en la plataforma
          </p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Agregar Lugar
        </button>
      </div>

      {/* Filtros y búsqueda */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Búsqueda */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar lugares..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Botón de filtros */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </button>
        </div>

        {/* Filtros expandibles */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <select
                value={filtros.tipo || ''}
                onChange={(e) => setFiltros({ ...filtros, tipo: e.target.value || undefined })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Todos los tipos</option>
                <option value="restaurante">Restaurante</option>
                <option value="bar">Bar</option>
                <option value="café">Café</option>
                <option value="club">Club</option>
              </select>

              <select
                value={filtros.activo?.toString() || ''}
                onChange={(e) => setFiltros({ ...filtros, activo: e.target.value === 'true' ? true : e.target.value === 'false' ? false : undefined })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Todos los estados</option>
                <option value="true">Activo</option>
                <option value="false">Inactivo</option>
              </select>

              <select
                value={filtros.verificado?.toString() || ''}
                onChange={(e) => setFiltros({ ...filtros, verificado: e.target.value === 'true' ? true : e.target.value === 'false' ? false : undefined })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Todos los estados</option>
                <option value="true">Verificado</option>
                <option value="false">Pendiente</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Tabla de lugares */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lugar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLugares.map((lugar) => (
                <tr key={lugar.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                          <Building2 className="h-6 w-6 text-indigo-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {lugar.nombre}
                        </div>
                        <div className="text-sm text-gray-500">
                          {lugar.direccion}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full capitalize">
                      {lugar.tipo}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(lugar)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-900">
                        {lugar.rating_promedio?.toFixed(1) || 'N/A'}
                      </span>
                      <span className="text-sm text-gray-500 ml-1">/ 5</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleVerificar(lugar.id)}
                        disabled={lugar.verificado}
                        className="text-indigo-600 hover:text-indigo-900 disabled:text-gray-400 disabled:cursor-not-allowed"
                        title={lugar.verificado ? 'Ya verificado' : 'Verificar lugar'}
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {/* TODO: Implementar edición */}}
                        className="text-blue-600 hover:text-blue-900"
                        title="Editar lugar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(lugar.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Eliminar lugar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredLugares.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay lugares</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || Object.keys(filtros).length > 0 
                ? 'No se encontraron lugares con los filtros aplicados.'
                : 'Comienza agregando el primer lugar.'
              }
            </p>
          </div>
        )}
      </div>

      {/* Modal para agregar lugar */}
      <AgregarLugarModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleAddSuccess}
      />
    </div>
  );
};

export default LugaresPage;
