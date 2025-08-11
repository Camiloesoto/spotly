// filepath: backend/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

// Middleware de seguridad
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por ventana
  message: 'Demasiadas requests desde esta IP, intenta de nuevo más tarde.'
});
app.use(limiter);

// Importar rutas
const authRoutes = require('./routes/auth');
const lugaresRoutes = require('./routes/lugares');
const reservasRoutes = require('./routes/reservas');
const adminRoutes = require('./routes/admin');

// Configurar rutas
app.use('/api/auth', authRoutes);
app.use('/api/lugares', lugaresRoutes);
app.use('/api/reservas', reservasRoutes);
app.use('/api/admin', adminRoutes);

// Endpoint de prueba
app.get('/', (req, res) => {
  res.json({
    mensaje: 'Spotly API funcionando',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      lugares: '/api/lugares',
      reservas: '/api/reservas'
    }
  });
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Error interno del servidor',
    mensaje: process.env.NODE_ENV === 'development' ? err.message : 'Algo salió mal'
  });
});

// Middleware para rutas no encontradas
app.use('/*', (req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor Spotly API funcionando en http://localhost:${PORT}`);
  console.log(`📊 Modo: ${process.env.NODE_ENV || 'development'}`);
});