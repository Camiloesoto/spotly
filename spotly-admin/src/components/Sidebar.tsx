import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  Calendar, 
  Star, 
  Settings,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin } = useAuth();

  const menuItems = [
    {
      name: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard',
      adminOnly: false
    },
    {
      name: 'Lugares',
      icon: Building2,
      path: '/lugares',
      adminOnly: false
    },
    {
      name: 'Usuarios',
      icon: Users,
      path: '/usuarios',
      adminOnly: true
    },
    {
      name: 'Reservas',
      icon: Calendar,
      path: '/reservas',
      adminOnly: false
    },
    {
      name: 'Reseñas',
      icon: Star,
      path: '/resenas',
      adminOnly: false
    },
    {
      name: 'Configuración',
      icon: Settings,
      path: '/configuracion',
      adminOnly: true
    }
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    if (window.innerWidth < 768) {
      onToggle(); // Cerrar sidebar en móvil
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Overlay para móvil */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 h-full bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static md:z-auto
        w-64
      `}>
        {/* Header del sidebar */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Spotly Admin</h2>
          <button
            onClick={onToggle}
            className="md:hidden p-2 rounded-md hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menú de navegación */}
        <nav className="mt-4">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              // Filtrar elementos solo para admin
              if (item.adminOnly && !isAdmin()) return null;
              
              const Icon = item.icon;
              return (
                <li key={item.name}>
                  <button
                    onClick={() => handleNavigation(item.path)}
                    className={`
                      w-full flex items-center px-4 py-3 text-left transition-colors duration-200
                      ${isActive(item.path) 
                        ? 'bg-indigo-50 text-indigo-700 border-r-2 border-indigo-700' 
                        : 'text-gray-700 hover:bg-gray-50'
                      }
                    `}
                  >
                    <Icon className={`w-5 h-5 mr-3 ${isActive(item.path) ? 'text-indigo-700' : 'text-gray-500'}`} />
                    {item.name}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer del sidebar */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="text-sm text-gray-500 text-center">
            © 2024 Spotly
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
