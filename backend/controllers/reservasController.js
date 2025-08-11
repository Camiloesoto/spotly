const Reserva = require('../models/Reserva');
const Lugar = require('../models/Lugar');
const Usuario = require('../models/Usuario');

class ReservasController {
  static async crearReserva(req, res) {
    try {
      const { lugar_id, fecha_hora, personas, notas } = req.body;
      const usuario_id = req.usuario.id;

      // Validar datos requeridos
      if (!lugar_id || !fecha_hora || !personas) {
        return res.status(400).json({ error: 'Lugar, fecha/hora y número de personas son requeridos' });
      }

      // Verificar que el lugar existe
      const lugar = await Lugar.buscarPorId(lugar_id);
      if (!lugar) {
        return res.status(404).json({ error: 'Lugar no encontrado' });
      }

      // Verificar disponibilidad
      const disponibilidad = await Reserva.verificarDisponibilidad(lugar_id, fecha_hora, personas);
      if (!disponibilidad.disponible) {
        return res.status(400).json({ 
          error: 'No hay disponibilidad para la fecha y hora solicitada',
          disponibilidad 
        });
      }

      // Crear reserva
      const reserva = await Reserva.crear({
        usuario_id,
        lugar_id,
        fecha_hora,
        personas,
        notas
      });

      // Obtener información completa de la reserva
      const reservaCompleta = await Reserva.buscarPorId(reserva.id);

      res.status(201).json({
        mensaje: 'Reserva creada exitosamente',
        reserva: reservaCompleta
      });
    } catch (error) {
      console.error('Error creando reserva:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  static async crearReservaGrupal(req, res) {
    try {
      const { lugar_id, fecha_hora, personas, notas, invitados } = req.body;
      const usuario_principal_id = req.usuario.id;

      // Validar datos requeridos
      if (!lugar_id || !fecha_hora || !personas) {
        return res.status(400).json({ error: 'Lugar, fecha/hora y número de personas son requeridos' });
      }

      // Verificar que el lugar existe
      const lugar = await Lugar.buscarPorId(lugar_id);
      if (!lugar) {
        return res.status(404).json({ error: 'Lugar no encontrado' });
      }

      // Verificar disponibilidad
      const disponibilidad = await Reserva.verificarDisponibilidad(lugar_id, fecha_hora, personas);
      if (!disponibilidad.disponible) {
        return res.status(400).json({ 
          error: 'No hay disponibilidad para la fecha y hora solicitada',
          disponibilidad 
        });
      }

      // Crear reserva grupal
      const reserva = await Reserva.crearReservaGrupal({
        usuario_principal_id,
        lugar_id,
        fecha_hora,
        personas,
        invitados,
        notas
      });

      // Obtener información completa de la reserva
      const reservaCompleta = await Reserva.buscarPorId(reserva.id);

      res.status(201).json({
        mensaje: 'Reserva grupal creada exitosamente',
        reserva: reservaCompleta
      });
    } catch (error) {
      console.error('Error creando reserva grupal:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  static async obtenerReservasUsuario(req, res) {
    try {
      const { estado } = req.query;
      const usuario_id = req.usuario.id;

      const reservas = await Reserva.buscarPorUsuario(usuario_id, estado);

      res.json({
        reservas,
        total: reservas.length
      });
    } catch (error) {
      console.error('Error obteniendo reservas del usuario:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  static async obtenerReserva(req, res) {
    try {
      const { id } = req.params;
      const reserva = await Reserva.buscarPorId(id);

      if (!reserva) {
        return res.status(404).json({ error: 'Reserva no encontrada' });
      }

      // Verificar que el usuario puede ver esta reserva
      if (reserva.usuario_id !== req.usuario.id) {
        return res.status(403).json({ error: 'No tienes permisos para ver esta reserva' });
      }

      res.json({ reserva });
    } catch (error) {
      console.error('Error obteniendo reserva:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  static async actualizarReserva(req, res) {
    try {
      const { id } = req.params;
      const { fecha_hora, personas, notas } = req.body;

      // Verificar que la reserva existe
      const reservaExistente = await Reserva.buscarPorId(id);
      if (!reservaExistente) {
        return res.status(404).json({ error: 'Reserva no encontrada' });
      }

      // Verificar que el usuario puede modificar esta reserva
      if (reservaExistente.usuario_id !== req.usuario.id) {
        return res.status(403).json({ error: 'No tienes permisos para modificar esta reserva' });
      }

      // Verificar disponibilidad si se cambia la fecha/hora o personas
      if (fecha_hora || personas) {
        const nuevaFecha = fecha_hora || reservaExistente.fecha_hora;
        const nuevasPersonas = personas || reservaExistente.personas;

        const disponibilidad = await Reserva.verificarDisponibilidad(
          reservaExistente.lugar_id, 
          nuevaFecha, 
          nuevasPersonas, 
          id
        );

        if (!disponibilidad.disponible) {
          return res.status(400).json({ 
            error: 'No hay disponibilidad para los cambios solicitados',
            disponibilidad 
          });
        }
      }

      // Actualizar reserva
      const datosActualizar = {};
      if (fecha_hora) datosActualizar.fecha_hora = fecha_hora;
      if (personas) datosActualizar.personas = personas;
      if (notas !== undefined) datosActualizar.notas = notas;

      const reserva = await Reserva.actualizar(id, datosActualizar);

      res.json({
        mensaje: 'Reserva actualizada exitosamente',
        reserva
      });
    } catch (error) {
      console.error('Error actualizando reserva:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  static async cancelarReserva(req, res) {
    try {
      const { id } = req.params;
      const { motivo } = req.body;

      // Verificar que la reserva existe
      const reserva = await Reserva.buscarPorId(id);
      if (!reserva) {
        return res.status(404).json({ error: 'Reserva no encontrada' });
      }

      // Verificar que el usuario puede cancelar esta reserva
      if (reserva.usuario_id !== req.usuario.id) {
        return res.status(403).json({ error: 'No tienes permisos para cancelar esta reserva' });
      }

      // Verificar que la reserva no esté cancelada
      if (reserva.estado === 'cancelada') {
        return res.status(400).json({ error: 'La reserva ya está cancelada' });
      }

      // Cancelar reserva
      const reservaCancelada = await Reserva.cancelar(id, motivo);

      res.json({
        mensaje: 'Reserva cancelada exitosamente',
        reserva: reservaCancelada
      });
    } catch (error) {
      console.error('Error cancelando reserva:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  static async obtenerReservasLugar(req, res) {
    try {
      const { lugar_id } = req.params;
      const { fecha, estado } = req.query;

      // Verificar que el lugar existe
      const lugar = await Lugar.buscarPorId(lugar_id);
      if (!lugar) {
        return res.status(404).json({ error: 'Lugar no encontrado' });
      }

      const reservas = await Reserva.buscarPorLugar(lugar_id, fecha);

      // Filtrar por estado si se especifica
      let reservasFiltradas = reservas;
      if (estado) {
        reservasFiltradas = reservas.filter(reserva => reserva.estado === estado);
      }

      res.json({
        reservas: reservasFiltradas,
        total: reservasFiltradas.length
      });
    } catch (error) {
      console.error('Error obteniendo reservas del lugar:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  static async verificarDisponibilidad(req, res) {
    try {
      const { lugar_id } = req.params;
      const { fecha_hora, personas } = req.query;

      if (!fecha_hora || !personas) {
        return res.status(400).json({ error: 'Fecha/hora y número de personas son requeridos' });
      }

      const disponibilidad = await Reserva.verificarDisponibilidad(lugar_id, fecha_hora, parseInt(personas));

      res.json({ disponibilidad });
    } catch (error) {
      console.error('Error verificando disponibilidad:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  static async obtenerEstadisticas(req, res) {
    try {
      const { lugar_id } = req.params;
      const { periodo = 'mes' } = req.query;

      const estadisticas = await Reserva.obtenerEstadisticas(lugar_id, periodo);

      res.json({ estadisticas });
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  static async obtenerReservasProximas(req, res) {
    try {
      const { lugar_id } = req.params;
      const { horas = 24 } = req.query;

      const reservas = await Reserva.obtenerReservasProximas(lugar_id, parseInt(horas));

      res.json({
        reservas,
        total: reservas.length,
        horas: parseInt(horas)
      });
    } catch (error) {
      console.error('Error obteniendo reservas próximas:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
}

module.exports = ReservasController; 