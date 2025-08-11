const express = require('express');
const router = express.Router();
const ReservasController = require('../controllers/reservasController');
const { auth, authOpcional } = require('../middleware/auth');
const { 
  validarCrearReserva, 
  validarActualizarReserva, 
  validarUUID 
} = require('../middleware/validation');

// POST /reservas - Crear nueva reserva
router.post('/', auth, validarCrearReserva, ReservasController.crearReserva);

// POST /reservas/grupal - Crear reserva grupal
router.post('/grupal', auth, validarCrearReserva, ReservasController.crearReservaGrupal);

// GET /reservas/usuario - Obtener reservas del usuario
router.get('/usuario', auth, ReservasController.obtenerReservasUsuario);

// GET /reservas/:id - Obtener reserva específica
router.get('/:id', auth, validarUUID, ReservasController.obtenerReserva);

// PUT /reservas/:id - Actualizar reserva
router.put('/:id', auth, validarActualizarReserva, ReservasController.actualizarReserva);

// DELETE /reservas/:id - Cancelar reserva
router.delete('/:id', auth, validarUUID, ReservasController.cancelarReserva);

// GET /reservas/lugar/:lugar_id - Obtener reservas de un lugar (para propietarios)
router.get('/lugar/:lugar_id', auth, validarUUID, ReservasController.obtenerReservasLugar);

// GET /reservas/lugar/:lugar_id/disponibilidad - Verificar disponibilidad
router.get('/lugar/:lugar_id/disponibilidad', authOpcional, validarUUID, ReservasController.verificarDisponibilidad);

// GET /reservas/lugar/:lugar_id/estadisticas - Obtener estadísticas de reservas
router.get('/lugar/:lugar_id/estadisticas', auth, validarUUID, ReservasController.obtenerEstadisticas);

// GET /reservas/lugar/:lugar_id/proximas - Obtener reservas próximas
router.get('/lugar/:lugar_id/proximas', auth, validarUUID, ReservasController.obtenerReservasProximas);

module.exports = router; 