import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './providers/AuthProvider';
import { useAuth } from './hooks/useAuth';
import LoginForm from './components/LoginForm';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import LugaresPage from './components/LugaresPage';

// Componente para proteger rutas
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Cargando...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Componente principal de la aplicación
const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route 
        path="/login" 
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginForm />
        } 
      />
      
      {/* Rutas protegidas con Layout */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/lugares" 
        element={
          <ProtectedRoute>
            <Layout>
              <LugaresPage />
            </Layout>
          </ProtectedRoute>
        } 
      />
      
      {/* Ruta raíz redirige al dashboard */}
      <Route 
        path="/" 
        element={<Navigate to="/dashboard" replace />} 
      />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

export default App;
