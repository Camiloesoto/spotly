import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { LogOut, Menu } from 'lucide-react';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { usuario, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      
      {/* Main content */}
      <div className="md:ml-64">
        {/* Top header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-4 py-3">
            {/* Mobile menu button */}
            <button
              onClick={toggleSidebar}
              className="md:hidden p-2 rounded-md hover:bg-gray-100"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Page title - se puede personalizar por ruta */}
            <div className="flex-1 md:ml-4">
              <h1 className="text-lg font-semibold text-gray-900">
                Panel Administrativo
              </h1>
            </div>

            {/* User menu */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-gray-900">
                  {usuario?.nombre}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {usuario?.rol}
                </p>
              </div>
              
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar Sesión
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
