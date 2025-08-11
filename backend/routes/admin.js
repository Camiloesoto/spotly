const express = require('express');
const { authAdmin } = require('../middleware/auth');
const LugaresController = require('../controllers/lugaresController');
const { validarCrearLugar, validarActualizarLugar } = require('../middleware/validation');

const router = express.Router();

// Todas las rutas requieren autenticación de administrador
router.use(authAdmin);

// Obtener estadísticas administrativas
router.get('/stats', async (req, res) => {
  try {
    const lugares = await LugaresController.buscarLugares({ limit: 1000, offset: 0 });
    
    const stats = {
      totalLugares: lugares.lugares.length,
      lugaresActivos: lugares.lugares.filter(l => l.activo).length,
      promedioRating: lugares.lugares.reduce((acc, l) => acc + (l.rating_promedio || 0), 0) / lugares.lugares.length || 0,
      lugaresPorTipo: {}
    };

    // Contar lugares por tipo
    lugares.lugares.forEach(lugar => {
      stats.lugaresPorTipo[lugar.tipo] = (stats.lugaresPorTipo[lugar.tipo] || 0) + 1;
    });

    res.json(stats);
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Crear nuevo lugar
router.post('/lugares', validarCrearLugar, async (req, res) => {
  try {
    const lugarData = {
      ...req.body,
      propietario_id: req.usuario.id
    };
    
    const nuevoLugar = await LugaresController.crearLugar(lugarData);
    res.status(201).json(nuevoLugar);
  } catch (error) {
    console.error('Error creando lugar:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Actualizar lugar
router.put('/lugares/:id', validarActualizarLugar, async (req, res) => {
  try {
    const lugarActualizado = await LugaresController.actualizarLugar(req.params.id, req.body);
    res.json(lugarActualizado);
  } catch (error) {
    console.error('Error actualizando lugar:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Eliminar lugar
router.delete('/lugares/:id', async (req, res) => {
  try {
    await LugaresController.eliminarLugar(req.params.id);
    res.json({ mensaje: 'Lugar eliminado correctamente' });
  } catch (error) {
    console.error('Error eliminando lugar:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Verificar lugar
router.patch('/lugares/:id/verificar', async (req, res) => {
  try {
    const lugarVerificado = await LugaresController.verificarLugar(req.params.id);
    res.json(lugarVerificado);
  } catch (error) {
    console.error('Error verificando lugar:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener todos los lugares para administración
router.get('/lugares', async (req, res) => {
  try {
    const lugares = await LugaresController.buscarLugares({ limit: 1000, offset: 0 });
    res.json(lugares);
  } catch (error) {
    console.error('Error obteniendo lugares:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router; 