const express = require('express');
const router = express.Router();
const LugaresController = require('../controllers/lugaresController');
const { auth, authOpcional } = require('../middleware/auth');
const { 
  validarCrearLugar, 
  validarBuscarLugares, 
  validarUUID,
  validarAgregarMenuItem
} = require('../middleware/validation');

// GET /lugares - Buscar lugares con filtros
router.get('/', authOpcional, validarBuscarLugares, LugaresController.buscarLugares);

// GET /lugares/cercanos - Buscar lugares cercanos
router.get('/cercanos', authOpcional, LugaresController.buscarLugaresCercanos);

// GET /lugares/:id - Obtener lugar específico
router.get('/:id', authOpcional, validarUUID, LugaresController.obtenerLugar);

// GET /lugares/:id/disponibilidad - Verificar disponibilidad
router.get('/:id/disponibilidad', authOpcional, validarUUID, LugaresController.obtenerDisponibilidad);

// GET /lugares/:id/horarios - Obtener horarios del lugar
router.get('/:id/horarios', authOpcional, validarUUID, LugaresController.obtenerHorarios);

// GET /lugares/:id/menu - Obtener menú del lugar
router.get('/:id/menu', authOpcional, validarUUID, LugaresController.obtenerMenu);

// GET /lugares/:id/resenas - Obtener reseñas del lugar
router.get('/:id/resenas', authOpcional, validarUUID, LugaresController.obtenerResenas);

// GET /lugares/:id/estadisticas - Obtener estadísticas del lugar
router.get('/:id/estadisticas', auth, validarUUID, LugaresController.obtenerEstadisticas);

// POST /lugares - Crear nuevo lugar (solo propietarios/admin)
router.post('/', auth, validarCrearLugar, LugaresController.crearLugar);

// PUT /lugares/:id - Actualizar lugar (solo propietarios/admin)
router.put('/:id', auth, validarUUID, LugaresController.actualizarLugar);

// POST /lugares/:id/menu - Agregar item al menú
router.post('/:id/menu', auth, validarAgregarMenuItem, LugaresController.agregarMenuItem);

module.exports = router; 