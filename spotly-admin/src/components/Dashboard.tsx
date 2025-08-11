import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { statsService } from '../services/api';
import type { Estadisticas } from '../types';
import { 
  Building2, 
  Users, 
  Calendar, 
  Star, 
  TrendingUp
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { usuario } = useAuth();
  const [stats, setStats] = useState<Estadisticas | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setIsLoading(true);
      const response = await statsService.getDashboardStats();
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl">Cargando estadísticas...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Bienvenido, {usuario?.nombre}. Aquí tienes un resumen de la plataforma.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Building2 className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Lugares
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats?.totalLugares || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Usuarios
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats?.totalUsuarios || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Reservas
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats?.totalReservas || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Star className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Rating Promedio
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats?.promedioRating?.toFixed(1) || 'N/A'}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Acciones Rápidas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
            <Building2 className="w-4 h-4 mr-2" />
            Gestionar Lugares
          </button>
          <button className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700">
            <Calendar className="w-4 h-4 mr-2" />
            Ver Reservas
          </button>
          <button className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700">
            <Users className="w-4 h-4 mr-2" />
            Gestionar Usuarios
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Actividad Reciente
        </h2>
        <div className="text-center py-8 text-gray-500">
          <TrendingUp className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p>No hay actividad reciente para mostrar</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
