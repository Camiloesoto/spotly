const pool = require('../config/database');

class Reserva {
  static async crear({ usuario_id, lugar_id, fecha_hora, personas, notas, estado = 'confirmada' }) {
    const id = require('uuid').v4();
    
    const query = `
      INSERT INTO reservas (id, usuario_id, lugar_id, fecha_hora, personas, notas, estado, fecha_creacion)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      RETURNING *
    `;
    
    const values = [id, usuario_id, lugar_id, fecha_hora, personas, notas, estado];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async buscarPorId(id) {
    const query = `
      SELECT r.*, 
             u.nombre as usuario_nombre, u.email as usuario_email, u.telefono as usuario_telefono,
             l.nombre as lugar_nombre, l.direccion, l.telefono as lugar_telefono
      FROM reservas r
      INNER JOIN usuarios u ON r.usuario_id = u.id
      INNER JOIN lugares l ON r.lugar_id = l.id
      WHERE r.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async buscarPorUsuario(usuario_id, estado = null) {
    let query = `
      SELECT r.*, l.nombre as lugar_nombre, l.direccion, l.tipo
      FROM reservas r
      INNER JOIN lugares l ON r.lugar_id = l.id
      WHERE r.usuario_id = $1
    `;
    
    const values = [usuario_id];
    let valueIndex = 2;

    if (estado) {
      query += ` AND r.estado = $${valueIndex}`;
      values.push(estado);
    }

    query += ' ORDER BY r.fecha_hora DESC';
    
    const result = await pool.query(query, values);
    return result.rows;
  }

  static async buscarPorLugar(lugar_id, fecha = null) {
    let query = `
      SELECT r.*, u.nombre as usuario_nombre, u.telefono as usuario_telefono
      FROM reservas r
      INNER JOIN usuarios u ON r.usuario_id = u.id
      WHERE r.lugar_id = $1
    `;
    
    const values = [lugar_id];
    let valueIndex = 2;

    if (fecha) {
      query += ` AND DATE(r.fecha_hora) = $${valueIndex}`;
      values.push(fecha);
    }

    query += ' ORDER BY r.fecha_hora ASC';
    
    const result = await pool.query(query, values);
    return result.rows;
  }

  static async actualizar(id, datos) {
    const campos = Object.keys(datos);
    const valores = Object.values(datos);
    
    const setClause = campos.map((campo, index) => `${campo} = $${index + 2}`).join(', ');
    const query = `UPDATE reservas SET ${setClause}, fecha_actualizacion = NOW() WHERE id = $1 RETURNING *`;
    
    const result = await pool.query(query, [id, ...valores]);
    return result.rows[0];
  }

  static async cambiarEstado(id, estado) {
    const query = 'UPDATE reservas SET estado = $1, fecha_actualizacion = NOW() WHERE id = $2 RETURNING *';
    const result = await pool.query(query, [estado, id]);
    return result.rows[0];
  }

  static async cancelar(id, motivo = null) {
    const query = 'UPDATE reservas SET estado = \'cancelada\', motivo_cancelacion = $1, fecha_actualizacion = NOW() WHERE id = $2 RETURNING *';
    const result = await pool.query(query, [motivo, id]);
    return result.rows[0];
  }

  static async verificarDisponibilidad(lugar_id, fecha_hora, personas, reserva_id = null) {
    let query = `
      SELECT 
        l.capacidad,
        COALESCE(SUM(r.personas), 0) as reservas_actuales
      FROM lugares l
      LEFT JOIN reservas r ON l.id = r.lugar_id 
        AND DATE(r.fecha_hora) = DATE($1)
        AND r.estado != 'cancelada'
    `;
    
    const values = [fecha_hora];
    let valueIndex = 2;

    if (reserva_id) {
      query += ` AND r.id != $${valueIndex}`;
      values.push(reserva_id);
      valueIndex++;
    }

    query += ` WHERE l.id = $${valueIndex} GROUP BY l.capacidad`;
    values.push(lugar_id);
    
    const result = await pool.query(query, values);
    const lugar = result.rows[0];
    
    if (!lugar) return { disponible: false, motivo: 'Lugar no encontrado' };
    
    const capacidadDisponible = lugar.capacidad - parseInt(lugar.reservas_actuales);
    const disponible = capacidadDisponible >= personas;
    
    return {
      disponible,
      capacidad_total: lugar.capacidad,
      reservas_actuales: parseInt(lugar.reservas_actuales),
      capacidad_disponible: capacidadDisponible,
      personas_solicitadas: personas
    };
  }

  static async obtenerEstadisticas(lugar_id, periodo = 'mes') {
    let fechaInicio;
    switch (periodo) {
      case 'semana':
        fechaInicio = 'NOW() - INTERVAL \'7 days\'';
        break;
      case 'mes':
        fechaInicio = 'NOW() - INTERVAL \'1 month\'';
        break;
      case 'año':
        fechaInicio = 'NOW() - INTERVAL \'1 year\'';
        break;
      default:
        fechaInicio = 'NOW() - INTERVAL \'1 month\'';
    }

    const query = `
      SELECT 
        COUNT(*) as total_reservas,
        SUM(personas) as total_personas,
        AVG(personas) as promedio_personas,
        COUNT(DISTINCT usuario_id) as clientes_unicos,
        COUNT(CASE WHEN estado = 'confirmada' THEN 1 END) as reservas_confirmadas,
        COUNT(CASE WHEN estado = 'cancelada' THEN 1 END) as reservas_canceladas,
        COUNT(CASE WHEN estado = 'completada' THEN 1 END) as reservas_completadas
      FROM reservas 
      WHERE lugar_id = $1 
        AND fecha_hora >= ${fechaInicio}
    `;
    
    const result = await pool.query(query, [lugar_id]);
    return result.rows[0];
  }

  static async obtenerReservasProximas(lugar_id, horas = 24) {
    const query = `
      SELECT r.*, u.nombre as usuario_nombre, u.telefono as usuario_telefono
      FROM reservas r
      INNER JOIN usuarios u ON r.usuario_id = u.id
      WHERE r.lugar_id = $1 
        AND r.fecha_hora >= NOW()
        AND r.fecha_hora <= NOW() + INTERVAL '${horas} hours'
        AND r.estado = 'confirmada'
      ORDER BY r.fecha_hora ASC
    `;
    
    const result = await pool.query(query, [lugar_id]);
    return result.rows;
  }

  static async crearReservaGrupal({ usuario_principal_id, lugar_id, fecha_hora, personas, invitados, notas }) {
    const reserva = await this.crear({
      usuario_id: usuario_principal_id,
      lugar_id,
      fecha_hora,
      personas,
      notas,
      estado: 'confirmada'
    });

    // Crear registros de invitados
    if (invitados && invitados.length > 0) {
      for (const invitado of invitados) {
        await pool.query(
          'INSERT INTO reserva_invitados (reserva_id, usuario_id, confirmado) VALUES ($1, $2, $3)',
          [reserva.id, invitado.usuario_id, invitado.confirmado || false]
        );
      }
    }

    return reserva;
  }
}

module.exports = Reserva; 